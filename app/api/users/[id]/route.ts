import { hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseAuthRole } from "@/lib/auth-role";
import { prisma } from "@/lib/prisma";
import { isPlatformOwnerEmail } from "@/lib/platform-owner";
import { sendPortalUserUpdatedEmail } from "@/lib/mail/portal-user-emails";
import { duplicatePortalUserEmailMessage } from "@/lib/portal-user-email-messages";
import { requireSuperAdmin } from "@/lib/require-super-admin";
import { masterClientForPortalResponse } from "@/lib/map-master-client-for-portal";
import { mappedClientIdFromRequestBody } from "@/lib/portal-user-mapped-client";
import { isPasswordPolicyCompliant, passwordPolicyViolationMessage } from "@/lib/password-policy";
import { isValidPortalUserEmail } from "@/lib/user-email-validation";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { error } = await requireSuperAdmin(req);
  if (error) return error;

  const { id } = await ctx.params;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

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

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const emailRaw =
    typeof b.email === "string" ? b.email.trim().toLowerCase() : undefined;
  if (emailRaw !== undefined) {
    if (!emailRaw || !isValidPortalUserEmail(emailRaw)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }
    if (emailRaw !== existing.email.toLowerCase()) {
      const otherUser = await prisma.user.findFirst({
        where: { email: emailRaw, id: { not: id } },
        select: { role: true },
      });
      if (otherUser) {
        return NextResponse.json(
          { error: duplicatePortalUserEmailMessage(otherUser.role) },
          { status: 409 },
        );
      }
    }
  }

  let name: string | null | undefined;
  if (b.name === null) name = null;
  else if (typeof b.name === "string") name = b.name.trim() ? b.name.trim() : null;

  const roleParsed = b.role !== undefined ? parseAuthRole(b.role) : undefined;
  if (b.role !== undefined && roleParsed === undefined) {
    return NextResponse.json({ error: "Valid role is required." }, { status: 400 });
  }

  const isPlatformOwner = isPlatformOwnerEmail(existing.email);
  if (
    isPlatformOwner &&
    roleParsed !== undefined &&
    roleParsed !== existing.role
  ) {
    return NextResponse.json(
      { error: "The platform owner account role cannot be changed." },
      { status: 400 },
    );
  }

  if (
    !isPlatformOwner &&
    roleParsed !== undefined &&
    roleParsed !== "super_admin" &&
    existing.role === "super_admin"
  ) {
    const superAdminCount = await prisma.user.count({
      where: { role: "super_admin" },
    });
    if (superAdminCount <= 1) {
      return NextResponse.json(
        { error: "Cannot change role: this is the only platform owner account." },
        { status: 400 },
      );
    }
  }

  const password =
    typeof b.password === "string" && b.password.length > 0 ? b.password : undefined;
  if (password !== undefined && !isPasswordPolicyCompliant(password)) {
    return NextResponse.json({ error: passwordPolicyViolationMessage() }, { status: 400 });
  }

  const data: Prisma.UserUpdateInput = {};
  if (emailRaw !== undefined) data.email = emailRaw;
  if (name !== undefined) data.name = name;
  if (roleParsed !== undefined && !isPlatformOwnerEmail(existing.email)) {
    data.role = roleParsed;
  }
  if (password !== undefined) {
    data.passwordHash = await hash(password, 12);
  }

  if (isPlatformOwnerEmail(existing.email)) {
    data.mappedMasterClient = { disconnect: true };
  } else {
    const mc = await mappedClientIdFromRequestBody(b, "patch");
    if (mc.kind === "error") {
      return NextResponse.json({ error: mc.message }, { status: 400 });
    }
    if (mc.kind === "set") {
      data.mappedMasterClient = mc.id
        ? { connect: { id: mc.id } }
        : { disconnect: true };
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No changes provided." }, { status: 400 });
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data,
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

    const emailChanged =
      user.email.trim().toLowerCase() !== existing.email.trim().toLowerCase();
    const roleChanged = user.role !== existing.role;
    const nameChanged = (user.name ?? null) !== (existing.name ?? null);
    const passwordChanged = password !== undefined;
    if (emailChanged || roleChanged || nameChanged || passwordChanged) {
      void sendPortalUserUpdatedEmail({
        email: user.email,
        name: user.name,
        changes: {
          emailChanged,
          previousEmail: emailChanged ? existing.email : undefined,
          nameChanged,
          roleChanged,
          newRole: roleChanged ? user.role : undefined,
          passwordChanged,
        },
      }).catch((err) => console.error("[users PATCH] notification email failed", err));
    }

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
    console.error("[users PATCH]", e);
    return NextResponse.json({ error: "Could not update user." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { error } = await requireSuperAdmin(req);
  if (error) return error;

  const { id } = await ctx.params;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  if (isPlatformOwnerEmail(existing.email)) {
    return NextResponse.json(
      { error: "The platform owner account cannot be deleted." },
      { status: 403 },
    );
  }

  if (existing.role !== "trainer" && existing.role !== "trainee") {
    return NextResponse.json(
      { error: "Only trainer and client accounts can be deleted from this panel." },
      { status: 403 },
    );
  }

  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[users DELETE]", e);
    return NextResponse.json({ error: "Could not delete user." }, { status: 500 });
  }
}
