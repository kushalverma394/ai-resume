"use client";

import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { CloudUpload, FileCheck2, FileWarning, LoaderCircle, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UploadProgress from "@/components/upload/UploadProgress";

type UploadState = "idle" | "uploading" | "success" | "error";

const acceptedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

export default function UploadZone() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [fileName, setFileName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [progress, setProgress] = useState(0);

  const instructions = useMemo(
    () => [
      "Drop a PDF or DOCX resume into the zone below.",
      "The upload flow is simulated entirely on the client.",
      "Validation catches unsupported file types before analysis begins.",
    ],
    []
  );

  const validateFile = (file: File | undefined) => {
    if (!file) return false;

    const isValidType = acceptedTypes.includes(file.type) || /\.(pdf|docx)$/i.test(file.name);
    if (!isValidType) {
      setState("error");
      setErrorMessage("Only PDF and DOCX files are supported.");
      return false;
    }

    if (file.size > 15 * 1024 * 1024) {
      setState("error");
      setErrorMessage("Files larger than 15MB are not supported in this demo.");
      return false;
    }

    return true;
  };

  const simulateUpload = (file: File) => {
    setState("uploading");
    setFileName(file.name);
    setErrorMessage("");
    setProgress(12);

    const steps = [24, 40, 58, 74, 88, 100];
    steps.forEach((value, index) => {
      window.setTimeout(() => {
        setProgress(value);
        if (value === 100) {
          setState("success");
        }
      }, (index + 1) * 450);
    });
  };

  const handleFile = (file: File | undefined) => {
    if (!validateFile(file)) return;
    if (file) simulateUpload(file);
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0]);
  };

  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardHeader>
        <CardTitle className="text-white">Upload resume</CardTitle>
        <CardDescription className="text-slate-400">
          Drag and drop a resume or choose a file from your device.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pb-6">
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          className="flex min-h-[18rem] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-[#070d1a] px-6 py-8 text-center transition-colors hover:border-cyan-400/30 hover:bg-white/[0.04]"
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex size-16 items-center justify-center rounded-3xl bg-cyan-400/10 text-cyan-200">
            <CloudUpload className="size-7" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-white">Drop files here</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
            Upload PDF or DOCX resumes to generate ATS scoring, job matches, and AI suggestions.
          </p>
          <Button type="button" className="mt-6 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400">
            <Upload className="size-4" />
            Choose file
          </Button>
          <input ref={inputRef} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={onInputChange} />
        </div>

        {state === "uploading" ? (
          <UploadProgress progress={progress} label={`Uploading ${fileName || "resume"}`} />
        ) : null}

        {state === "success" ? (
          <div className="flex items-start gap-3 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-100" role="status">
            <FileCheck2 className="mt-0.5 size-4" />
            <div>
              <div className="font-medium">Upload successful</div>
              <div className="text-emerald-100/80">{fileName} is ready for analysis.</div>
            </div>
          </div>
        ) : null}

        {state === "error" ? (
          <div className="flex items-start gap-3 rounded-3xl border border-rose-500/20 bg-rose-500/10 px-4 py-4 text-sm text-rose-100" role="alert">
            <FileWarning className="mt-0.5 size-4" />
            <div>
              <div className="font-medium">Upload error</div>
              <div className="text-rose-100/80">{errorMessage}</div>
            </div>
          </div>
        ) : null}

        {state === "idle" ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <LoaderCircle className="size-4 animate-spin text-cyan-200" />
            Ready for upload.
          </div>
        ) : null}

        <ul className="space-y-2 rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-slate-300">
          {instructions.map((line) => (
            <li key={line} className="flex items-start gap-2">
              <span className="mt-2 size-1.5 rounded-full bg-cyan-300" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}