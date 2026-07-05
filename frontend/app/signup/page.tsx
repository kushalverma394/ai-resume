import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout
      eyebrow="Start with a stronger profile"
      title="Create your AI resume workspace."
      description="Set up a premium resume analysis flow with client-side validation, sharp UI, and no backend dependency yet."
      footerText="Already have an account?"
      footerLinkLabel="Sign in"
      footerLinkHref="/login"
    >
      <SignupForm />
    </AuthLayout>
  );
}