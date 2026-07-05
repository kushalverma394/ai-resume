import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const proofPoints = ["Private by design", "Built for speed", "ATS-focused outputs"];

export default function CTA() {
  return (
    <section id="cta" className="scroll-mt-28">
      <Card className="overflow-hidden border-white/10 bg-[linear-gradient(135deg,rgba(34,211,238,0.14),rgba(59,130,246,0.08)_45%,rgba(8,15,34,0.98)_75%)] p-0 shadow-[0_30px_100px_rgba(7,12,26,0.72)]">
        <CardContent className="relative px-6 py-12 sm:px-10 sm:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.12),transparent_30%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-2xl space-y-5">
              <Badge variant="outline" className="border-cyan-400/25 bg-cyan-400/10 text-cyan-100">
                <Sparkles className="mr-1 size-3.5" />
                Ready to optimize your next application
              </Badge>
              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
                Start analyzing resumes with a cleaner, faster workflow.
              </h2>
              <p className="max-w-xl text-lg leading-8 text-slate-300">
                Upload a resume, match it to a role, and get actionable AI feedback before the candidate ever hits submit.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  className="bg-white text-slate-950 hover:bg-slate-200"
                  render={<Link href="/signup" />}
                >
                  Get Started Free
                  <ArrowRight />
                </Button>
                <Button
                  variant="outline"
                  className="border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                  render={<Link href="/login" />}
                >
                  Login
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#070d1a]/80 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <ShieldCheck className="size-4 text-cyan-300" />
                Secure uploads and role-aware analysis
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {proofPoints.map((point) => (
                  <div key={point} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-slate-300">
                    {point}
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-4 text-sm text-cyan-100">
                Designed to turn resume feedback into a focused action list, not a long generic report.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}