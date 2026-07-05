import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      eyebrow="Secure password reset"
      title="Set a new password."
      description="Choose a strong new password and return to the protected workspace."
      footerText="Back to sign in"
      footerLinkLabel="Login"
      footerLinkHref="/login"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}