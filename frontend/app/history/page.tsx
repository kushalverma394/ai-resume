import DashboardShell from "@/components/dashboard/DashboardShell";
import ResumeHistoryTable from "@/components/dashboard/ResumeHistoryTable";

export default function HistoryPage() {
  return (
    <DashboardShell
      title="History"
      description="Search, filter, sort, download, and manage previous resume analysis sessions."
    >
      <div className="py-6">
        <ResumeHistoryTable />
      </div>
    </DashboardShell>
  );
}