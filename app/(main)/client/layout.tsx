import { PortalRoleShell } from "@/components/portal-role-shell";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <PortalRoleShell maxWidthClassName="max-w-4xl">{children}</PortalRoleShell>;
}
