import type { AuthRole } from "@prisma/client";
import { sendTransactionalEmail } from "@/lib/mail/send-transactional-email";
import { portalRoleLabel } from "@/lib/portal-users-labels";

function appLoginUrl(): string {
  const base = (
    process.env.NEXTAUTH_URL ??
    process.env.APP_ORIGIN ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
  return `${base}/login`;
}

export async function sendNewPortalUserEmail(params: {
  email: string;
  name: string | null;
  role: AuthRole;
}): Promise<void> {
  const display = params.name?.trim() || params.email;
  const roleLabel = portalRoleLabel(params.role);
  const loginUrl = appLoginUrl();
  const subject = "Your learning portal account was created";
  const text = `Hello ${display},

An account was created for you on the Learning Portal (UPG Group / Avaya).

Sign-in email: ${params.email}
Role: ${roleLabel}

Sign in: ${loginUrl}

Use the password your administrator set for you. If you do not have a password yet, contact your administrator.

— Learning Portal`;

  await sendTransactionalEmail({
    to: params.email,
    subject,
    text,
  });
}

export async function sendPortalUserUpdatedEmail(params: {
  email: string;
  name: string | null;
  changes: {
    emailChanged: boolean;
    previousEmail?: string;
    nameChanged: boolean;
    roleChanged: boolean;
    newRole?: AuthRole;
    passwordChanged: boolean;
  };
}): Promise<void> {
  const display = params.name?.trim() || params.email;
  const loginUrl = appLoginUrl();
  const lines: string[] = [
    `Hello ${display},`,
    "",
    "Your Learning Portal account was updated by an administrator.",
    "",
    `Current sign-in email: ${params.email}`,
  ];

  if (params.changes.emailChanged && params.changes.previousEmail) {
    lines.push(`Previous email on file: ${params.changes.previousEmail}`);
  }
  if (params.changes.nameChanged) {
    lines.push(`Your display name on file is now: ${display}`);
  }
  if (params.changes.roleChanged && params.changes.newRole) {
    lines.push(`Role is now: ${portalRoleLabel(params.changes.newRole)}`);
  }
  if (params.changes.passwordChanged) {
    lines.push("Your password was reset. Use the new password from your administrator.");
  }

  lines.push("", `Sign in: ${loginUrl}`, "", "If you did not expect this change, contact your administrator.", "", "— Learning Portal");

  const subject = "Your learning portal account was updated";
  const text = lines.join("\n");

  const primary = await sendTransactionalEmail({
    to: params.email,
    subject,
    text,
  });
  if (!primary.ok) {
    console.warn(
      "[portal-user-emails] updated-user notify (new address):",
      primary.error ?? "skipped",
    );
  }

  const prev = params.changes.previousEmail?.trim();
  if (
    params.changes.emailChanged &&
    prev &&
    prev.toLowerCase() !== params.email.trim().toLowerCase()
  ) {
    const prevSubject = "Your learning portal sign-in email was changed";
    const prevText = `Hello,

An administrator changed the sign-in email for your Learning Portal account.

Previous sign-in email: ${prev}
New sign-in email: ${params.email}

From now on, sign in using ${params.email} and your current password.

Sign in: ${loginUrl}

If you did not expect this change, contact your administrator immediately.

— Learning Portal`;

    const secondary = await sendTransactionalEmail({
      to: prev,
      subject: prevSubject,
      text: prevText,
    });
    if (!secondary.ok) {
      console.warn(
        "[portal-user-emails] updated-user notify (previous address):",
        secondary.error ?? "skipped",
      );
    }
  }
}
