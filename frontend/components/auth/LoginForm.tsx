"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SocialLogin from "@/components/auth/SocialLogin";
import { login } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean(),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submissionState, setSubmissionState] = useState<"idle" | "success">("idle");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setSubmissionState("idle");

    try {
      await login(values.email, values.password, values.rememberMe);
      reset(values);
      setSubmissionState("success");
      router.push(redirectTo);
    } catch {
      setError("root", {
        type: "manual",
        message: "Unable to sign in right now. Please try again.",
      });
    }
  };

  return (
    <Card className="border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(7,12,26,0.6)] backdrop-blur-xl">
      <CardHeader className="space-y-3 border-b border-white/10 pb-6">
        <CardTitle className="text-2xl text-white">Welcome back</CardTitle>
        <CardDescription className="text-slate-400">
          Sign in to review resume scores, job matches, and your latest AI suggestions.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {errors.root?.message ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100" role="alert">
            {errors.root.message}
          </div>
        ) : null}

        {submissionState === "success" ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100" role="status">
            Sign in successful. Redirecting to your workspace.
          </div>
        ) : null}

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <label htmlFor="login-email" className="text-sm font-medium text-slate-200">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="h-11 border-white/10 bg-white/[0.03] pl-10 text-white placeholder:text-slate-500"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
            </div>
            {errors.email?.message ? <p className="text-sm text-rose-200">{errors.email.message}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="login-password" className="text-sm font-medium text-slate-200">
              Password
            </label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="h-11 border-white/10 bg-white/[0.03] pr-11 text-white placeholder:text-slate-500"
                aria-invalid={Boolean(errors.password)}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition-colors hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password?.message ? <p className="text-sm text-rose-200">{errors.password.message}</p> : null}
          </div>

          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                className="size-4 rounded border-white/20 bg-white/[0.03] text-cyan-400 focus:ring-cyan-400/40"
                {...register("rememberMe")}
              />
              Remember me
            </label>

            <Button type="button" variant="link" className="h-auto p-0 text-cyan-200 hover:text-cyan-100" render={<a href="/forgot-password" />}>
              Forgot password?
            </Button>
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-11 w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_32px_rgba(34,211,238,0.2)] hover:from-cyan-300 hover:to-blue-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : "Sign In"}
          </Button>
        </form>

        <SocialLogin />
      </CardContent>
    </Card>
  );
}