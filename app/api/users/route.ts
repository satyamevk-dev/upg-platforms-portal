import { hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseAuthRole } from "@/lib/auth-role";
import { prisma } from "@/lib/prisma";
import { sendNewPortalUserEmail } from "@/lib/mail/portal-user-emails";
import { duplicatePortalUserEmailMessage } from "@/lib/portal-user-email-messages";
import { requireSuperAdmin } from "@/lib/require-super-admin";
import { isPasswordPolicyCompliant, passwordPolicyViolationMessage } from "@/lib/password-policy";
import { masterClientForPortalResponse } from "@/lib/map-master-client-for-portal";
import { mappedClientIdFromRequestBody } from "@/lib/portal-user-mapped-client";
import { isPlatformOwnerEmail } from "@/lib/platform-owner";
import { isValidPortalUserEmail } from "@/lib/user-email-validation";

export async function POST(req: NextRequest) {
  const { error } = await requireSuperAdmin(req);
  if (error) return error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const b = body as Record<string, unknown>;
  const emailRaw = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  const password = typeof b.password === "string" ? b.password : "";
  const nameRaw = typeof b.name === "string" ? b.name.trim() : "";
  const name = nameRaw || null;
  const role = parseAuthRole(b.role);
  if (!emailRaw || !isValidPortalUserEmail(emailRaw)) {
    return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (role === undefined) {
    return NextResponse.json({ error: "Role is required." }, { status: 400 });
  }
  if (!isPasswordPolicyCompliant(password)) {
    return NextResponse.json({ error: passwordPolicyViolationMessage() }, { status: 400 });
  }

  const emailTaken = await prisma.user.findUnique({
    where: { email: emailRaw },
    select: { role: true },
  });
  if (emailTaken) {
    return NextResponse.json(
      { error: duplicatePortalUserEmailMessage(emailTaken.role) },
      { status: 409 },
    );
  }

  let mappedMasterClientId: string | null = null;
  if (!isPlatformOwnerEmail(emailRaw)) {
    const mc = await mappedClientIdFromRequestBody(b, "create");
    if (mc.kind === "error") {
      return NextResponse.json({ error: mc.message }, { status: 400 });
    }
    mappedMasterClientId = mc.kind === "set" ? mc.id : null;
  }

  try {
    const passwordHash = await hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email: emailRaw,
        name,
        passwordHash,
        role,
        ...(mappedMasterClientId
          ? { mappedMasterClient: { connect: { id: mappedMasterClientId } } }
          : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        mappedMasterClient: { select: { id: true, name: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
    void sendNewPortalUserEmail({
      email: user.email,
      name: user.name,
      role: user.role,
    }).catch((err) => console.error("[users POST] notification email failed", err));

    revalidatePath("/");

    const { mappedMasterClient, ...userRest } = user;
    return NextResponse.json({
      user: {
        ...userRest,
        mappedClient: masterClientForPortalResponse(mappedMasterClient),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json(
        {
          error:
            "This email is already assigned to another portal user. Each email address can have only one account and one role.",
        },
        { status: 409 },
      );
    }
    console.error("[users POST]", e);
    return NextResponse.json({ error: "Could not create user." }, { status: 500 });
  }
}
