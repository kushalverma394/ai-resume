import type { ReactNode } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";

type DashboardShellProps = {
  children: ReactNode;
  title: string;
  description: string;
};

export default function DashboardShell({ children, title, description }: DashboardShellProps) {
  return (
    <div className="relative min-h-screen bg-[#03050f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.12),transparent_22%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-[96rem]">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col lg:pl-72">
          <TopNavbar title={title} description={description} />
          <main className="flex-1 px-4 pb-8 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}