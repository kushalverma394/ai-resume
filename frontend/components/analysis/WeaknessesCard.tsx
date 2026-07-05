import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WeaknessesCardProps = {
  weaknesses: string[];
};

export default function WeaknessesCard({ weaknesses }: WeaknessesCardProps) {
  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardHeader>
        <CardTitle className="text-white">Weaknesses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-6">
        {weaknesses.map((weakness) => (
          <div key={weakness} className="flex items-start gap-3 rounded-2xl border border-rose-500/15 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            <Badge className="bg-rose-500/15 text-rose-100">!</Badge>
            <span>{weakness}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}