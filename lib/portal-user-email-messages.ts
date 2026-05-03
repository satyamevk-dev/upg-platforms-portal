import type { AuthRole } from "@prisma/client";

/** Shown when creating or retargeting an email that already belongs to another user. */
export function duplicatePortalUserEmailMessage(existingRole: AuthRole): string {
  const roleLabel =
    existingRole === "super_admin"
      ? "Platform owner"
      : existingRole === "trainer"
        ? "Trainer"
        : "Trainee";
  return `This email is already assigned to a portal user (${roleLabel}). Each email address can have only one account and one role.`;
}

export const PORTAL_EMAIL_UNIQUENESS_HINT =
  "Each email address can have only one portal account and one role.";
