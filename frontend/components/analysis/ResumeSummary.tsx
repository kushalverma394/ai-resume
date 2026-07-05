import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ResumeSummaryProps = {
  summary: string;
};

export default function ResumeSummary({ summary }: ResumeSummaryProps) {
  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardHeader>
        <CardTitle className="text-white">Resume summary</CardTitle>
        <CardDescription className="text-slate-400">Concise AI interpretation of overall fit and positioning.</CardDescription>
      </CardHeader>
      <CardContent className="pb-6 text-sm leading-7 text-slate-300">{summary}</CardContent>
    </Card>
  );
}