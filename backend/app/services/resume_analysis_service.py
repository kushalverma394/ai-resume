from __future__ import annotations

import json
import logging
import re
import time
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from fastapi import HTTPException, status

from app.core.config import Settings
from app.models.history import StoredAnalysis, StoredUpload
from app.prompts.resume_analysis import build_resume_analysis_prompt
from app.schemas.analysis import CoverLetterResponse, HistoryItem, InterviewResponse, JobMatchResponse, ResumeAnalysis
from app.schemas.resume import ExtractedResume
from app.utils.pdf_export import generate_pdf_report
from app.services.text_extraction_service import TextExtractionService


logger = logging.getLogger(__name__)


KEYWORD_LIBRARY = {
    "technical": [
        "python",
        "typescript",
        "javascript",
        "react",
        "next.js",
        "fastapi",
        "sql",
        "postgresql",
        "docker",
        "kubernetes",
        "aws",
        "figma",
        "tailwind",
        "testing",
        "graphql",
        "rest api",
        "data analysis",
        "machine learning",
        "distributed systems",
        "design systems",
    ],
    "soft": [
        "communication",
        "collaboration",
        "leadership",
        "mentorship",
        "stakeholder management",
        "problem solving",
        "ownership",
        "adaptability",
        "product thinking",
        "cross-functional",
    ],
}


class AnalysisStore:
    def __init__(self, history_limit: int) -> None:
        self._history_limit = history_limit
        self._uploads: dict[str, StoredUpload] = {}
        self._analyses: list[StoredAnalysis] = []

    def add_upload(self, upload: StoredUpload) -> None:
        self._uploads[upload.upload_id] = upload

    def get_upload(self, upload_id: str) -> StoredUpload | None:
        return self._uploads.get(upload_id)

    def add_analysis(self, analysis: StoredAnalysis) -> None:
        self._analyses.insert(0, analysis)
        self._analyses = self._analyses[: self._history_limit]

    def list_history(self) -> list[HistoryItem]:
        return [
            HistoryItem(
                analysis_id=item.analysis_id,
                upload_id=item.upload_id,
                filename=item.filename,
                content_type=item.content_type,
                size_bytes=item.size_bytes,
                ats_score=item.analysis.ats_score,
                career_level=item.analysis.career_level,
                recommended_roles=item.analysis.recommended_roles,
                created_at=item.created_at,
            )
            for item in self._analyses
        ]


class ResumeAnalysisService:
    def __init__(
        self,
        settings: Settings,
        store: AnalysisStore,
        text_extractor: TextExtractionService | None = None,
    ) -> None:
        self.settings = settings
        self.store = store
        self.text_extractor = text_extractor or TextExtractionService()
        self._gemini_model = None

    def upload_resume(self, filename: str, content_type: str, data: bytes, size_bytes: int) -> StoredUpload:
        extracted = self.text_extractor.extract(filename, content_type, data, size_bytes)
        upload = StoredUpload(
            upload_id=self._generate_id("upl"),
            filename=extracted.filename,
            content_type=extracted.content_type,
            size_bytes=extracted.size_bytes,
            text=extracted.text,
            text_preview=extracted.text_preview,
            created_at=datetime.now(timezone.utc),
        )
        self.store.add_upload(upload)
        logger.info("Stored upload %s for %s", upload.upload_id, upload.filename)
        return upload

    def analyze_uploaded_file(
        self,
        filename: str,
        content_type: str,
        data: bytes,
        size_bytes: int,
        job_description: str | None = None,
    ) -> ResumeAnalysis:
        extracted = self.text_extractor.extract(filename, content_type, data, size_bytes)
        return self._run_analysis(extracted, job_description, source_upload_id=None)

    def analyze_upload_id(
        self,
        upload_id: str,
        job_description: str | None = None,
    ) -> ResumeAnalysis:
        upload = self.store.get_upload(upload_id)
        if not upload:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Upload not found.")

        extracted = ExtractedResume(
            filename=upload.filename,
            content_type=upload.content_type,
            size_bytes=upload.size_bytes,
            text=upload.text,
            text_preview=upload.text_preview,
        )
        return self._run_analysis(extracted, job_description, source_upload_id=upload.upload_id)

    def delete_analysis(self, analysis_id: str) -> bool:
        before = len(self.store._analyses)
        self.store._analyses = [item for item in self.store._analyses if item.analysis_id != analysis_id]
        return len(self.store._analyses) != before

    def build_job_match(self, extracted: ExtractedResume, job_description: str) -> JobMatchResponse:
        resume_source = self._normalize_text(extracted.text).lower()
        job_source = self._normalize_text(job_description).lower()
        matched = self._find_keywords(f"{resume_source} {job_source}", KEYWORD_LIBRARY["technical"])
        missing = [keyword for keyword in self._build_missing_keywords(job_source) if keyword.lower() not in resume_source]
        match_percentage = min(100, 58 + len(matched) * 6 + max(0, 12 - len(missing) * 2))
        ats_impact = min(100, 65 + len(matched) * 4)
        suggestions = [
            "Mirror the top keywords from the job description in the summary and skills sections.",
            "Quantify outcomes next to the strongest matched competencies.",
            "Add one role-specific bullet that shows ownership across the entire workflow.",
        ]
        summary = (
            f"The resume aligns well with the role on {', '.join(matched[:4]) or 'core experience'}, but still needs stronger evidence for the missing keywords."
        )
        return JobMatchResponse(
            match_percentage=match_percentage,
            ats_impact=ats_impact,
            matched_keywords=matched,
            missing_keywords=missing,
            suggestions=suggestions,
            summary=summary,
        )

    def build_cover_letter(
        self,
        extracted: ExtractedResume,
        job_description: str,
        company_name: str | None = None,
        role_title: str | None = None,
    ) -> CoverLetterResponse:
        skills = self._find_keywords(
            f"{self._normalize_text(extracted.text).lower()} {job_description.lower()}",
            KEYWORD_LIBRARY["technical"],
        )
        company = company_name or "the team"
        role = role_title or "the role"
        opener = f"Dear hiring team at {company},"
        body = [
            f"I am excited to apply for {role}. My background combines product judgment, design systems thinking, and hands-on execution across {', '.join(skills[:3]) or 'modern product workflows'}.",
            "Across my recent work, I have partnered closely with engineering and stakeholders to turn ambiguous goals into clear, shippable work that improved product quality and speed.",
            "What makes this opportunity compelling is the chance to bring a structured, measurable approach to a team that values clarity, execution, and user impact.",
            "I would welcome the opportunity to discuss how I can contribute from day one.",
            "Sincerely,\nKushal Verma",
        ]
        cover_letter = "\n\n".join([opener, *body])
        return CoverLetterResponse(
            company_name=company_name,
            role_title=role_title,
            cover_letter=cover_letter,
            generated_at=datetime.now(timezone.utc),
        )

    def build_interview_pack(
        self,
        extracted: ExtractedResume,
        job_description: str | None,
        role_title: str | None = None,
    ) -> InterviewResponse:
        career_level = self._infer_career_level(extracted.text.lower())
        focus_skill = self._find_keywords(
            f"{self._normalize_text(extracted.text).lower()} {job_description.lower() if job_description else ''}",
            KEYWORD_LIBRARY["technical"],
        )[:1]
        topic = role_title or career_level
        questions = [
            f"Tell me about a project where you used {focus_skill[0] if focus_skill else 'your strongest skill'} to improve a business outcome.",
            f"How do you prioritize tradeoffs when working on a {topic.lower()} role?",
            "Describe how you measure whether your resume narrative is actually resonating with recruiters.",
        ]
        talking_points = [
            "Use one measurable outcome in every answer.",
            "Describe the problem, the decision, and the business result.",
            "End with how you would improve the approach next time.",
        ]
        return InterviewResponse(
            role_title=role_title,
            questions=questions,
            talking_points=talking_points,
            generated_at=datetime.now(timezone.utc),
        )

    def build_export_pdf(self, upload_id: str | None = None, analysis_id: str | None = None) -> tuple[bytes, str]:
        analysis = None
        if analysis_id:
            analysis = next((item for item in self.store._analyses if item.analysis_id == analysis_id), None)
        if analysis is None and upload_id:
            analysis = next((item for item in self.store._analyses if item.upload_id == upload_id), None)
        if analysis is None and self.store._analyses:
            analysis = self.store._analyses[0]
        if analysis is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found.")

        sections = [
            ("Resume Analysis", [f"File: {analysis.filename}", f"ATS Score: {analysis.analysis.ats_score}%", f"Career level: {analysis.analysis.career_level}"]),
            ("Summary", [analysis.analysis.summary]),
            ("Strengths", analysis.analysis.strengths),
            ("Weaknesses", analysis.analysis.weaknesses),
            ("Recommended roles", analysis.analysis.recommended_roles),
        ]
        pdf_bytes = generate_pdf_report("AI Resume Analyzer Pro Report", sections)
        filename = f"{analysis.filename.rsplit('.', 1)[0]}-analysis.pdf"
        return pdf_bytes, filename

    def _run_analysis(
        self,
        extracted: ExtractedResume,
        job_description: str | None,
        source_upload_id: str | None,
    ) -> ResumeAnalysis:
        analysis = self._analyze_with_gemini(extracted.text, job_description)
        if analysis is None:
            analysis = self._build_local_analysis(extracted.text, job_description)

        self._store_analysis(extracted, analysis, source_upload_id)
        return analysis

    def _store_analysis(
        self,
        extracted: ExtractedResume,
        analysis: ResumeAnalysis,
        source_upload_id: str | None,
    ) -> None:
        upload_id = source_upload_id or self._generate_id("upl")
        if not source_upload_id:
            self.store.add_upload(
                StoredUpload(
                    upload_id=upload_id,
                    filename=extracted.filename,
                    content_type=extracted.content_type,
                    size_bytes=extracted.size_bytes,
                    text=extracted.text,
                    text_preview=extracted.text_preview,
                    created_at=datetime.now(timezone.utc),
                )
            )

        stored_analysis = StoredAnalysis(
            analysis_id=self._generate_id("ana"),
            upload_id=upload_id,
            filename=extracted.filename,
            content_type=extracted.content_type,
            size_bytes=extracted.size_bytes,
            analysis=analysis,
            created_at=datetime.now(timezone.utc),
        )
        self.store.add_analysis(stored_analysis)

    def _analyze_with_gemini(self, resume_text: str, job_description: str | None) -> ResumeAnalysis | None:
        if not self.settings.gemini_api_key:
            logger.warning("GEMINI_API_KEY is not configured. Falling back to local analysis.")
            return None

        try:
            import google.generativeai as genai
        except Exception as exc:  # pragma: no cover - dependency issue
            logger.exception("Gemini client import failed: %s", exc)
            return None

        if self._gemini_model is None:
            genai.configure(api_key=self.settings.gemini_api_key)
            self._gemini_model = genai.GenerativeModel(self.settings.gemini_model)

        prompt = build_resume_analysis_prompt(resume_text, job_description)

        def invoke() -> str:
            response = self._gemini_model.generate_content(prompt)
            text = getattr(response, "text", "") or ""
            if not text:
                raise RuntimeError("Gemini returned an empty response.")
            return text

        try:
            raw_text = self._retry(invoke)
            parsed = self._parse_json_response(raw_text)
            return ResumeAnalysis.model_validate(parsed)
        except Exception as exc:
            logger.exception("Gemini analysis failed, using local fallback: %s", exc)
            return None

    def _build_local_analysis(self, resume_text: str, job_description: str | None) -> ResumeAnalysis:
        normalized_text = self._normalize_text(resume_text)
        combined_source = " ".join([normalized_text, job_description or ""]).lower()
        technical_skills = self._find_keywords(combined_source, KEYWORD_LIBRARY["technical"])
        soft_skills = self._find_keywords(combined_source, KEYWORD_LIBRARY["soft"])
        missing_keywords = self._build_missing_keywords(combined_source)

        word_count = len(normalized_text.split())
        ats_score = min(98, 68 + len(technical_skills) * 3 + len(soft_skills) * 2)
        grammar_score = 80 + min(15, word_count // 300)
        formatting_score = 78 + min(18, len(normalized_text.splitlines()) // 4)

        career_level = self._infer_career_level(normalized_text)
        recommended_roles = self._recommend_roles(technical_skills, career_level)

        improved_bullets = self._generate_bullet_improvements(normalized_text)
        strengths = self._build_strengths(technical_skills, soft_skills, word_count)
        weaknesses = self._build_weaknesses(missing_keywords, word_count)
        interview_questions = self._build_interview_questions(career_level, technical_skills)

        summary = (
            f"The resume shows {career_level.lower()}-level positioning with strong evidence of {', '.join(technical_skills[:3]) or 'technical capability'}. "
            f"It is readable and relevant, but would benefit from sharper ATS keyword alignment and more measurable outcomes."
        )

        overall_feedback = (
            "This resume is close to interview-ready. Strengthen the keyword match, tighten long bullets, and emphasize measurable impact to improve ATS performance and recruiter readability."
        )

        return ResumeAnalysis(
            ats_score=ats_score,
            summary=summary,
            strengths=strengths,
            weaknesses=weaknesses,
            technical_skills=technical_skills,
            soft_skills=soft_skills,
            missing_keywords=missing_keywords,
            grammar_score=min(99, grammar_score),
            formatting_score=min(98, formatting_score),
            improved_bullets=improved_bullets,
            career_level=career_level,
            recommended_roles=recommended_roles,
            interview_questions=interview_questions,
            overall_feedback=overall_feedback,
        )

    @staticmethod
    def _normalize_text(text: str) -> str:
        return re.sub(r"\s+", " ", text).strip()

    @staticmethod
    def _find_keywords(source: str, keywords: list[str]) -> list[str]:
        found = [keyword for keyword in keywords if keyword in source]
        return sorted(dict.fromkeys(found), key=lambda item: item.lower())

    @staticmethod
    def _build_missing_keywords(source: str) -> list[str]:
        candidate_keywords = [
            "accessibility",
            "experiment",
            "a/b testing",
            "design system",
            "leadership",
            "stakeholder",
            "analytics",
            "performance",
        ]
        return [keyword.title() for keyword in candidate_keywords if keyword not in source][:6]

    @staticmethod
    def _infer_career_level(text: str) -> str:
        seniority_keywords = {
            "Executive": ["c-level", "vp", "vice president", "director"],
            "Staff": ["staff", "principal", "lead", "architect"],
            "Senior": ["senior", "sr.", "7+ years", "8+ years"],
            "Mid-level": ["3+ years", "4+ years", "5+ years"],
        }
        for level, indicators in seniority_keywords.items():
            if any(indicator in text for indicator in indicators):
                return level
        return "Mid-level"

    @staticmethod
    def _recommend_roles(skills: list[str], career_level: str) -> list[str]:
        base_roles = {
            "Executive": ["Head of Product Design", "Director of UX", "VP of Design Systems"],
            "Staff": ["Staff Product Designer", "Principal Frontend Engineer", "Design Systems Lead"],
            "Senior": ["Senior Product Designer", "Senior Frontend Engineer", "Design Systems Manager"],
            "Mid-level": ["Product Designer", "Frontend Engineer", "Design Systems Designer"],
        }
        roles = base_roles.get(career_level, base_roles["Mid-level"])
        if any(skill in {"python", "fastapi", "sql"} for skill in skills):
            roles = [*roles, "Full Stack Engineer"]
        return list(dict.fromkeys(roles))

    @staticmethod
    def _generate_bullet_improvements(text: str) -> list[str]:
        sentences = [sentence.strip() for sentence in re.split(r"[\n\.;]", text) if sentence.strip()]
        improved: list[str] = []
        for sentence in sentences[:3]:
            improved.append(f"Led {sentence[:100].lower()} with measurable impact and clearer outcomes.")
        return improved or ["Rewrite bullets to start with action verbs and attach quantified outcomes."]

    @staticmethod
    def _build_strengths(technical_skills: list[str], soft_skills: list[str], word_count: int) -> list[str]:
        strengths = []
        if technical_skills:
            strengths.append(f"Clear coverage of core technical skills such as {', '.join(technical_skills[:3])}.")
        if soft_skills:
            strengths.append(f"Strong collaboration and communication signals including {', '.join(soft_skills[:3])}.")
        if word_count > 200:
            strengths.append("Provides enough substance for recruiters to evaluate experience depth quickly.")
        return strengths or ["Resume content is well-structured and readable."]

    @staticmethod
    def _build_weaknesses(missing_keywords: list[str], word_count: int) -> list[str]:
        weaknesses = []
        if missing_keywords:
            weaknesses.append(f"Missing or underrepresented keywords: {', '.join(missing_keywords[:4])}.")
        if word_count < 120:
            weaknesses.append("The resume may be too short to fully showcase relevant impact.")
        weaknesses.append("Some bullets can be tightened to improve scanning speed.")
        return weaknesses[:3]

    @staticmethod
    def _build_interview_questions(career_level: str, skills: list[str]) -> list[str]:
        focus_skill = skills[0] if skills else "your most important project"
        return [
            f"Walk me through a project where you used {focus_skill} to deliver business impact.",
            f"How do you tailor your approach differently for a {career_level.lower()} role?",
            "How do you prioritize resume changes when ATS keywords conflict with readability?",
        ]

    @staticmethod
    def _parse_json_response(raw_text: str) -> dict[str, Any]:
        cleaned = raw_text.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.strip("`")
            if cleaned.lower().startswith("json"):
                cleaned = cleaned[4:].strip()

        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start == -1 or end == -1 or end <= start:
            raise ValueError("Gemini response did not contain JSON.")

        return json.loads(cleaned[start : end + 1])

    @staticmethod
    def _retry(func, attempts: int = 3, base_delay: float = 0.75):
        last_error: Exception | None = None
        for attempt in range(attempts):
            try:
                return func()
            except Exception as exc:  # pragma: no cover - network/transient handling
                last_error = exc
                if attempt == attempts - 1:
                    raise
                time.sleep(base_delay * (2**attempt))
        if last_error:
            raise last_error
        raise RuntimeError("Retry wrapper failed unexpectedly.")

    @staticmethod
    def _generate_id(prefix: str) -> str:
        return f"{prefix}_{uuid4().hex[:12]}"