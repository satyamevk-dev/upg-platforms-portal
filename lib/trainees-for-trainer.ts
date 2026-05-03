import { prisma } from "@/lib/prisma";
import { PREDEFINED_TRAINING_PLAN_CLIENTS } from "@/lib/training-plan-clients";

export type TraineeRow = {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
};

/** Maps a user to a `ClientMaster` id via `mappedMasterClientId` or legacy preset email. */
export function effectiveClientMasterId(
  u: { mappedMasterClientId: string | null; email: string },
  nameToMasterId: Map<string, string>,
): string | null {
  if (u.mappedMasterClientId) return u.mappedMasterClientId;
  const preset = PREDEFINED_TRAINING_PLAN_CLIENTS.find(
    (c) => c.email.toLowerCase() === u.email.trim().toLowerCase(),
  );
  if (!preset) return null;
  return nameToMasterId.get(preset.name) ?? null;
}

export type TrainerClientScope =
  | { ok: false }
  | {
      ok: true;
      trainerMasterId: string;
      /** `ClientMaster.name` for this trainer’s mapping. */
      clientName: string;
      nameToMasterId: Map<string, string>;
    };

/** Shared lookup for “this trainer’s client master” (for rosters, analytics, etc.). */
export async function getTrainerClientScope(trainerUserId: string): Promise<TrainerClientScope> {
  const masters = await prisma.clientMaster.findMany({ select: { id: true, name: true } });
  const nameToMasterId = new Map(masters.map((m) => [m.name, m.id]));

  const trainer = await prisma.user.findUnique({
    where: { id: trainerUserId },
    select: { role: true, mappedMasterClientId: true, email: true },
  });
  if (!trainer || trainer.role !== "trainer") {
    return { ok: false };
  }

  const trainerMasterId = effectiveClientMasterId(trainer, nameToMasterId);
  if (!trainerMasterId) {
    return { ok: false };
  }

  const masterRow = masters.find((m) => m.id === trainerMasterId);
  if (!masterRow) {
    return { ok: false };
  }

  return {
    ok: true,
    trainerMasterId,
    clientName: masterRow.name,
    nameToMasterId,
  };
}

/**
 * Trainees that belong to the same client master as the trainer (Avaya/Tawrid preset mapping),
 * including legacy portal accounts resolved by preset email.
 */
export async function getTraineesForTrainer(trainerUserId: string): Promise<{
  trainees: TraineeRow[];
  trainerHasClient: boolean;
  mappedClientName: string | null;
  mappedClientMasterId: string | null;
}> {
  const scope = await getTrainerClientScope(trainerUserId);
  if (!scope.ok) {
    return {
      trainees: [],
      trainerHasClient: false,
      mappedClientName: null,
      mappedClientMasterId: null,
    };
  }

  const { trainerMasterId, nameToMasterId, clientName } = scope;

  const traineeRows = await prisma.user.findMany({
    where: { role: "trainee" },
    select: {
      id: true,
      email: true,
      name: true,
      mappedMasterClientId: true,
      createdAt: true,
    },
    orderBy: { email: "asc" },
  });

  const trainees: TraineeRow[] = traineeRows
    .filter((t) => effectiveClientMasterId(t, nameToMasterId) === trainerMasterId)
    .map((t) => ({
      id: t.id,
      email: t.email,
      name: t.name,
      createdAt: t.createdAt,
    }));

  return {
    trainees,
    trainerHasClient: true,
    mappedClientName: clientName,
    mappedClientMasterId: trainerMasterId,
  };
}

/** Count of trainee-role users on the same client master as this trainer (for analytics). */
export async function countTraineesForTrainerClient(trainerUserId: string): Promise<number> {
  const scope = await getTrainerClientScope(trainerUserId);
  if (!scope.ok) return 0;
  const { trainerMasterId, nameToMasterId } = scope;
  const rows = await prisma.user.findMany({
    where: { role: "trainee" },
    select: { mappedMasterClientId: true, email: true },
  });
  return rows.filter(
    (u) => effectiveClientMasterId(u, nameToMasterId) === trainerMasterId,
  ).length;
}

/** Resolve trainee id from the request body: empty → null; non-null must be on the trainer’s roster. */
export async function resolveTraineeUserIdForTrainerPlan(
  trainerUserId: string,
  traineeUserIdRaw: unknown,
): Promise<{ ok: true; traineeUserId: string | null } | { ok: false; error: string }> {
  if (traineeUserIdRaw === null || traineeUserIdRaw === undefined) {
    return { ok: true, traineeUserId: null };
  }
  if (typeof traineeUserIdRaw !== "string") {
    return { ok: false, error: "Invalid trainee selection." };
  }
  const trimmed = traineeUserIdRaw.trim();
  if (!trimmed) {
    return { ok: true, traineeUserId: null };
  }
  const { trainees } = await getTraineesForTrainer(trainerUserId);
  if (!trainees.some((t) => t.id === trimmed)) {
    return { ok: false, error: "Trainee must belong to your client roster." };
  }
  return { ok: true, traineeUserId: trimmed };
}
