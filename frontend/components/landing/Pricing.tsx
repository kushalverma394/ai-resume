import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    name: "Starter",
    price: "$0",
    summary: "For trying the resume analysis flow.",
    features: ["3 resume analyses", "Basic ATS scoring", "PDF and DOCX upload"],
  },
  {
    name: "Pro",
    price: "$19",
    summary: "For active job seekers and power users.",
    features: ["Unlimited analyses", "Job match and cover letters", "Interview prep and exports"],
    featured: true,
  },
  {
    name: "Team",
    price: "Custom",
    summary: "For recruiters and career coaches.",
    features: ["Workspace analytics", "Bulk review flows", "Priority support"],
  },
];

export default function Pricing() {
  return (
    <section className="space-y-8">
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.32em] text-cyan-200/80">Pricing</p>
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">Simple plans that scale with the job hunt.</h2>
        <p className="text-lg leading-8 text-slate-300">Start free, then upgrade when you need repeatable analysis, matching, and export workflows.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`border-white/10 bg-white/[0.04] ${plan.featured ? "ring-1 ring-cyan-400/30 shadow-[0_24px_80px_rgba(34,211,238,0.1)]" : ""}`}
          >
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-white">{plan.name}</CardTitle>
                {plan.featured ? <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">Most popular</span> : null}
              </div>
              <div className="text-4xl font-semibold tracking-[-0.04em] text-white">{plan.price}</div>
              <p className="text-sm text-slate-400">{plan.summary}</p>
            </CardHeader>
            <CardContent className="space-y-4 pb-6">
              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                    <Check className="size-4 text-cyan-200" />
                    {feature}
                  </div>
                ))}
              </div>
              <Button className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400" render={<a href="/signup" />}>
                Choose {plan.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}