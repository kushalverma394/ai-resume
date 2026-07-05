import DashboardShell from "@/components/dashboard/DashboardShell";
import ProfileSettings from "@/components/profile/ProfileSettings";

export default function ProfilePage() {
  return (
    <DashboardShell
      title="Profile"
      description="Manage your account, notification preferences, theme preview, and sign-out actions."
    >
      <div className="py-6">
        <ProfileSettings />
      </div>
    </DashboardShell>
  );
}