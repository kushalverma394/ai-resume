"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SocialLogin from "@/components/auth/SocialLogin";
import { signup } from "@/lib/api";

const signupSchema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
    agreeToTerms: z.boolean(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((values) => values.agreeToTerms, {
    message: "You must agree to the terms to continue",
    path: ["agreeToTerms"],
  });

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submissionState, setSubmissionState] = useState<"idle" | "success">("idle");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: true,
    },
  });

  const onSubmit = async (values: SignupValues) => {
    setSubmissionState("idle");

    try {
      await signup(values.name, values.email, values.password, values.confirmPassword);
      reset(values);
      setSubmissionState("success");
      router.push("/dashboard");
    } catch {
      setError("root", {
        type: "manual",
        message: "Unable to create an account right now. Please try again.",
      });
    }
  };

  return (
    <Card className="border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(7,12,26,0.6)] backdrop-blur-xl">
      <CardHeader className="space-y-3 border-b border-white/10 pb-6">
        <CardTitle className="text-2xl text-white">Create your account</CardTitle>
        <CardDescription className="text-slate-400">
          Build a profile, upload resumes, and get personalized analysis in one workspace.
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
            Account created successfully. Redirecting to your workspace.
          </div>
        ) : null}

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <label htmlFor="signup-name" className="text-sm font-medium text-slate-200">
              Full name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <Input
                id="signup-name"
                type="text"
                autoComplete="name"
                placeholder="Alex Johnson"
                className="h-11 border-white/10 bg-white/[0.03] pl-10 text-white placeholder:text-slate-500"
                aria-invalid={Boolean(errors.name)}
                {...register("name")}
              />
            </div>
            {errors.name?.message ? <p className="text-sm text-rose-200">{errors.name.message}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="signup-email" className="text-sm font-medium text-slate-200">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <Input
                id="signup-email"
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
            <label htmlFor="signup-password" className="text-sm font-medium text-slate-200">
              Password
            </label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a password"
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

          <div className="space-y-2">
            <label htmlFor="signup-confirm-password" className="text-sm font-medium text-slate-200">
              Confirm password
            </label>
            <div className="relative">
              <Input
                id="signup-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                className="h-11 border-white/10 bg-white/[0.03] pr-11 text-white placeholder:text-slate-500"
                aria-invalid={Boolean(errors.confirmPassword)}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition-colors hover:text-white"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.confirmPassword?.message ? (
              <p className="text-sm text-rose-200">{errors.confirmPassword.message}</p>
            ) : null}
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-slate-300">
            <input
              type="checkbox"
              className="mt-0.5 size-4 rounded border-white/20 bg-white/[0.03] text-cyan-400 focus:ring-cyan-400/40"
              aria-invalid={Boolean(errors.agreeToTerms)}
              {...register("agreeToTerms")}
            />
            <span>
              I agree to the terms and acknowledge this is a front-end only authentication flow.
            </span>
          </label>
          {errors.agreeToTerms?.message ? <p className="text-sm text-rose-200">{errors.agreeToTerms.message}</p> : null}

          <Button
            type="submit"
            size="lg"
            className="h-11 w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_32px_rgba(34,211,238,0.2)] hover:from-cyan-300 hover:to-blue-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : "Create Account"}
          </Button>
        </form>

        <SocialLogin />
      </CardContent>
    </Card>
  );
}