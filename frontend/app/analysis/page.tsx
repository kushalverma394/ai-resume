import DashboardShell from "@/components/dashboard/DashboardShell";
import AnalysisWorkspace from "@/components/analysis/AnalysisWorkspace";

export default function AnalysisPage() {
  return (
    <DashboardShell
      title="Analysis"
      description="Detailed AI analysis with ATS scoring, skill profiling, suggestions, interview preparation, and job matching."
    >
      <AnalysisWorkspace />
    </DashboardShell>
  );
}