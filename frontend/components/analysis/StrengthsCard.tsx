import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StrengthsCardProps = {
  strengths: string[];
};

export default function StrengthsCard({ strengths }: StrengthsCardProps) {
  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardHeader>
        <CardTitle className="text-white">Strengths</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-6">
        {strengths.map((strength) => (
          <div key={strength} className="flex items-start gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            <Badge className="bg-emerald-400/15 text-emerald-100">+</Badge>
            <span>{strength}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}