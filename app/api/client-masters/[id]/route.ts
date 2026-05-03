import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { trainerTraineeCountForClientMasterId } from "@/lib/client-master-trainer-trainee-counts";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/require-super-admin";

const NAME_MAX = 120;

function normalizeMasterName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const t = raw.trim();
  if (!t || t.length > NAME_MAX) return null;
  return t;
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { error } = await requireSuperAdmin(req);
  if (error) return error;

  const { id } = await ctx.params;
  if (!id?.trim()) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
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
  const name = normalizeMasterName((body as Record<string, unknown>).name);
  if (!name) {
    return NextResponse.json(
      { error: `Name is required (1–${NAME_MAX} characters).` },
      { status: 400 },
    );
  }

  const existing = await prisma.clientMaster.findUnique({
    where: { id: id.trim() },
    select: { id: true, name: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Client not found." }, { status: 404 });
  }

  if (existing.name !== name) {
    const linked = await trainerTraineeCountForClientMasterId(existing.id);
    if (linked > 0) {
      return NextResponse.json(
        {
          error: `Cannot rename this client while ${linked} trainer or trainee account(s) are mapped to it. In Manage portal users, map each trainer and trainee to another client first, then rename.`,
        },
        { status: 409 },
      );
    }
  } else {
    revalidatePath("/");
    revalidatePath("/dashboard");
    return NextResponse.json({ master: existing });
  }

  try {
    const master = await prisma.clientMaster.update({
      where: { id: id.trim() },
      data: { name },
      select: { id: true, name: true },
    });
    revalidatePath("/");
    revalidatePath("/dashboard");
    return NextResponse.json({ master });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return NextResponse.json({ error: "Client not found." }, { status: 404 });
      }
      if (e.code === "P2002") {
        return NextResponse.json(
          { error: "A client with this name already exists." },
          { status: 409 },
        );
      }
    }
    console.error("[client-masters PATCH]", e);
    return NextResponse.json({ error: "Could not update client." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { error } = await requireSuperAdmin(req);
  if (error) return error;

  const { id } = await ctx.params;
  const tid = id?.trim();
  if (!tid) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const [planCount, trainerTraineeCount] = await Promise.all([
    prisma.trainingPlan.count({ where: { clientMasterId: tid } }),
    prisma.user.count({
      where: {
        mappedMasterClientId: tid,
        role: { in: ["trainer", "trainee"] },
      },
    }),
  ]);

  const blockers: string[] = [];
  if (trainerTraineeCount > 0) {
    blockers.push(
      `${trainerTraineeCount} trainer or trainee account(s) are still mapped to this client. Delete those users (or change their client) in Manage portal users first.`,
    );
  }
  if (planCount > 0) {
    blockers.push(
      `This client is used by ${planCount} training plan(s). Remove or reassign those plans first.`,
    );
  }
  if (blockers.length > 0) {
    return NextResponse.json({ error: blockers.join(" ") }, { status: 409 });
  }

  try {
    await prisma.clientMaster.delete({ where: { id: tid } });
    revalidatePath("/");
    revalidatePath("/dashboard");
    return NextResponse.json({ ok: true as const });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      return NextResponse.json({ error: "Client not found." }, { status: 404 });
    }
    console.error("[client-masters DELETE]", e);
    return NextResponse.json({ error: "Could not delete client." }, { status: 500 });
  }
}
