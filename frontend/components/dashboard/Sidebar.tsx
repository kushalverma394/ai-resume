"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { dashboardNavItems } from "@/lib/dashboard-data";

function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col border-r border-white/10 bg-white/[0.03] px-4 py-6 backdrop-blur-xl">
      <Link href="/dashboard" className="flex items-center gap-3 px-2">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.2)]">
          AR
        </div>
        <div>
          <div className="text-sm font-semibold tracking-[0.24em] text-white uppercase">
            AI Resume Analyzer Pro
          </div>
          <p className="text-xs text-slate-400">Product dashboard</p>
        </div>
      </Link>

      <div className="mt-8 space-y-1">
        {dashboardNavItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-colors",
                active
                  ? "bg-cyan-400/10 text-white ring-1 ring-cyan-400/20"
                  : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
              )}
            >
              <Icon className={cn("size-4", active ? "text-cyan-300" : "text-slate-400")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <Separator className="my-6 bg-white/10" />

      <div className="rounded-3xl border border-white/10 bg-[#070d1a] p-4">
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950">
              KV
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium text-white">Kushal Verma</div>
            <div className="text-xs text-slate-400">Product Designer</div>
          </div>
        </div>

        <Badge variant="outline" className="mt-4 border-emerald-400/20 bg-emerald-400/10 text-emerald-100">
          Pro plan active
        </Badge>

        <Button
          type="button"
          variant="outline"
          className="mt-4 w-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
        >
          Upgrade workspace
        </Button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden w-72 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block">
      <SidebarContent />
    </aside>
  );
}

export { SidebarContent };