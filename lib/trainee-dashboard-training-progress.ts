import { prisma } from "@/lib/prisma";
import {
  completionKeyForModule,
  getSortedModuleOrdersFromPlan,
  progressRowToPayload,
  scrubStaleHighestCompletedOrderRow,
} from "@/lib/trainee-plan-progress";
import { listTrainingPlansAssignedToTrainee } from "@/lib/training-plans-list";

export type TraineePlanProgressChartRow = {
  planId: string;
  title: string;
  /** Truncated for chart axis labels */
  titleShort: string;
  percentComplete: number;
  modulesDone: number;
  modulesTotal: number;
};

export async function getTraineePlanProgressChartData(
  traineeUserId: string,
): Promise<TraineePlanProgressChartRow[]> {
  const uid = traineeUserId.trim();
  if (!uid) {
    return [];
  }

  const plans = await listTrainingPlansAssignedToTrainee(uid);
  const progressRows = await prisma.traineePlanProgress.findMany({
    where: { userId: uid },
  });
  const scrubbedRows = await Promise.all(progressRows.map((r) => scrubStaleHighestCompletedOrderRow(r)));
  const byPlanId = new Map(scrubbedRows.map((r) => [r.trainingPlanId, r]));

  return plans.map((plan) => {
    const progress = progressRowToPayload(byPlanId.get(plan.id) ?? null, plan);
    const sorted = getSortedModuleOrdersFromPlan(plan);
    const modulesTotal = sorted.length;

    let modulesDone: number;
    let percentComplete: number;

    if (modulesTotal === 0) {
      modulesDone = 0;
      percentComplete = progress.status === "completed" ? 100 : 0;
    } else if (progress.status === "completed") {
      modulesDone = modulesTotal;
      percentComplete = 100;
    } else {
      const doneSet = new Set(progress.completedEntryIds ?? []);
      modulesDone = sorted.filter((o) => {
        const m = plan.modules.find((x) => x.order === o);
        return m ? doneSet.has(completionKeyForModule(m)) : false;
      }).length;
      percentComplete = Math.round((modulesDone / modulesTotal) * 100);
    }

    const title = plan.title.trim() || "Untitled plan";
    const titleShort = title.length > 44 ? `${title.slice(0, 41)}…` : title;

    return {
      planId: plan.id,
      title,
      titleShort,
      percentComplete,
      modulesDone,
      modulesTotal,
    };
  });
}
