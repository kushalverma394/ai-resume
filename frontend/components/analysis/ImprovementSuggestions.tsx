import { ArrowRight, WandSparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ImprovementSuggestionsProps = {
  recommendations: string[];
  bulletImprovements: Array<{ before: string; after: string }> | string[];
};

export default function ImprovementSuggestions({ recommendations, bulletImprovements }: ImprovementSuggestionsProps) {
  const isStructuredBullets = typeof bulletImprovements[0] === "object";

  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardHeader>
        <CardTitle className="text-white">AI recommendations and bullet improvements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pb-6">
        <div className="space-y-3">
          {recommendations.map((recommendation) => (
            <div key={recommendation} className="flex items-start gap-3 rounded-2xl border border-cyan-400/15 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-50">
              <WandSparkles className="mt-0.5 size-4 text-cyan-200" />
              <span>{recommendation}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {isStructuredBullets
            ? (bulletImprovements as Array<{ before: string; after: string }>).map((item) => (
                <div key={item.before} className="rounded-2xl border border-white/10 bg-[#070d1a] px-4 py-4 text-sm text-slate-300">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Before</div>
                  <p className="mt-1">{item.before}</p>
                  <ArrowRight className="my-3 size-4 text-cyan-300" />
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">After</div>
                  <p className="mt-1 text-white">{item.after}</p>
                </div>
              ))
            : (bulletImprovements as string[]).map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-[#070d1a] px-4 py-4 text-sm text-slate-300">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Suggested bullet</div>
                  <p className="mt-2 text-white">{item}</p>
                </div>
              ))}
        </div>
      </CardContent>
    </Card>
  );
}