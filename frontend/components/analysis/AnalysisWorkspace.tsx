"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, Download, LoaderCircle, Sparkles } from "lucide-react";

import ATSScoreCard from "@/components/analysis/ATSScoreCard";
import ResumeSummary from "@/components/analysis/ResumeSummary";
import StrengthsCard from "@/components/analysis/StrengthsCard";
import WeaknessesCard from "@/components/analysis/WeaknessesCard";
import MissingKeywords from "@/components/analysis/MissingKeywords";
import SkillsChart from "@/components/analysis/SkillsChart";
import ImprovementSuggestions from "@/components/analysis/ImprovementSuggestions";
import InterviewQuestions from "@/components/analysis/InterviewQuestions";
import JobMatchCard from "@/components/analysis/JobMatchCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { analyzeResume, exportResume, fetchCoverLetter, fetchInterview, fetchJobMatch, fetchHistory, type ResumeAnalysis } from "@/lib/api";

type SessionPayload = {
  uploadId: string;
  filename: string;
  analysis: ResumeAnalysis;
};

function buildSkillData(analysis: ResumeAnalysis | null, jobMatchScore: number | null) {
  if (!analysis) {
    return [
      { category: "Technical", score: 0 },
      { category: "Communication", score: 0 },
      { category: "Execution", score: 0 },
      { category: "ATS", score: 0 },
    ];
  }

  return [
    { category: "Technical", score: Math.min(100, analysis.technical_skills.length * 14 + 16) },
    { category: "Communication", score: Math.min(100, analysis.soft_skills.length * 12 + 24) },
    { category: "Execution", score: analysis.formatting_score },
    { category: "Grammar", score: analysis.grammar_score },
    { category: "ATS", score: jobMatchScore ?? analysis.ats_score },
    { category: "Impact", score: Math.min(100, analysis.ats_score + 2) },
  ];
}

export default function AnalysisWorkspace() {
  const searchParams = useSearchParams();
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [uploadId, setUploadId] = useState<string>("");
  const [jobDescription, setJobDescription] = useState("");
  const [roleTitle, setRoleTitle] = useState("Senior Product Designer");
  const [companyName, setCompanyName] = useState("Nova Labs");
  const [jobMatchScore, setJobMatchScore] = useState<number | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionState, setActionState] = useState<"idle" | "matching" | "cover-letter" | "interview" | "export">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const hydrate = async () => {
      try {
        const stored = window.sessionStorage.getItem("ai-resume-latest-analysis");
        const uploadIdFromQuery = searchParams.get("upload_id") || searchParams.get("uploadId");

        if (stored) {
          const parsed = JSON.parse(stored) as SessionPayload;
          setUploadId(parsed.uploadId);
          setAnalysis(parsed.analysis);
          setInterviewQuestions(parsed.analysis.interview_questions);
          setLoading(false);
          return;
        }

        if (uploadIdFromQuery) {
          const analysisResponse = await fetchHistory(1);
          const latestUploadId = analysisResponse.items[0]?.upload_id || uploadIdFromQuery;
          setUploadId(latestUploadId);
          const nextAnalysis = await analyzeResume({ uploadId: latestUploadId });
          setAnalysis(nextAnalysis);
          setInterviewQuestions(nextAnalysis.interview_questions);
          return;
        }

        const latestHistory = await fetchHistory(1);
        if (latestHistory.items[0]) {
          const latestUploadId = latestHistory.items[0].upload_id;
          setUploadId(latestUploadId);
          const nextAnalysis = await analyzeResume({ uploadId: latestUploadId });
          setAnalysis(nextAnalysis);
          setInterviewQuestions(nextAnalysis.interview_questions);
          return;
        }

        setErrorMessage("Upload a resume to generate analysis.");
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Unable to load analysis.");
      } finally {
        setLoading(false);
      }
    };

    void hydrate();
  }, [searchParams]);

  const technicalSkills = analysis?.technical_skills ?? [];
  const softSkills = analysis?.soft_skills ?? [];
  const missingKeywords = analysis?.missing_keywords ?? [];
  const skillsData = useMemo(() => buildSkillData(analysis, jobMatchScore), [analysis, jobMatchScore]);

  const runJobMatch = async () => {
    if (!uploadId || !jobDescription.trim()) {
      setErrorMessage("Add a job description before generating a match.");
      return;
    }

    setActionState("matching");
    setErrorMessage("");

    try {
      const response = await fetchJobMatch({ uploadId, jobDescription });
      setJobMatchScore(response.match_percentage);
      setInterviewQuestions((current) => (current.length > 0 ? current : analysis?.interview_questions || []));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to generate job match.");
    } finally {
      setActionState("idle");
    }
  };

  const generateCoverLetter = async () => {
    if (!uploadId || !jobDescription.trim()) {
      setErrorMessage("Add a job description before generating a cover letter.");
      return;
    }

    setActionState("cover-letter");
    setErrorMessage("");

    try {
      const response = await fetchCoverLetter({ uploadId, jobDescription, companyName, roleTitle });
      setCoverLetter(response.cover_letter);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to generate cover letter.");
    } finally {
      setActionState("idle");
    }
  };

  const generateInterviewPack = async () => {
    if (!uploadId) {
      setErrorMessage("Upload a resume first.");
      return;
    }

    setActionState("interview");
    setErrorMessage("");

    try {
      const response = await fetchInterview({ uploadId, jobDescription, roleTitle });
      setInterviewQuestions(response.questions);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to generate interview questions.");
    } finally {
      setActionState("idle");
    }
  };

  const exportPdf = async () => {
    if (!uploadId) {
      setErrorMessage("Upload a resume before exporting.");
      return;
    }

    setActionState("export");
    setErrorMessage("");

    try {
      const blob = await exportResume({ uploadId });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "ai-resume-analysis.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to export PDF.");
    } finally {
      setActionState("idle");
    }
  };

  const copyCoverLetter = async () => {
    if (!coverLetter) {
      return;
    }

    await navigator.clipboard.writeText(coverLetter);
  };

  if (loading) {
    return (
      <div className="py-6 text-sm text-slate-400">Loading analysis workspace...</div>
    );
  }

  if (!analysis) {
    return (
      <div className="space-y-4 py-6">
        {errorMessage ? <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{errorMessage}</div> : null}
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-10 text-center text-sm text-slate-400">
          Upload a resume to generate live analysis.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      {errorMessage ? <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{errorMessage}</div> : null}

      <ATSScoreCard
        atsScore={analysis.ats_score}
        keywordMatch={Math.max(0, 100 - missingKeywords.length * 12)}
        grammarScore={analysis.grammar_score}
        formattingScore={analysis.formatting_score}
        jobDescriptionMatch={jobMatchScore ?? analysis.ats_score}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <ResumeSummary summary={analysis.summary} />
        <JobMatchCard match={jobMatchScore ?? analysis.ats_score} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <StrengthsCard strengths={analysis.strengths} />
        <WeaknessesCard weaknesses={analysis.weaknesses} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SkillsChart data={skillsData} />
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle className="text-white">Technical and soft skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pb-6">
            <div>
              <div className="mb-3 text-xs uppercase tracking-[0.28em] text-slate-500">Technical skills</div>
              <div className="flex flex-wrap gap-2">
                {technicalSkills.map((skill) => (
                  <Badge key={skill} variant="outline" className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-3 text-xs uppercase tracking-[0.28em] text-slate-500">Soft skills</div>
              <div className="flex flex-wrap gap-2">
                {softSkills.map((skill) => (
                  <Badge key={skill} variant="outline" className="border-white/10 bg-white/[0.03] text-slate-200">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <MissingKeywords keywords={missingKeywords} />
          </CardContent>
        </Card>
      </div>

      <ImprovementSuggestions
        recommendations={[analysis.overall_feedback, `Focus on ${analysis.recommended_roles[0] || analysis.career_level} positioning.`]}
        bulletImprovements={analysis.improved_bullets}
      />

      <InterviewQuestions questions={interviewQuestions.length > 0 ? interviewQuestions : analysis.interview_questions} />

      <Card className="border-white/10 bg-white/[0.04]">
        <CardHeader>
          <CardTitle className="text-white">Job description and generation tools</CardTitle>
          <CardDescription className="text-slate-400">Paste a target role to generate a job match, cover letter, and interview prep.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200" htmlFor="job-description">
                Paste job description
              </label>
              <textarea
                id="job-description"
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste the role description here"
                className="min-h-[10rem] w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200" htmlFor="role-title">
                Role title
              </label>
              <Input id="role-title" value={roleTitle} onChange={(event) => setRoleTitle(event.target.value)} className="h-11 border-white/10 bg-white/[0.03] text-white placeholder:text-slate-500" />
              <label className="mt-3 block text-sm font-medium text-slate-200" htmlFor="company-name">
                Company name
              </label>
              <Input id="company-name" value={companyName} onChange={(event) => setCompanyName(event.target.value)} className="h-11 border-white/10 bg-white/[0.03] text-white placeholder:text-slate-500" />

              <div className="mt-4 flex flex-wrap gap-3">
                <Button type="button" onClick={runJobMatch} className="bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400" disabled={actionState !== "idle"}>
                  {actionState === "matching" ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                  Match JD
                </Button>
                <Button type="button" variant="outline" onClick={generateCoverLetter} className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]" disabled={actionState !== "idle"}>
                  {actionState === "cover-letter" ? <LoaderCircle className="size-4 animate-spin" /> : null}
                  Generate cover letter
                </Button>
                <Button type="button" variant="outline" onClick={generateInterviewPack} className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]" disabled={actionState !== "idle"}>
                  {actionState === "interview" ? <LoaderCircle className="size-4 animate-spin" /> : null}
                  Interview pack
                </Button>
                <Button type="button" variant="outline" onClick={exportPdf} className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]" disabled={actionState !== "idle"}>
                  {actionState === "export" ? <LoaderCircle className="size-4 animate-spin" /> : <Download className="size-4" />}
                  Export PDF
                </Button>
              </div>
            </div>
          </div>

          {jobMatchScore !== null ? (
            <div className="rounded-3xl border border-white/10 bg-[#070d1a] px-4 py-4">
              <div className="text-sm text-slate-400">Job description match</div>
              <div className="mt-2 text-3xl font-semibold text-white">{jobMatchScore}%</div>
            </div>
          ) : null}

          {coverLetter ? (
            <div className="rounded-3xl border border-white/10 bg-[#070d1a] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-white">Generated cover letter</div>
                  <div className="text-sm text-slate-400">Ready to copy or download.</div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={copyCoverLetter} className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]">
                    <Copy className="size-4" />
                    Copy
                  </Button>
                </div>
              </div>
              <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-7 text-slate-200">
                {coverLetter}
              </pre>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}