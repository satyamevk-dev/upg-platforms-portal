import { prisma } from "@/lib/prisma";
import { effectiveClientMasterId } from "@/lib/trainees-for-trainer";
import { sortMasterClients } from "@/lib/training-plan-clients";

export type TrainerSummary = { id: string; email: string; name: string | null };

export type ClientTrainerSection = {
  clientMasterId: string;
  clientName: string;
  trainers: TrainerSummary[];
};

/**
 * All trainer accounts grouped by resolved client master (including legacy email mapping).
 * Trainers with no client mapping appear under `unassigned`.
 */
export type TrainersByClientList = {
  byClient: ClientTrainerSection[];
  unassigned: TrainerSummary[];
};

export async function listTrainersAssignedByClient(): Promise<TrainersByClientList> {
  const masters = sortMasterClients(
    await prisma.clientMaster.findMany({ select: { id: true, name: true } }),
  );
  const nameToMasterId = new Map(masters.map((m) => [m.name, m.id]));

  const trainerUsers = await prisma.user.findMany({
    where: { role: "trainer" },
    select: { id: true, email: true, name: true, mappedMasterClientId: true },
    orderBy: { email: "asc" },
  });

  const buckets = new Map<string, TrainerSummary[]>();
  for (const m of masters) {
    buckets.set(m.id, []);
  }

  const unassigned: TrainerSummary[] = [];

  for (const t of trainerUsers) {
    const mid = effectiveClientMasterId(t, nameToMasterId);
    const summary: TrainerSummary = { id: t.id, email: t.email, name: t.name };
    if (!mid || !buckets.has(mid)) {
      unassigned.push(summary);
      continue;
    }
    buckets.get(mid)!.push(summary);
  }

  const byClient: ClientTrainerSection[] = masters.map((m) => ({
    clientMasterId: m.id,
    clientName: m.name,
    trainers: buckets.get(m.id) ?? [],
  }));

  return { byClient, unassigned };
}
