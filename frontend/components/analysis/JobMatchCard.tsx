import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type JobMatchCardProps = {
  match: number;
};

export default function JobMatchCard({ match }: JobMatchCardProps) {
  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardHeader>
        <CardTitle className="text-white">Job description match</CardTitle>
        <CardDescription className="text-slate-400">How closely the resume fits the selected role.</CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="rounded-3xl border border-white/10 bg-[#070d1a] px-5 py-5">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Match percentage</span>
            <span className="font-medium text-white">{match}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${match}%` }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}