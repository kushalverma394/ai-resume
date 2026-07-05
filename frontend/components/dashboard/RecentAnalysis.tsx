import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type RecentAnalysisEntry = {
  title: string;
  company: string;
  score: number;
  status: string;
  date: string;
};

type RecentAnalysisProps = {
  items?: RecentAnalysisEntry[];
};

const fallbackItems: RecentAnalysisEntry[] = [
  {
    title: "Senior Product Designer Resume",
    company: "Nova Labs",
    score: 92,
    status: "Interview Ready",
    date: "Today",
  },
  {
    title: "Frontend Engineer Portfolio",
    company: "Arc Systems",
    score: 88,
    status: "Strong Match",
    date: "Yesterday",
  },
  {
    title: "Design Systems Lead Resume",
    company: "Orbit Health",
    score: 84,
    status: "Needs Refinement",
    date: "2 days ago",
  },
];

export default function RecentAnalysis({ items = fallbackItems }: RecentAnalysisProps) {
  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-white">Recent analysis</CardTitle>
          <CardDescription className="text-slate-400">Your latest resume reviews and job matches.</CardDescription>
        </div>
        <Button variant="ghost" className="text-cyan-200 hover:bg-white/[0.04] hover:text-white" render={<Link href="/history" />}>
          View all
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 pb-5">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/10 bg-[#070d1a] px-4 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-medium text-white">{item.title}</div>
                <div className="text-sm text-slate-400">{item.company}</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
                  {item.score}% ATS
                </Badge>
                <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-slate-300">
                  {item.status}
                </Badge>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-500">Updated {item.date}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}