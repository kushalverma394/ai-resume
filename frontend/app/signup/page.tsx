import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout
      eyebrow="Start with a stronger profile"
      title="Create your AI resume workspace."
      description="Set up a premium resume analysis workspace with session-backed access, sharp UI, and live backend flows."
      footerText="Already have an account?"
      footerLinkLabel="Sign in"
      footerLinkHref="/login"
    >
      <SignupForm />
    </AuthLayout>
  );
}