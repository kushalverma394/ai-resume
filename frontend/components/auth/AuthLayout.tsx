import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type AuthLayoutProps = {
  title: string;
  description: string;
  eyebrow: string;
  children: ReactNode;
  footerText: string;
  footerLinkLabel: string;
  footerLinkHref: string;
};

const highlights = [
  "ATS scoring in seconds",
  "Role-aware feedback",
  "Private, structured analysis",
];

export default function AuthLayout({
  title,
  description,
  eyebrow,
  children,
  footerText,
  footerLinkLabel,
  footerLinkHref,
}: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen bg-[#03050f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.14),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_30%)]" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl gap-10 px-6 py-6 lg:grid-cols-[1fr_0.92fr] lg:px-10 lg:py-8">
        <section className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="space-y-10">
            <Button
              variant="ghost"
              className="w-fit border border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.06]"
              render={<Link href="/" />}
            >
              <ArrowLeft />
              Back to home
            </Button>

            <div className="max-w-xl space-y-5">
              <Badge variant="outline" className="border-cyan-400/25 bg-cyan-400/10 text-cyan-100">
                <ShieldCheck className="mr-1 size-3.5" />
                {eyebrow}
              </Badge>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-balance text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="max-w-lg text-lg leading-8 text-slate-300">{description}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-[#070d1a] px-4 py-4 text-sm text-slate-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Card className="mt-10 border-white/10 bg-[#070d1a]/90 p-0">
            <CardContent className="grid gap-4 p-5 sm:grid-cols-3">
              {[
                ["94%", "ATS coverage"],
                ["12k+", "Resumes analyzed"],
                ["28%", "Average lift"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <div className="text-2xl font-semibold text-white">{value}</div>
                  <div className="mt-1 text-sm text-slate-400">{label}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-lg">
            {children}
            <p className="mt-6 text-center text-sm text-slate-400">
              {footerText}{" "}
              <Link href={footerLinkHref} className="font-medium text-cyan-200 transition-colors hover:text-cyan-100">
                {footerLinkLabel}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}