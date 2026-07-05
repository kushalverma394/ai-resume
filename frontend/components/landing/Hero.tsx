import { ArrowRight, BadgeCheck, Sparkles } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const quickMetrics = [
  { label: "ATS accuracy", value: "94%" },
  { label: "Insights delivered", value: "12k+" },
  { label: "Avg. score lift", value: "+28" },
];

const suggestions = [
  "Quantify impact with hiring metrics",
  "Add missing role keywords from the JD",
  "Shorten summary for better ATS readability",
];

export default function Hero() {
  return (
    <section className="grid items-center gap-16 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pt-14">
      <div className="relative z-10 max-w-2xl">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="border-cyan-400/25 bg-cyan-400/10 text-cyan-100">
            <Sparkles className="mr-1 size-3.5" />
            Premium AI workflow
          </Badge>
          <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-slate-200">
            <BadgeCheck className="mr-1 size-3.5 text-cyan-300" />
            Built for modern hiring teams
          </Badge>
        </div>

        <h1 className="max-w-xl text-5xl font-semibold tracking-[-0.04em] text-balance text-white sm:text-6xl lg:text-7xl">
          Turn any resume into an interview-ready profile.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
          AI Resume Analyzer Pro scores resumes against job descriptions, highlights ATS gaps,
          and generates precise improvements that raise shortlist rates without noisy guesswork.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_32px_rgba(34,211,238,0.24)] hover:from-cyan-300 hover:to-blue-400"
            render={<Link href="/signup" />}
          >
            Get Started Free
            <ArrowRight />
          </Button>
          <Button
            variant="outline"
            className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
            render={<Link href="#features" />}
          >
            See Features
          </Button>
        </div>

        <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
          {quickMetrics.map((metric) => (
            <div key={metric.label} className="space-y-1">
              <div className="text-2xl font-semibold text-white">{metric.value}</div>
              <div className="text-sm text-slate-400">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute -left-16 top-10 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl animate-float" />
        <div className="absolute -right-12 bottom-4 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl animate-drift" />

        <Card className="relative overflow-hidden border-white/10 bg-white/[0.04] p-0 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
          <div className="border-b border-white/10 px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-300">Resume Intelligence</p>
                <p className="text-sm text-slate-500">Live analysis for product designers</p>
              </div>
              <Badge className="bg-emerald-400/15 text-emerald-200 hover:bg-emerald-400/15">ATS 92</Badge>
            </div>
          </div>

          <CardContent className="grid gap-4 p-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="border-white/10 bg-[#070d1a] p-0">
              <CardHeader className="space-y-4 pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Match score</CardTitle>
                  <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-slate-200">
                    92%
                  </Badge>
                </div>
                <CardDescription className="text-slate-400">
                  Strong alignment with the posted role and required competencies.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="mx-auto flex size-36 items-center justify-center rounded-full border border-cyan-400/20 bg-[radial-gradient(circle,rgba(34,211,238,0.24),rgba(15,23,42,0.2)_60%)] shadow-[0_0_60px_rgba(34,211,238,0.16)]">
                  <div className="text-center">
                    <div className="text-4xl font-semibold text-white">92</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.32em] text-cyan-200/80">ATS score</div>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs text-slate-400">
                  {quickMetrics.map((metric) => (
                    <div key={metric.label} className="rounded-xl border border-white/10 bg-white/[0.03] px-2 py-3">
                      <div className="text-sm font-semibold text-white">{metric.value}</div>
                      <div>{metric.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="border-white/10 bg-[#070d1a] p-0">
                <CardHeader>
                  <CardTitle className="text-white">AI Suggestions</CardTitle>
                  <CardDescription>Actionable changes ranked by impact.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pb-5">
                  {suggestions.map((suggestion, index) => (
                    <div key={suggestion} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3">
                      <Badge variant="outline" className="mt-0.5 border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
                        {String(index + 1).padStart(2, "0")}
                      </Badge>
                      <p className="text-sm leading-6 text-slate-200">{suggestion}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-[#070d1a] p-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white">Job match insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pb-5">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Keyword coverage</span>
                    <span className="text-white">87%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-2 w-[87%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      "React",
                      "Accessibility",
                      "Dashboard UX",
                      "Design Systems",
                      "A/B Testing",
                    ].map((keyword) => (
                      <Badge key={keyword} variant="outline" className="border-white/10 bg-white/[0.03] text-slate-300">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}