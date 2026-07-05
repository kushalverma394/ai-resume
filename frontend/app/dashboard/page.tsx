import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardCards from "@/components/dashboard/DashboardCards";
import RecentAnalysis from "@/components/dashboard/RecentAnalysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dashboardStats, recentAnalyses } from "@/lib/dashboard-data";

export default function DashboardPage() {
  return (
    <DashboardShell
      title="Dashboard"
      description="Track resume performance, recent outcomes, and your most important hiring signals in one place."
    >
      <div className="space-y-6 py-6">
        <DashboardCards />

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <RecentAnalysis />

          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
              <CardTitle className="text-white">Performance snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-6">
              {recentAnalyses.map((item) => (
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
            {dashboardStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#070d1a] px-4 py-4">
                <div className="text-sm text-slate-400">{stat.label}</div>
                <div className="mt-2 text-2xl font-semibold text-white">{stat.value}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}