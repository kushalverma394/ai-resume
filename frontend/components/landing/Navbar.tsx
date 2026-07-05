"use client";

import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
  { label: "Features", href: "#features" },
  { label: "Analytics", href: "#analytics" },
  { label: "CTA", href: "#cta" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#03050f]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-3 text-sm font-semibold tracking-[0.24em] text-white uppercase"
        >
          <span className="flex size-9 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.18)]">
            AI
          </span>
          <span className="hidden sm:block">AI Resume Analyzer Pro</span>
          <span className="sm:hidden">AI Resume</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-slate-300 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" render={<Link href="/login" />}>
            Login
          </Button>
          <Button
            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_32px_rgba(34,211,238,0.22)] hover:from-cyan-300 hover:to-blue-400"
            render={<Link href="/signup" />}
          >
            Get Started
            <ArrowRight />
          </Button>
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon-sm" className="md:hidden" />
            }
          >
            <Menu />
            <span className="sr-only">Open navigation menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="border-white/10 bg-[#050816] text-white">
            <SheetHeader className="border-b border-white/10 px-6 pb-4 pt-6">
              <SheetTitle className="text-white">AI Resume Analyzer Pro</SheetTitle>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-3 px-6 py-5">
              {navigation.map((item) => (
                <SheetClose
                  key={item.label}
                  render={
                    <Link
                      href={item.href}
                      className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-white"
                    />
                  }
                >
                  {item.label}
                </SheetClose>
              ))}
            </div>

            <div className="mt-auto space-y-3 border-t border-white/10 px-6 py-5">
              <Button
                variant="outline"
                className="w-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
                render={<Link href="/login" />}
              >
                Login
              </Button>
              <Button
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400"
                render={<Link href="/signup" />}
              >
                Get Started
                <ArrowRight />
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}