import Link from "next/link";

const links = [
  { label: "Features", href: "#features" },
  { label: "Analytics", href: "#analytics" },
  { label: "Get Started", href: "#cta" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#03050f]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>
          <div className="text-sm font-semibold tracking-[0.24em] text-white uppercase">
            AI Resume Analyzer Pro
          </div>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
            Premium resume intelligence for applicants and hiring teams who want sharper, faster decisions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm text-slate-400">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className="transition-colors hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="text-sm text-slate-500">© 2026 AI Resume Analyzer Pro</div>
      </div>
    </footer>
  );
}