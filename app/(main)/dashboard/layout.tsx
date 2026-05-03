import { PortalRoleShell } from "@/components/portal-role-shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <PortalRoleShell maxWidthClassName="max-w-6xl">{children}</PortalRoleShell>;
}
