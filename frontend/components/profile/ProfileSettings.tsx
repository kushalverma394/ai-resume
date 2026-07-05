"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, MoonStar, ShieldCheck, Smartphone, UserCircle2 } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchProfile, logout, updateProfile } from "@/lib/api";
import type { ProfileResponse } from "@/lib/types";

export default function ProfileSettings() {
  const [theme, setTheme] = useState<"Dark" | "Dim">("Dark");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetchProfile();
        setProfile(response);
        setTheme(response.theme === "Dim" ? "Dim" : "Dark");
        setEmailAlerts(response.email_notifications);
        setPushAlerts(response.push_notifications);
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, []);

  const persistProfile = async (updates: Partial<ProfileResponse>) => {
    if (!profile) {
      return;
    }

    setSaving(true);
    try {
      const response = await updateProfile({
        full_name: updates.full_name ?? profile.full_name,
        email: updates.email ?? profile.email,
        headline: updates.headline ?? profile.headline,
        bio: updates.bio ?? profile.bio,
        theme: updates.theme ?? profile.theme,
        email_notifications: updates.email_notifications ?? profile.email_notifications,
        push_notifications: updates.push_notifications ?? profile.push_notifications,
      });
      setProfile(response);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (loading || !profile) {
    return <div className="py-6 text-sm text-slate-400">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.04]">
        <CardHeader>
          <CardTitle className="text-white">User profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pb-6">
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950">
                {profile.full_name
                  .split(" ")
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl font-semibold text-white">{profile.full_name}</div>
              <div className="text-sm text-slate-400">{profile.email}</div>
              <Badge variant="outline" className="mt-2 border-emerald-400/20 bg-emerald-400/10 text-emerald-100">
                {profile.plan} plan
              </Badge>
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070d1a] px-4 py-3">
              <UserCircle2 className="size-4 text-cyan-200" />
              {profile.headline}
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070d1a] px-4 py-3">
              <ShieldCheck className="size-4 text-cyan-200" />
              Secure session managed by the dashboard auth flow.
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.04]">
        <CardHeader>
          <CardTitle className="text-white">Account settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <Button type="button" variant="outline" className="w-full justify-start border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]">
            Update email
          </Button>
          <Button type="button" variant="outline" className="w-full justify-start border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]">
            Change password
          </Button>
          <Button type="button" variant="outline" className="w-full justify-start border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]">
            Manage billing
          </Button>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.04]">
        <CardHeader>
          <CardTitle className="text-white">Notification settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <button
            type="button"
            onClick={() => {
              const nextValue = !emailAlerts;
              setEmailAlerts(nextValue);
              void persistProfile({ email_notifications: nextValue });
            }}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-[#070d1a] px-4 py-4 text-left transition-colors hover:border-cyan-400/30 hover:bg-white/[0.04]"
          >
            <span className="flex items-center gap-3 text-sm text-white">
              <Bell className="size-4 text-cyan-200" />
              Email notifications
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${emailAlerts ? "bg-emerald-400/15 text-emerald-100" : "bg-white/10 text-slate-300"}`}>
              {emailAlerts ? "On" : "Off"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              const nextValue = !pushAlerts;
              setPushAlerts(nextValue);
              void persistProfile({ push_notifications: nextValue });
            }}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-[#070d1a] px-4 py-4 text-left transition-colors hover:border-cyan-400/30 hover:bg-white/[0.04]"
          >
            <span className="flex items-center gap-3 text-sm text-white">
              <Smartphone className="size-4 text-cyan-200" />
              Push notifications
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${pushAlerts ? "bg-emerald-400/15 text-emerald-100" : "bg-white/10 text-slate-300"}`}>
              {pushAlerts ? "On" : "Off"}
            </span>
          </button>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.04]">
        <CardHeader>
          <CardTitle className="text-white">Theme switch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
            onClick={() => {
              const nextTheme = theme === "Dark" ? "Dim" : "Dark";
              setTheme(nextTheme);
              void persistProfile({ theme: nextTheme });
            }}
          >
            <MoonStar className="size-4" />
            {theme} theme
          </Button>
          <div className="rounded-2xl border border-white/10 bg-[#070d1a] px-4 py-4 text-sm text-slate-400">
            Theme preference persists to the profile endpoint.
          </div>
          <Button type="button" variant="outline" className="w-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]" disabled={saving} onClick={() => void persistProfile({})}>
            {saving ? "Saving..." : "Save profile settings"}
          </Button>
        </CardContent>
      </Card>

      <Button type="button" variant="destructive" className="w-full" onClick={() => void handleLogout()}>
        Logout
      </Button>
    </div>
  );
}