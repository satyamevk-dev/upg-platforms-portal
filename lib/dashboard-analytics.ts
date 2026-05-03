import { prisma } from "@/lib/prisma";
import { countTraineesForTrainerClient } from "@/lib/trainees-for-trainer";

export type DashboardAnalytics = {
  /** Trainee-role users who appear as `traineeUserId` on at least one training plan. */
  traineesAssignedToPlans: number;
  /** Trainee-role users not assigned on any training plan. */
  traineesWithoutAssignedPlan: number;
  totalCourses: number;
  totalExercises: number;
  usersByRole: { name: string; value: number; fill: string }[];
  /** Chart heading for the users-by-role card (platform-wide vs trainer-scoped). */
  usersByRoleTitle: string;
  usersByRoleDescription: string;
  courseCountsByMonth: { label: string; count: number }[];
};

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function buildLastNMonthBuckets(n: number): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      key: monthKey(d),
      label: d.toLocaleString("en-US", { month: "short", year: "2-digit" }),
    });
  }
  return out;
}

const roleChartOrder: { role: "super_admin" | "trainer" | "trainee"; name: string; fill: string }[] =
  [
    { role: "super_admin", name: "Platform Owner", fill: "#5b4b96" },
    { role: "trainer", name: "Trainer", fill: "#00A89E" },
    { role: "trainee", name: "Trainee", fill: "#94a3b8" },
  ];

export async function getDashboardAnalytics(options?: {
  /** When set (trainer dashboard), “users by role” shows only trainees on this trainer’s client. */
  trainerUserId?: string;
}): Promise<DashboardAnalytics | null> {
  try {
    const [
      clientRoleCount,
      totalCourses,
      totalExercises,
      plans,
      roleGroups,
      assignedPlanTraineeRows,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "trainee" } }),
      prisma.trainingPlan.count(),
      prisma.exercise.count(),
      prisma.trainingPlan.findMany({ select: { createdAt: true } }),
      prisma.user.groupBy({
        by: ["role"],
        _count: { id: true },
      }),
      prisma.trainingPlan.findMany({
        where: { traineeUserId: { not: null } },
        select: { traineeUserId: true },
        distinct: ["traineeUserId"],
      }),
    ]);

    const assignedTraineeIds = [
      ...new Set(
        assignedPlanTraineeRows
          .map((r) => r.traineeUserId)
          .filter((id): id is string => Boolean(id)),
      ),
    ];

    const traineesAssignedToPlans =
      assignedTraineeIds.length === 0
        ? 0
        : await prisma.user.count({
            where: { role: "trainee", id: { in: assignedTraineeIds } },
          });

    const traineesWithoutAssignedPlan = Math.max(0, clientRoleCount - traineesAssignedToPlans);

    const countByRole = new Map(roleGroups.map((g) => [g.role, g._count.id]));

    let usersByRole: { name: string; value: number; fill: string }[];
    let usersByRoleTitle: string;
    let usersByRoleDescription: string;

    if (options?.trainerUserId) {
      const traineeCount = await countTraineesForTrainerClient(options.trainerUserId);
      usersByRole = [{ name: "Trainees", value: traineeCount, fill: "#94a3b8" }];
      usersByRoleTitle = "Trainees (your client)";
      usersByRoleDescription =
        "Trainee accounts mapped to the same client master as your trainer profile.";
    } else {
      usersByRole = roleChartOrder.map((row) => ({
        name: row.name,
        value: countByRole.get(row.role) ?? 0,
        fill: row.fill,
      }));
      usersByRoleTitle = "Users by role";
      usersByRoleDescription = "Accounts in the platform by access level.";
    }

    const buckets = buildLastNMonthBuckets(6);
    const counts = new Map<string, number>();
    for (const b of buckets) counts.set(b.key, 0);

    for (const p of plans) {
      const key = monthKey(p.createdAt);
      if (counts.has(key)) {
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }

    const courseCountsByMonth = buckets.map((b) => ({
      label: b.label,
      count: counts.get(b.key) ?? 0,
    }));

    return {
      traineesAssignedToPlans,
      traineesWithoutAssignedPlan,
      totalCourses,
      totalExercises,
      usersByRole,
      usersByRoleTitle,
      usersByRoleDescription,
      courseCountsByMonth,
    };
  } catch {
    return null;
  }
}
