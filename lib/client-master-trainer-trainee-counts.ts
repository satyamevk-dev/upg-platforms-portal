import { prisma } from "@/lib/prisma";

/** Counts of portal users with role trainer or trainee per `mappedMasterClientId` (non-null only). */
export async function trainerTraineeCountByClientMasterId(): Promise<Map<string, number>> {
  const rows = await prisma.user.groupBy({
    by: ["mappedMasterClientId"],
    where: {
      mappedMasterClientId: { not: null },
      role: { in: ["trainer", "trainee"] },
    },
    _count: { _all: true },
  });
  const map = new Map<string, number>();
  for (const r of rows) {
    const id = r.mappedMasterClientId;
    if (id) map.set(id, r._count._all);
  }
  return map;
}

export async function trainerTraineeCountForClientMasterId(clientMasterId: string): Promise<number> {
  const id = clientMasterId.trim();
  if (!id) return 0;
  return prisma.user.count({
    where: {
      mappedMasterClientId: id,
      role: { in: ["trainer", "trainee"] },
    },
  });
}
