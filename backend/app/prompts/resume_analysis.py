from __future__ import annotations


def build_resume_analysis_prompt(resume_text: str, job_description: str | None = None) -> str:
    job_description_section = job_description.strip() if job_description else "No specific job description provided."

    return f"""
You are an expert resume analyst.
Review the resume text and return a single JSON object with exactly these keys:
ats_score, summary, strengths, weaknesses, technical_skills, soft_skills, missing_keywords,
grammar_score, formatting_score, improved_bullets, career_level, recommended_roles,
interview_questions, overall_feedback.

Rules:
- Return valid JSON only.
- Scores must be integers from 0 to 100.
- Arrays must contain concise, specific items.
- improved_bullets must be rewritten resume bullet suggestions.
- career_level should be one of: Entry-level, Mid-level, Senior, Staff, Executive.
- recommended_roles should contain realistic role titles.
- overall_feedback should be one concise paragraph.

Job description:
{job_description_section}

Resume text:
{resume_text}
""".strip()