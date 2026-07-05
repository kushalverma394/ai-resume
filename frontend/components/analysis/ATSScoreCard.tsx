import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ATSScoreCardProps = {
  atsScore: number;
  keywordMatch: number;
  grammarScore: number;
  formattingScore: number;
  jobDescriptionMatch: number;
};

export default function ATSScoreCard({
  atsScore,
  keywordMatch,
  grammarScore,
  formattingScore,
  jobDescriptionMatch,
}: ATSScoreCardProps) {
  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-white">ATS score</CardTitle>
            <CardDescription className="text-slate-400">Resume readiness based on the current job description.</CardDescription>
          </div>
          <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
            AI-powered
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pb-6">
        <div className="flex items-center gap-5">
          <div className="relative flex size-28 items-center justify-center rounded-full border border-cyan-400/20 bg-[radial-gradient(circle,rgba(34,211,238,0.22),rgba(7,13,26,0.22)_60%)] shadow-[0_0_60px_rgba(34,211,238,0.18)]">
            <div className="text-center">
              <div className="text-4xl font-semibold tracking-[-0.04em] text-white">{atsScore}%</div>
              <div className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/70">Score</div>
            </div>
          </div>

          <div className="grid flex-1 gap-3 sm:grid-cols-2">
            {[
              ["Keyword match", `${keywordMatch}%`],
              ["Grammar score", `${grammarScore}%`],
              ["Formatting score", `${formattingScore}%`],
              ["JD match", `${jobDescriptionMatch}%`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-[#070d1a] px-4 py-3">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</div>
                <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}