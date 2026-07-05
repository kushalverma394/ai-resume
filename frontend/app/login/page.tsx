import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      eyebrow="Secure resume workflow"
      title="Sign in to review your resume performance."
      description="Access ATS scoring, job matches, and improvement suggestions from a clean, focused interface built for fast decisions."
      footerText="Need an account?"
      footerLinkLabel="Create one"
      footerLinkHref="/signup"
    >
      <LoginForm />
    </AuthLayout>
  );
}