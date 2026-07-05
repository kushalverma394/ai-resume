import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type InterviewQuestionsProps = {
  questions: string[];
};

export default function InterviewQuestions({ questions }: InterviewQuestionsProps) {
  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardHeader>
        <CardTitle className="text-white">Interview questions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-6">
        {questions.map((question, index) => (
          <div key={question} className="rounded-2xl border border-white/10 bg-[#070d1a] px-4 py-4 text-sm leading-6 text-slate-300">
            <span className="mr-3 text-cyan-200">0{index + 1}</span>
            {question}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}