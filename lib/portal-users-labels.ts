import type { AuthRole } from "@prisma/client";

/** Human-readable section headings for each `AuthRole` (not necessarily the raw DB string). */
export function portalRoleLabel(role: AuthRole): string {
  switch (role) {
    case "super_admin":
      return "Platform owner";
    case "trainer":
      return "Trainer";
    case "trainee":
      return "Trainee";
    default:
      return role;
  }
}
