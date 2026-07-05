"use client";

import Link from "next/link";
import { ChevronDown, LogOut, Settings, UserCircle2 } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProfileDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left transition-colors hover:bg-white/[0.06]"
          />
        }
      >
        <Avatar size="sm">
          <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-500 text-[0.68rem] font-semibold text-slate-950">
            KV
          </AvatarFallback>
        </Avatar>
        <div className="hidden sm:block">
          <div className="text-sm font-medium text-white">Kushal Verma</div>
          <div className="text-xs text-slate-400">kushal@resumepro.app</div>
        </div>
        <ChevronDown className="size-4 text-slate-400" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 border border-white/10 bg-[#070d1a] p-2 shadow-2xl shadow-black/40">
        <DropdownMenuLabel className="flex items-center justify-between text-slate-200">
          Account
          <Badge variant="outline" className="border-emerald-400/20 bg-emerald-400/10 text-emerald-100">
            Pro
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2 bg-white/10" />
        <DropdownMenuItem
          render={
            <Link href="/profile" className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm text-slate-200 outline-none" />
          }
        >
          <UserCircle2 className="size-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          render={
            <Link href="/profile" className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm text-slate-200 outline-none" />
          }
        >
          <Settings className="size-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-2 bg-white/10" />
        <DropdownMenuItem
          render={
            <Link href="/login" className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm text-rose-200 outline-none" />
          }
        >
          <LogOut className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}