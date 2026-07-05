"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";
import { SidebarContent } from "@/components/dashboard/Sidebar";
import { searchPills } from "@/lib/dashboard-data";

type TopNavbarProps = {
  title: string;
  description: string;
};

export default function TopNavbar({ title, description }: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#03050f]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
        <div className="flex min-w-0 items-center gap-3 lg:gap-4">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon-sm" className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06] lg:hidden" />
              }
            >
              <Menu />
              <span className="sr-only">Open navigation menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="border-white/10 bg-[#050816] p-0 text-white">
              <SheetHeader className="border-b border-white/10 px-5 py-4">
                <SheetTitle className="text-white">Navigation</SheetTitle>
              </SheetHeader>
              <SidebarContent />
            </SheetContent>
          </Sheet>

          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-slate-400">Linear-inspired workspace</div>
            <h1 className="truncate text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">{title}</h1>
            <p className="hidden truncate text-sm text-slate-400 sm:block">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden w-[18rem] lg:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <Input
                type="search"
                placeholder="Search resumes, scores, or questions"
                className="h-10 border-white/10 bg-white/[0.03] pl-10 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {searchPills.map((pill) => (
                <Link
                  key={pill}
                  href="/analysis"
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  {pill}
                </Link>
              ))}
            </div>
          </div>

          <ProfileDropdown />
          <Avatar size="sm" className="sm:hidden">
            <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-500 text-[0.68rem] font-semibold text-slate-950">
              KV
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}