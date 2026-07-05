import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      eyebrow="Password recovery"
      title="Recover access to your account."
      description="Request a reset email and continue to a secure password update flow."
      footerText="Remembered your password?"
      footerLinkLabel="Sign in"
      footerLinkHref="/login"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}