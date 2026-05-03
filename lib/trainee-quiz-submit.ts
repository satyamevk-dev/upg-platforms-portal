import { prisma } from "@/lib/prisma";
import { gradeQuiz } from "@/lib/module-quiz";
import { parseExerciseRow, resolveModuleQuiz, topicBulletsForTraineeModule } from "@/lib/trainee-module-learning";
import {
  completeTraineeModuleAfterQuiz,
  progressRowToPayload,
  reconcileTraineeProgressWithPlan,
  scrubStaleHighestCompletedOrderRow,
} from "@/lib/trainee-plan-progress";
import type { SavedPlanSummary } from "@/lib/training-plan-summary";
import { getAssignedTrainingPlanForTrainee } from "@/lib/training-plans-list";
import type { TraineeProgressPayload } from "@/lib/trainee-plan-progress";

export type TraineeQuizSubmitResult =
  | {
      ok: true;
      correctCount: number;
      totalQuestions: number;
      plan: SavedPlanSummary;
      progress: TraineeProgressPayload;
    }
  | { ok: false; error: string; status: number };

/**
 * Shared server handler: grade quiz for `moduleOrder` and record completions (including LINUX cohort merge).
 */
export async function submitTraineeModuleQuiz(args: {
  traineeUserId: string;
  planId: string;
  moduleOrder: number;
  answers: number[];
}): Promise<TraineeQuizSubmitResult> {
  const { traineeUserId, planId, moduleOrder, answers } = args;
  const uid = traineeUserId.trim();
  const pid = planId.trim();
  if (!uid || !pid) {
    return { ok: false, error: "Invalid request.", status: 400 };
  }
  if (typeof moduleOrder !== "number" || !Number.isInteger(moduleOrder)) {
    return { ok: false, error: "Invalid module", status: 400 };
  }

  const plan = await getAssignedTrainingPlanForTrainee(uid, pid);
  if (!plan) {
    return { ok: false, error: "Not found", status: 404 };
  }

  const exercise = await prisma.exercise.findFirst({
    where: { trainingPlanId: plan.id, order: moduleOrder },
    select: { details: true },
  });
  if (!exercise) {
    return { ok: false, error: "Module not found", status: 404 };
  }

  const mod = plan.modules.find((m) => m.order === moduleOrder);
  if (!mod) {
    return { ok: false, error: "Module not found", status: 404 };
  }

  let progressRow = await prisma.traineePlanProgress.findUnique({
    where: {
      userId_trainingPlanId: {
        userId: uid,
        trainingPlanId: plan.id,
      },
    },
  });
  if (progressRow) {
    progressRow = await scrubStaleHighestCompletedOrderRow(progressRow);
    progressRow = await reconcileTraineeProgressWithPlan(uid, plan, progressRow);
  }
  const progress = progressRowToPayload(progressRow, plan);

  if (progress.status === "not_started") {
    return {
      ok: false,
      error: "Start your plan from the plan overview before submitting the quiz.",
      status: 400,
    };
  }

  if (progress.status !== "in_progress" && progress.status !== "paused") {
    return {
      ok: false,
      error: "Start or resume your plan before submitting the quiz.",
      status: 400,
    };
  }

  const parsed = parseExerciseRow(exercise.details);
  const bullets = topicBulletsForTraineeModule(mod, mod.entryId ?? parsed.entryId ?? null);
  const { quiz } = resolveModuleQuiz(plan.id, moduleOrder, mod, parsed, bullets);

  if (answers.length !== quiz.length) {
    return {
      ok: false,
      error: `Submit exactly ${quiz.length} answers`,
      status: 400,
    };
  }

  const { correctCount } = gradeQuiz(quiz, answers);

  const result = await completeTraineeModuleAfterQuiz(uid, pid, moduleOrder);
  if (!result.ok) {
    return { ok: false, error: result.error, status: 400 };
  }

  return {
    ok: true,
    correctCount,
    totalQuestions: quiz.length,
    plan: result.plan,
    progress: result.progress,
  };
}
