import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getTrainerClientScope } from "@/lib/trainees-for-trainer";
import { PREDEFINED_TRAINING_PLAN_CLIENTS } from "@/lib/training-plan-clients";
import type { SavedPlanSummary, TrainingPlanSummarySourceRow } from "@/lib/training-plan-summary";
import { toSavedPlanSummary } from "@/lib/training-plan-summary";

/**
 * Client master + exercises only. Trainee display names are loaded via `hydrateTraineesOnPlanRows`
 * so we never use a nested `traineeUser` include (avoids PrismaClientValidationError with some clients/bundles).
 */
const trainingPlanListInclude = {
  clientMaster: { select: { id: true, name: true } },
  exercises: {
    orderBy: { order: "asc" as const },
    select: { name: true, details: true, order: true },
  },
} satisfies Prisma.TrainingPlanInclude;

type PlanRowDb = Prisma.TrainingPlanGetPayload<{ include: typeof trainingPlanListInclude }>;

async function hydrateTraineesOnPlanRows(rows: PlanRowDb[]): Promise<TrainingPlanSummarySourceRow[]> {
  const ids = [
    ...new Set(
      rows
        .map((r) => r.traineeUserId)
        .filter((id): id is string => typeof id === "string" && id.length > 0),
    ),
  ];
  let byId = new Map<string, { id: string; name: string | null; email: string }>();
  if (ids.length > 0) {
    const users = await prisma.user.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true, email: true },
    });
    byId = new Map(users.map((u) => [u.id, u]));
  }
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    isDraft: r.isDraft,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    clientMaster: r.clientMaster,
    traineeUser: r.traineeUserId ? byId.get(r.traineeUserId) ?? null : null,
    exercises: r.exercises,
  }));
}

export async function listTrainingPlansForTrainer() {
  const rows = await prisma.trainingPlan.findMany({
    orderBy: { updatedAt: "desc" },
    include: trainingPlanListInclude,
  });
  const withTrainees = await hydrateTraineesOnPlanRows(rows);
  return withTrainees.map(toSavedPlanSummary);
}

/** Plans explicitly assigned to this trainee (`TrainingPlan.traineeUserId` equals their user id). */
export async function listTrainingPlansAssignedToTrainee(traineeUserId: string): Promise<
  SavedPlanSummary[]
> {
  const uid = typeof traineeUserId === "string" ? traineeUserId.trim() : "";
  if (!uid) {
    return [];
  }

  const rows = await prisma.trainingPlan.findMany({
    where: { traineeUserId: uid },
    orderBy: { updatedAt: "desc" },
    include: trainingPlanListInclude,
  });
  const withTrainees = await hydrateTraineesOnPlanRows(rows);
  return withTrainees.map(toSavedPlanSummary);
}

/** Single assigned plan by id (must belong to the trainee). */
export async function getAssignedTrainingPlanForTrainee(
  traineeUserId: string,
  planId: string,
): Promise<SavedPlanSummary | null> {
  const uid = traineeUserId.trim();
  const pid = planId.trim();
  if (!uid || !pid) return null;
  const row = await prisma.trainingPlan.findFirst({
    where: { id: pid, traineeUserId: uid },
    include: trainingPlanListInclude,
  });
  if (!row) return null;
  const [h] = await hydrateTraineesOnPlanRows([row]);
  return toSavedPlanSummary(h);
}

/** Plans for the trainer’s mapped client master only. */
export async function listTrainingPlansForTrainerClient(trainerUserId: string): Promise<
  SavedPlanSummary[]
> {
  const scope = await getTrainerClientScope(trainerUserId);
  if (!scope.ok) {
    return [];
  }
  const rows = await prisma.trainingPlan.findMany({
    where: { clientMasterId: scope.trainerMasterId },
    orderBy: { updatedAt: "desc" },
    include: trainingPlanListInclude,
  });
  const withTrainees = await hydrateTraineesOnPlanRows(rows);
  return withTrainees.map(toSavedPlanSummary);
}

export async function getTrainingPlanForTrainerEdit(
  planId: string,
  trainerUserId: string,
): Promise<SavedPlanSummary | null> {
  const scope = await getTrainerClientScope(trainerUserId);
  if (!scope.ok) return null;
  const row = await prisma.trainingPlan.findFirst({
    where: { id: planId, clientMasterId: scope.trainerMasterId },
    include: trainingPlanListInclude,
  });
  if (!row) return null;
  const [withTrainee] = await hydrateTraineesOnPlanRows([row]);
  return toSavedPlanSummary(withTrainee);
}

/**
 * Plans for the signed-in client user: same `ClientMaster` as their `mappedMasterClientId`, or
 * (for legacy Avaya/Tawrid portal accounts) the master inferred from their email.
 */
export async function listTrainingPlansForClientUser(clientUserId: string) {
  const uid = typeof clientUserId === "string" ? clientUserId.trim() : "";
  if (!uid) {
    return [];
  }

  const user = await prisma.user.findUnique({
    where: { id: uid },
    select: { mappedMasterClientId: true, email: true },
  });
  if (!user) {
    return [];
  }

  let clientMasterId = user.mappedMasterClientId;
  if (!clientMasterId) {
    const preset = PREDEFINED_TRAINING_PLAN_CLIENTS.find(
      (c) => c.email.toLowerCase() === user.email.trim().toLowerCase(),
    );
    if (preset) {
      const m = await prisma.clientMaster.findUnique({
        where: { name: preset.name },
        select: { id: true },
      });
      clientMasterId = m?.id ?? null;
    }
  }

  if (!clientMasterId) {
    return [];
  }

  const rows = await prisma.trainingPlan.findMany({
    where: {
      clientMasterId,
      OR: [{ traineeUserId: null }, { traineeUserId: uid }],
    },
    orderBy: { updatedAt: "desc" },
    include: trainingPlanListInclude,
  });
  const withTrainees = await hydrateTraineesOnPlanRows(rows);
  return withTrainees.map(toSavedPlanSummary);
}
