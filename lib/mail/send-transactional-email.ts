import nodemailer from "nodemailer";

/** Copied on every transactional send (portal user welcome / updates). */
const TRANSACTIONAL_EMAIL_CC = "SatyamevK@Infinite.com";

export type SendTransactionalEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

/**
 * Sends mail via SMTP when `SMTP_HOST` and `EMAIL_FROM` are set.
 * If not configured, logs a warning and returns without throwing (API routes still succeed).
 */
export async function sendTransactionalEmail(
  input: SendTransactionalEmailInput,
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const host = process.env.SMTP_HOST?.trim();
  const from = process.env.EMAIL_FROM?.trim() || process.env.SMTP_USER?.trim();
  if (!host || !from) {
    console.warn(
      "[mail] SMTP_HOST and EMAIL_FROM (or SMTP_USER) are not set; transactional email skipped.",
    );
    return { ok: false, skipped: true, error: "Email not configured" };
  }

  const port = Number.parseInt(process.env.SMTP_PORT ?? "587", 10);
  const secure =
    process.env.SMTP_SECURE === "true" ||
    process.env.SMTP_SECURE === "1" ||
    port === 465;
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass !== undefined && pass !== "" ? { user, pass } : undefined,
  });

  const html = input.html ?? `<p>${input.text.replace(/\n/g, "<br />")}</p>`;

  const toNorm = input.to.trim().toLowerCase();
  const ccNorm = TRANSACTIONAL_EMAIL_CC.trim().toLowerCase();
  const cc = toNorm === ccNorm ? undefined : TRANSACTIONAL_EMAIL_CC;

  try {
    await transporter.sendMail({
      from,
      to: input.to,
      ...(cc ? { cc } : {}),
      subject: input.subject,
      text: input.text,
      html,
    });
    return { ok: true };
  } catch (e) {
    console.error("[mail] send failed", e);
    return { ok: false, error: e instanceof Error ? e.message : "Send failed" };
  }
}
