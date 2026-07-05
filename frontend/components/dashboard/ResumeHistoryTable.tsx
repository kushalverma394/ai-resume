"use client";

import { useMemo, useState } from "react";
import { Download, Filter, Search, Trash2 } from "lucide-react";

import { historyRecords, type HistoryRecord } from "@/lib/dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type SortKey = "date" | "score";

export default function ResumeHistoryTable() {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [items, setItems] = useState(historyRecords);

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
    setItems((current) => current.filter((record) => record.id !== id));
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