"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/lib/api";

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ForgotValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordForm() {
  const [submissionState, setSubmissionState] = useState<"idle" | "success">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotValues) => {
    setSubmissionState("idle");

    try {
      await forgotPassword(values.email);
      setSubmissionState("success");
    } catch {
      setError("root", {
        type: "manual",
        message: "Unable to start password recovery right now.",
      });
    }
  };

  return (
    <Card className="border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(7,12,26,0.6)] backdrop-blur-xl">
      <CardHeader className="space-y-3 border-b border-white/10 pb-6">
        <CardTitle className="text-2xl text-white">Forgot password</CardTitle>
        <CardDescription className="text-slate-400">Request a recovery email and continue to the reset screen.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {errors.root?.message ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100" role="alert">
            {errors.root.message}
          </div>
        ) : null}

        {submissionState === "success" ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100" role="status">
            Recovery email created. Continue to the reset password screen.
          </div>
        ) : null}

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <label htmlFor="forgot-email" className="text-sm font-medium text-slate-200">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <Input id="forgot-email" type="email" placeholder="you@example.com" className="h-11 border-white/10 bg-white/[0.03] pl-10 text-white placeholder:text-slate-500" aria-invalid={Boolean(errors.email)} {...register("email")} />
            </div>
            {errors.email?.message ? <p className="text-sm text-rose-200">{errors.email.message}</p> : null}
          </div>

          <Button type="submit" size="lg" className="h-11 w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400" disabled={isSubmitting}>
            {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : "Send reset email"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}