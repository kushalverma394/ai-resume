"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, FileText, LayoutDashboard, Sparkles } from "lucide-react";

import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardCards from "@/components/dashboard/DashboardCards";
import RecentAnalysis from "@/components/dashboard/RecentAnalysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchHistory } from "@/lib/api";
import type { HistoryItem } from "@/lib/types";
import type { StatCard } from "@/lib/dashboard-data";

type RecentEntry = {
  title: string;
  company: string;
  score: number;
  status: string;
  date: string;
};

export default function DashboardPage() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchHistory(20);
        setHistoryItems(response.items);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Unable to load dashboard data.");
      }
    };

    void load();
  }, []);

  const recentItems = useMemo<RecentEntry[]>(
    () =>
      historyItems.slice(0, 3).map((item) => ({
        title: item.filename,
        company: item.recommended_roles[0] || item.career_level,
        score: item.ats_score,
        status: item.career_level,
        date: new Date(item.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      })),
    [historyItems]
  );

  const stats = useMemo<StatCard[]>(() => {
    const averageScore = historyItems.length
      ? Math.round(historyItems.reduce((sum, item) => sum + item.ats_score, 0) / historyItems.length)
      : 0;

    return [
      { label: "Total Resumes", value: String(historyItems.length || 0), change: `${historyItems.length} analyses tracked`, icon: FileText },
      { label: "Average ATS Score", value: `${averageScore}%`, change: averageScore > 0 ? `Across ${historyItems.length} reports` : "No analyses yet", icon: Sparkles },
      { label: "Job Matches", value: String(historyItems.filter((item) => item.ats_score >= 85).length), change: "High-confidence matches", icon: BriefcaseBusiness },
      { label: "Interview-Ready", value: String(historyItems.filter((item) => item.ats_score >= 90).length), change: "Strong performer resumes", icon: ArrowUpRight },
    ];
  }, [historyItems]);

  return (
    <DashboardShell
      title="Dashboard"
      description="Track resume performance, recent outcomes, and your most important hiring signals in one place."
    >
      <div className="space-y-6 py-6">
        {errorMessage ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{errorMessage}</div>
        ) : null}

        <DashboardCards stats={stats} />

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <RecentAnalysis items={recentItems} />

          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
              <CardTitle className="text-white">Performance snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-6">
              {recentItems.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-[#070d1a] px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-white">{item.company}</div>
                      <div className="text-sm text-slate-400">{item.title}</div>
                    </div>
                    <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
                      {item.score}%
                    </Badge>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle className="text-white">Team metrics</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 pb-6">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#070d1a] px-4 py-4">
                <div className="mt-1 text-xs text-slate-400">{stat.change}</div>
                <div className="mt-2 text-2xl font-semibold text-white">{stat.value}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}