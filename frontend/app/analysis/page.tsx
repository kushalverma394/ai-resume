import DashboardShell from "@/components/dashboard/DashboardShell";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analysisSummary } from "@/lib/dashboard-data";

export default function AnalysisPage() {
  return (
    <DashboardShell
      title="Analysis"
      description="Detailed mock AI analysis with ATS scoring, skill profiling, suggestions, and interview preparation."
    >
      <div className="space-y-6 py-6">
        <ATSScoreCard
          atsScore={analysisSummary.atsScore}
          keywordMatch={analysisSummary.keywordMatch}
          grammarScore={analysisSummary.grammarScore}
          formattingScore={analysisSummary.formattingScore}
          jobDescriptionMatch={analysisSummary.jobDescriptionMatch}
        />

        <div className="grid gap-6 xl:grid-cols-2">
          <ResumeSummary summary={analysisSummary.resumeSummary} />
          <JobMatchCard match={analysisSummary.jobDescriptionMatch} />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <StrengthsCard strengths={analysisSummary.strengths} />
          <WeaknessesCard weaknesses={analysisSummary.weaknesses} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <SkillsChart />
          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
              <CardTitle className="text-white">Technical and soft skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pb-6">
              <div>
                <div className="mb-3 text-xs uppercase tracking-[0.28em] text-slate-500">Technical skills</div>
                <div className="flex flex-wrap gap-2">
                  {analysisSummary.technicalSkills.map((skill) => (
                    <Badge key={skill} variant="outline" className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-3 text-xs uppercase tracking-[0.28em] text-slate-500">Soft skills</div>
                <div className="flex flex-wrap gap-2">
                  {analysisSummary.softSkills.map((skill) => (
                    <Badge key={skill} variant="outline" className="border-white/10 bg-white/[0.03] text-slate-200">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <MissingKeywords keywords={analysisSummary.missingSkills} />
            </CardContent>
          </Card>
        </div>

        <ImprovementSuggestions
          recommendations={analysisSummary.recommendations}
          bulletImprovements={analysisSummary.bulletImprovements}
        />

        <InterviewQuestions questions={analysisSummary.interviewQuestions} />

        <div className="grid gap-6 xl:grid-cols-2">
          <ResumeSummary summary={`Technical skills: ${analysisSummary.technicalSkills.join(", ")}. Soft skills: ${analysisSummary.softSkills.join(", ")}.`} />
          <JobMatchCard match={analysisSummary.keywordMatch} />
        </div>
      </div>
    </DashboardShell>
  );
}