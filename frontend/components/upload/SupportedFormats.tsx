import { FileText } from "lucide-react";

import { uploadFormats } from "@/lib/dashboard-data";

export default function SupportedFormats() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {uploadFormats.map((format) => (
        <div key={format.label} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
            <FileText className="size-4" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">{format.label}</div>
            <div className="text-sm text-slate-400">{format.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}