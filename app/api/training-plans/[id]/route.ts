import { randomUUID } from "node:crypto";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authOptions } from "@/auth";
import { getTrainerClientScope, resolveTraineeUserIdForTrainerPlan } from "@/lib/trainees-for-trainer";
import { prisma } from "@/lib/prisma";
import { resolveMappedMasterClientId } from "@/lib/portal-user-mapped-client";
import { parseExerciseDetailsJson } from "@/lib/exercise-details-json";
import {
  syncTraineeProgressAfterPlanEntryListChange,
  type PlanModuleProgressSyncRow,
} from "@/lib/trainee-plan-progress";

type PlanItemInput = {
  entryId: string;
  contentId?: string;
  title: string;
  subtitle?: string;
  sectionHeader?: string | null;
};

function isPlanItem(v: unknown): v is PlanItemInput {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  if (typeof o.entryId !== "string" || typeof o.title !== "string") return false;
  if (o.contentId !== undefined && typeof o.contentId !== "string") return false;
  return true;
}

function syncRowFromExerciseRow(e: { order: number; details: string | null }): PlanModuleProgressSyncRow {
  const p = parseExerciseDetailsJson(e.details);
  const entryId = typeof p.entryId === "string" ? p.entryId : "";
  const cid = typeof p.contentId === "string" ? p.contentId.trim() : "";
  return { order: e.order, entryId, contentId: cid || null };
}

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "trainer") {
    return NextResponse.json(
      { error: "Only trainers can update training plans." },
      { status: 403 },
    );
  }

  const { id: planId } = await ctx.params;
  if (!planId?.trim()) {
    return NextResponse.json({ error: "Invalid plan id" }, { status: 400 });
  }

  const scope = await getTrainerClientScope(session.user.id);
  if (!scope.ok) {
    return NextResponse.json(
      { error: "Assign a client to your trainer account before editing plans." },
      { status: 403 },
    );
  }

  const existing = await prisma.trainingPlan.findFirst({
    where: { id: planId.trim(), clientMasterId: scope.trainerMasterId },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Plan not found or not for your client." }, { status: 404 });
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
  const title = typeof b.title === "string" ? b.title.trim() : "";
  const description =
    typeof b.description === "string" && b.description.trim() ? b.description.trim() : null;
  const clientId = typeof b.clientId === "string" ? b.clientId.trim() : "";
  const isDraft = Boolean(b.isDraft);
  const rawItems = b.items;
  const traineeResolved = await resolveTraineeUserIdForTrainerPlan(session.user.id, b.traineeUserId);
  if (!traineeResolved.ok) {
    return NextResponse.json({ error: traineeResolved.error }, { status: 400 });
  }
  const persistTraineeUserId = traineeResolved.traineeUserId;
  if (!persistTraineeUserId) {
    return NextResponse.json(
      { error: "Trainee is required. Choose the trainee user this plan is for." },
      { status: 400 },
    );
  }

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (!clientId) {
    return NextResponse.json({ error: "Client is required" }, { status: 400 });
  }
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return NextResponse.json({ error: "At least one module is required" }, { status: 400 });
  }

  const items: PlanItemInput[] = [];
  for (const el of rawItems) {
    if (!isPlanItem(el)) {
      return NextResponse.json({ error: "Invalid module list" }, { status: 400 });
    }
    items.push({
      entryId: el.entryId,
      contentId: typeof el.contentId === "string" ? el.contentId : undefined,
      title: el.title,
      subtitle: typeof el.subtitle === "string" ? el.subtitle : "",
      sectionHeader: el.sectionHeader ?? null,
    });
  }

  try {
    const resolved = await resolveMappedMasterClientId(clientId);
    if (resolved.invalid || !resolved.id) {
      return NextResponse.json({ error: "Invalid client for this plan." }, { status: 400 });
    }
    const clientMasterIdPersist = resolved.id;
    if (clientMasterIdPersist !== scope.trainerMasterId) {
      return NextResponse.json(
        { error: "You can only save plans for your assigned client." },
        { status: 403 },
      );
    }

    const existingExercises = await prisma.exercise.findMany({
      where: { trainingPlanId: planId.trim() },
      orderBy: { order: "asc" },
      select: { order: true, details: true },
    });
    const previousModules = existingExercises.map((e) => syncRowFromExerciseRow(e));
    const usedPrev = new Set<number>();
    const nextModules: PlanModuleProgressSyncRow[] = items.map((item, order) => {
      const fromClient = item.contentId?.trim();
      if (fromClient) {
        return { order, entryId: item.entryId, contentId: fromClient };
      }
      const idx = previousModules.findIndex((m, i) => !usedPrev.has(i) && m.entryId === item.entryId);
      if (idx >= 0) {
        usedPrev.add(idx);
        const cid = previousModules[idx]!.contentId?.trim() || randomUUID();
        return { order, entryId: item.entryId, contentId: cid };
      }
      return { order, entryId: item.entryId, contentId: randomUUID() };
    });

    /** Plan + exercises only — trainee progress sync runs after commit so a sync error cannot roll back the save. */
    await prisma.$transaction(
      async (tx) => {
        await tx.exercise.deleteMany({ where: { trainingPlanId: planId.trim() } });
        await tx.trainingPlan.update({
          where: { id: planId.trim() },
          data: {
            title,
            description: description === null ? { set: null } : description,
            clientMasterId: clientMasterIdPersist,
            traineeUserId:
              persistTraineeUserId === null ? { set: null } : persistTraineeUserId,
            isDraft,
          },
        });
        await tx.exercise.createMany({
          data: items.map((item, order) => ({
            trainingPlanId: planId.trim(),
            order,
            name: item.title.slice(0, 900),
            details: JSON.stringify({
              entryId: item.entryId,
              contentId: nextModules[order]!.contentId,
              subtitle: item.subtitle ?? "",
              sectionHeader: item.sectionHeader ?? null,
            }),
          })),
        });
      },
      { maxWait: 10_000, timeout: 20_000 },
    );

    try {
      await syncTraineeProgressAfterPlanEntryListChange({
        trainingPlanId: planId.trim(),
        previousModules,
        nextModules,
      });
    } catch (syncErr) {
      console.error("[training-plans PATCH] trainee progress sync failed (plan was saved)", syncErr);
    }

    try {
      revalidatePath("/");
      revalidatePath("/dashboard");
      revalidatePath("/trainer/training-plans/new");
      revalidatePath(`/trainer/training-plans/${planId.trim()}/edit`);
    } catch (revalidateErr) {
      console.error("[training-plans PATCH] revalidatePath", revalidateErr);
    }

    return NextResponse.json({
      id: planId.trim(),
      message: isDraft ? "Draft updated" : "Plan updated",
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("[training-plans PATCH]", detail, err);
    return NextResponse.json({ error: "Could not update plan" }, { status: 500 });
  }
}
