import DashboardShell from "@/components/dashboard/DashboardShell";
import UploadZone from "@/components/upload/UploadZone";
import SupportedFormats from "@/components/upload/SupportedFormats";
import UploadProgress from "@/components/upload/UploadProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UploadPage() {
  return (
    <DashboardShell
      title="Upload resume"
      description="Drop a PDF or DOCX file to start a mock ATS analysis flow with instant validation and progress feedback."
    >
      <div className="grid gap-6 py-6 xl:grid-cols-[1.2fr_0.8fr]">
        <UploadZone />

        <div className="space-y-6">
          <UploadProgress progress={68} label="Upload pipeline" />

          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
              <CardTitle className="text-white">Supported formats</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <SupportedFormats />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}