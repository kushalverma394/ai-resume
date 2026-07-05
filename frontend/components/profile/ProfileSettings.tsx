"use client";

import { useState } from "react";
import { Bell, MoonStar, ShieldCheck, Smartphone, UserCircle2 } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ProfileSettings() {
  const [theme, setTheme] = useState<"Dark" | "Dim">("Dark");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);

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
                KV
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl font-semibold text-white">Kushal Verma</div>
              <div className="text-sm text-slate-400">kushal@resumepro.app</div>
              <Badge variant="outline" className="mt-2 border-emerald-400/20 bg-emerald-400/10 text-emerald-100">
                Active subscriber
              </Badge>
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070d1a] px-4 py-3">
              <UserCircle2 className="size-4 text-cyan-200" />
              Product designer focused on modern SaaS interfaces.
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070d1a] px-4 py-3">
              <ShieldCheck className="size-4 text-cyan-200" />
              Account secured with client-side demo settings.
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
            onClick={() => setEmailAlerts((value) => !value)}
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
            onClick={() => setPushAlerts((value) => !value)}
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
            onClick={() => setTheme((current) => (current === "Dark" ? "Dim" : "Dark"))}
          >
            <MoonStar className="size-4" />
            {theme} theme
          </Button>
          <div className="rounded-2xl border border-white/10 bg-[#070d1a] px-4 py-4 text-sm text-slate-400">
            UI-only theme switch for the mock dashboard experience.
          </div>
        </CardContent>
      </Card>

      <Button type="button" variant="destructive" className="w-full">
        Logout
      </Button>
    </div>
  );
}