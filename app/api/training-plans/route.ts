import { randomUUID } from "node:crypto";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/auth";
import { getTrainerClientScope, resolveTraineeUserIdForTrainerPlan } from "@/lib/trainees-for-trainer";
import { prisma } from "@/lib/prisma";
import { resolveMappedMasterClientId } from "@/lib/portal-user-mapped-client";
import {
  listTrainingPlansForTrainer,
  listTrainingPlansForTrainerClient,
} from "@/lib/training-plans-list";

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

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = session.user.role;
  if (role !== "trainer" && role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const plans =
      role === "trainer"
        ? await listTrainingPlansForTrainerClient(session.user.id)
        : await listTrainingPlansForTrainer();
    return NextResponse.json({ plans });
  } catch (err) {
    console.error("[training-plans GET]", err);
    return NextResponse.json({ error: "Could not load plans" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = session.user.role;
  if (role !== "trainer") {
    return NextResponse.json(
      { error: "Only trainers can create training plans." },
      { status: 403 },
    );
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
    if (resolved.invalid) {
      return NextResponse.json(
        {
          error:
            resolved.code === "master_client_missing"
              ? "Matching client master row is missing. Run migrations and seed, or add the client in Client masters."
              : "Invalid client — must be an id from the client master list.",
        },
        { status: 400 },
      );
    }
    const persistClientMasterId = resolved.id;
    if (!persistClientMasterId) {
      return NextResponse.json({ error: "Client is required" }, { status: 400 });
    }

    const scope = await getTrainerClientScope(session.user.id);
    if (!scope.ok) {
      return NextResponse.json(
        { error: "Assign a client to your trainer account before creating plans." },
        { status: 403 },
      );
    }
    if (persistClientMasterId !== scope.trainerMasterId) {
      return NextResponse.json(
        { error: "You can only create plans for your assigned client." },
        { status: 403 },
      );
    }

    const plan = await prisma.$transaction(async (tx) => {
      const p = await tx.trainingPlan.create({
        data: {
          title,
          description,
          clientMasterId: persistClientMasterId,
          traineeUserId: persistTraineeUserId,
          isDraft,
        },
      });

      await tx.exercise.createMany({
        data: items.map((item, order) => {
          const contentId = item.contentId?.trim() || randomUUID();
          return {
            trainingPlanId: p.id,
            order,
            name: item.title.slice(0, 900),
            details: JSON.stringify({
              entryId: item.entryId,
              contentId,
              subtitle: item.subtitle ?? "",
              sectionHeader: item.sectionHeader ?? null,
            }),
          };
        }),
      });

      return p;
    });

    return NextResponse.json({
      id: plan.id,
      message: isDraft ? "Draft saved" : "Plan saved",
    });
  } catch (err) {
    console.error("[training-plans POST]", err);
    return NextResponse.json({ error: "Could not save plan" }, { status: 500 });
  }
}
