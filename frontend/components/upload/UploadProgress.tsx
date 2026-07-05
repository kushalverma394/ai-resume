type UploadProgressProps = {
  progress: number;
  label: string;
};

export default function UploadProgress({ progress, label }: UploadProgressProps) {
  return (
    <div className="space-y-3 rounded-3xl border border-white/10 bg-[#070d1a] p-5">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}