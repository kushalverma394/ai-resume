import { dashboardStats, type StatCard } from "@/lib/dashboard-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardCardsProps = {
  stats?: StatCard[];
};

export default function DashboardCards({ stats = dashboardStats }: DashboardCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.label}
            className="border-white/10 bg-white/[0.04] shadow-[0_18px_55px_rgba(8,15,34,0.25)]"
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div className="space-y-1">
                <CardDescription className="text-slate-400">{stat.label}</CardDescription>
                <CardTitle className="text-3xl font-semibold tracking-[-0.04em] text-white">
                  {stat.value}
                </CardTitle>
              </div>
              <div className="flex size-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                <Icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent className="pb-5">
              <p className="text-sm text-cyan-200/80">{stat.change}</p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}