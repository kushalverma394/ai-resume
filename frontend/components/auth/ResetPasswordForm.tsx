"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/api";

const resetSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ResetValues = z.infer<typeof resetSchema>;

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submissionState, setSubmissionState] = useState<"idle" | "success">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetValues) => {
    setSubmissionState("idle");

    try {
      await resetPassword(values.password, values.confirmPassword);
      setSubmissionState("success");
    } catch {
      setError("root", {
        type: "manual",
        message: "Unable to reset the password right now.",
      });
    }
  };

  return (
    <Card className="border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(7,12,26,0.6)] backdrop-blur-xl">
      <CardHeader className="space-y-3 border-b border-white/10 pb-6">
        <CardTitle className="text-2xl text-white">Reset password</CardTitle>
        <CardDescription className="text-slate-400">Set a new secure password for your account.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {errors.root?.message ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100" role="alert">
            {errors.root.message}
          </div>
        ) : null}

        {submissionState === "success" ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100" role="status">
            Password updated successfully. You can sign in again.
          </div>
        ) : null}

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <label htmlFor="reset-password" className="text-sm font-medium text-slate-200">
              New password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <Input id="reset-password" type={showPassword ? "text" : "password"} placeholder="Enter a new password" className="h-11 border-white/10 bg-white/[0.03] pl-10 pr-11 text-white placeholder:text-slate-500" aria-invalid={Boolean(errors.password)} {...register("password")} />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password?.message ? <p className="text-sm text-rose-200">{errors.password.message}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="reset-confirm-password" className="text-sm font-medium text-slate-200">
              Confirm password
            </label>
            <div className="relative">
              <Input id="reset-confirm-password" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm the new password" className="h-11 border-white/10 bg-white/[0.03] pr-11 text-white placeholder:text-slate-500" aria-invalid={Boolean(errors.confirmPassword)} {...register("confirmPassword")} />
              <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-white" aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}>
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.confirmPassword?.message ? <p className="text-sm text-rose-200">{errors.confirmPassword.message}</p> : null}
          </div>

          <Button type="submit" size="lg" className="h-11 w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400" disabled={isSubmitting}>
            {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : "Update password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}