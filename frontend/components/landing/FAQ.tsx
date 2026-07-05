import { Card, CardContent } from "@/components/ui/card";

const questions = [
  {
    question: "Which file types do you support?",
    answer: "PDF and DOCX are supported end to end, including upload, parsing, and export flows.",
  },
  {
    question: "Do I need Gemini configured to use the app?",
    answer: "No. The backend falls back to deterministic local analysis when the Gemini key is missing.",
  },
  {
    question: "Is my data protected?",
    answer: "Dashboard routes are session-protected and the backend is configured with CORS, validation, and rate limiting.",
  },
  {
    question: "Can I generate cover letters and interview prep?",
    answer: "Yes. Paste a job description and the app will generate job matching, cover letters, and interview questions.",
  },
];

export default function FAQ() {
  return (
    <section className="space-y-8">
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.32em] text-cyan-200/80">FAQ</p>
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">Common questions, answered.</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {questions.map((item) => (
          <Card key={item.question} className="border-white/10 bg-white/[0.04]">
            <CardContent className="space-y-2 px-5 py-5">
              <h3 className="text-lg font-medium text-white">{item.question}</h3>
              <p className="text-sm leading-7 text-slate-300">{item.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}