import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MissingKeywordsProps = {
  keywords: string[];
};

export default function MissingKeywords({ keywords }: MissingKeywordsProps) {
  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardHeader>
        <CardTitle className="text-white">Missing skills and keywords</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 pb-6">
        {keywords.map((keyword) => (
          <Badge key={keyword} variant="outline" className="border-white/10 bg-white/[0.03] text-slate-200">
            {keyword}
          </Badge>
        ))}
      </CardContent>
    </Card>
  );
}