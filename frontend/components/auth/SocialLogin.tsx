import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { oauthHref } from "@/lib/api";

type SocialLoginProps = {
  onGoogleClick?: () => void;
  onGithubClick?: () => void;
};

export default function SocialLogin({ onGoogleClick, onGithubClick }: SocialLoginProps) {
  const handleGoogle = () => {
    if (onGoogleClick) {
      onGoogleClick();
      return;
    }

    window.location.href = oauthHref("google");
  };

  const handleGithub = () => {
    if (onGithubClick) {
      onGithubClick();
      return;
    }

    window.location.href = oauthHref("github");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Separator className="bg-white/10" />
        <span className="text-xs font-medium uppercase tracking-[0.28em] text-slate-500">
          Or continue with
        </span>
        <Separator className="bg-white/10" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
          onClick={handleGoogle}
        >
          <span className="flex size-5 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-[0.65rem] font-semibold text-cyan-100">
            G
          </span>
          Google Sign In
        </Button>

        <Button
          type="button"
          variant="outline"
          className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
          onClick={handleGithub}
        >
          <span className="flex size-5 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-[0.65rem] font-semibold text-slate-100">
            GH
          </span>
          GitHub Sign In
        </Button>
      </div>
    </div>
  );
}