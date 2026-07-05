import {
  BarChart3,
  Brain,
  BriefcaseBusiness,
  FileText,
  MessageSquareQuote,
  ScanSearch,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Resume Analysis",
    description: "Parse layout, structure, and content quality to surface clarity issues instantly.",
    icon: FileText,
    highlight: "Format + content review",
  },
  {
    title: "ATS Score",
    description: "Compare your resume to ATS expectations with a clear pass-fail signal.",
    icon: ScanSearch,
    highlight: "Scored against role criteria",
  },
  {
    title: "Job Matching",
    description: "Measure fit against a target role and understand the gaps before you apply.",
    icon: BriefcaseBusiness,
    highlight: "Role-specific matching",
  },
  {
    title: "AI Suggestions",
    description: "Get concise rewrite recommendations that improve impact and readability.",
    icon: Brain,
    highlight: "High-signal rewrite guidance",
  },
  {
    title: "Interview Questions",
    description: "Generate tailored interview questions from your resume and the job description.",
    icon: MessageSquareQuote,
    highlight: "Role-aware practice prompts",
  },
  {
    title: "Analytics",
    description: "Track score changes, improvements, and application readiness over time.",
    icon: BarChart3,
    highlight: "Progress and trend visibility",
    anchor: "analytics",
  },
];

export default function Features() {
  return (
    <section id="features" className="space-y-10">
      <div className="max-w-2xl space-y-4">
        <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-slate-200">
          Product features
        </Badge>
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
          Everything needed to evaluate, improve, and ship a stronger resume.
        </h2>
        <p className="text-lg leading-8 text-slate-400">
          Built as a streamlined product experience with direct answers, not a dashboard full of noise.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature, index) => (
          <Card
            key={feature.title}
            id={feature.anchor}
            className="group border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(8,15,34,0.45)]"
          >
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-400/20 to-blue-500/10 text-cyan-200 transition-colors group-hover:border-cyan-400/30">
                  <feature.icon className="size-5" />
                </div>
                <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-slate-300">
                  0{index + 1}
                </Badge>
              </div>
              <div className="space-y-1">
                <CardTitle className="text-white">{feature.title}</CardTitle>
                <CardDescription className="text-slate-400">{feature.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pb-5">
              <div className="rounded-xl border border-white/10 bg-[#070d1a] px-4 py-3 text-sm text-slate-300">
                {feature.highlight}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}