"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Filter, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { deleteHistoryItem, fetchHistory } from "@/lib/api";

type HistoryRecord = {
  id: string;
  role: string;
  company: string;
  score: number;
  match: string;
  date: string;
  fileType: string;
};

type SortKey = "date" | "score";

const fallbackItems: HistoryRecord[] = [
  {
    id: "AN-1001",
    role: "Senior Product Designer",
    company: "Nova Labs",
    score: 92,
    match: "94%",
    date: "Jul 5, 2026",
    fileType: "PDF",
  },
  {
    id: "AN-1002",
    role: "Frontend Engineer",
    company: "Arc Systems",
    score: 88,
    match: "89%",
    date: "Jul 4, 2026",
    fileType: "DOCX",
  },
];

export default function ResumeHistoryTable() {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [items, setItems] = useState<HistoryRecord[]>(fallbackItems);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetchHistory(50);
        const mappedItems = response.items.map((item) => ({
          id: item.analysis_id,
          role: item.recommended_roles[0] || item.career_level,
          company: item.filename,
          score: item.ats_score,
          match: `${Math.min(100, item.ats_score + 2)}%`,
          date: new Date(item.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
          fileType: item.content_type.toUpperCase().includes("PDF") ? "PDF" : "DOCX",
        }));

        if (mappedItems.length > 0) {
          setItems(mappedItems);
        }
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Unable to load history.");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const filteredItems = useMemo(() => {
    const lowered = query.toLowerCase();

    return [...items]
      .filter((item) =>
        [item.role, item.company, item.id, item.fileType].some((field) => field.toLowerCase().includes(lowered))
      )
      .sort((left, right) => {
        if (sortKey === "score") {
          return right.score - left.score;
        }

        return right.date.localeCompare(left.date);
      });
  }, [items, query, sortKey]);

  const downloadCsv = () => {
    const header = ["ID", "Role", "Company", "Score", "Match", "Date", "File Type"];
    const rows = filteredItems.map((record) => [
      record.id,
      record.role,
      record.company,
      String(record.score),
      record.match,
      record.date,
      record.fileType,
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "resume-history.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const deleteRecord = (id: string) => {
    void (async () => {
      try {
        await deleteHistoryItem(id);
        setItems((current) => current.filter((record) => record.id !== id));
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Unable to delete history record.");
      }
    })();
  };

  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-white">History</CardTitle>
            <CardDescription className="text-slate-400">
              Filter, sort, and manage your previous resume analyses.
            </CardDescription>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]" onClick={() => setSortKey("date")}>
              <Filter className="size-4" />
              Sort by date
            </Button>
            <Button type="button" variant="outline" className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]" onClick={() => setSortKey("score")}>
              <Filter className="size-4" />
              Sort by score
            </Button>
            <Button type="button" variant="outline" className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]" onClick={downloadCsv}>
              <Download className="size-4" />
              Download
            </Button>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search role, company, or file type"
            className="h-11 border-white/10 bg-white/[0.03] pl-10 text-white placeholder:text-slate-500"
          />
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto pb-6">
        {errorMessage ? (
          <div className="mb-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {errorMessage}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-10 text-center text-sm text-slate-400">
            Loading history...
          </div>
        ) : null}

        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-xs uppercase tracking-[0.28em] text-slate-500">
              <th className="px-4 py-2">Analysis</th>
              <th className="px-4 py-2">Score</th>
              <th className="px-4 py-2">Match</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">File</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((record: HistoryRecord) => (
              <tr key={record.id} className="rounded-2xl bg-[#070d1a] text-sm text-slate-200 ring-1 ring-white/10">
                <td className="rounded-l-2xl px-4 py-4">
                  <div className="font-medium text-white">{record.role}</div>
                  <div className="text-slate-400">{record.company}</div>
                  <div className="mt-1 text-xs text-slate-500">{record.id}</div>
                </td>
                <td className="px-4 py-4 font-medium text-white">{record.score}%</td>
                <td className="px-4 py-4">
                  <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
                    {record.match}
                  </Badge>
                </td>
                <td className="px-4 py-4 text-slate-300">{record.date}</td>
                <td className="px-4 py-4 text-slate-300">{record.fileType}</td>
                <td className="rounded-r-2xl px-4 py-4 text-right">
                  <Button type="button" variant="ghost" className="text-rose-200 hover:bg-rose-500/10 hover:text-rose-100" onClick={() => deleteRecord(record.id)}>
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-10 text-center text-sm text-slate-400">
            No analyses match your current search.
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}