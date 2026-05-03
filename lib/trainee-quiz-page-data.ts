import { prisma } from "@/lib/prisma";
import { trainingGroupFromQuizSlug } from "@/lib/course-catalog-syllabus";
import { firstPlanOrderForLinuxTopicId, linuxSyllabusTopicIdForPlanModule } from "@/lib/linux-plan-topic-group";
import { traineeSyllabusTopicQuizApiPath } from "@/lib/syllabus-topic-quiz-path";
import { getTrainingSourceForTopicId } from "@/lib/training-topic-source";
import {
  allQuizCohortStudyMarked,
  isModuleQuizCompleted,
  progressRowToPayload,
  reconcileTraineeProgressWithPlan,
  scrubStaleHighestCompletedOrderRow,
} from "@/lib/trainee-plan-progress";
import {
  parseExerciseRow,
  resolveModuleQuiz,
  topicBulletsForTraineeModule,
} from "@/lib/trainee-module-learning";
import type { QuizQuestionPublic } from "@/lib/module-quiz";
import { getAssignedTrainingPlanForTrainee } from "@/lib/training-plans-list";
import type { SavedPlanSummary } from "@/lib/training-plan-summary";
import type { TraineeProgressPayload } from "@/lib/trainee-plan-progress";

export type TraineeQuizPageAccess =
  | "start_plan_first"
  | "need_study"
  | "already_passed"
  | "active";

export type TraineeQuizPagePayload = {
  plan: SavedPlanSummary;
  progress: TraineeProgressPayload;
  access: TraineeQuizPageAccess;
  moduleOrder: number;
  headline: string;
  quizQuestions: QuizQuestionPublic[];
  submitPath: string;
};

export async function loadTraineeSyllabusCohortTopicQuizPage(
  traineeUserId: string,
  planId: string,
  courseSlug: string,
  topicId: string,
): Promise<TraineeQuizPagePayload | null> {
  const tid = topicId.trim();
  const uid = traineeUserId.trim();
  const pid = planId.trim();
  const slug = courseSlug.trim();
  if (!uid || !pid || !tid || !slug) return null;

  const expectedGroup = trainingGroupFromQuizSlug(slug);
  if (!expectedGroup) return null;
  if (getTrainingSourceForTopicId(tid)?.group !== expectedGroup) return null;

  const plan = await getAssignedTrainingPlanForTrainee(uid, pid);
  if (!plan) return null;

  const moduleOrder = firstPlanOrderForLinuxTopicId(plan, tid);
  if (moduleOrder === null) return null;

  const submitPath = traineeSyllabusTopicQuizApiPath(plan.id, tid);
  if (!submitPath) return null;

  return loadTraineeQuizPageForOrder(uid, plan, moduleOrder, {
    headline: `Topic quiz · ${tid}`,
    submitPath,
  });
}

export async function loadTraineeModuleQuizPage(
  traineeUserId: string,
  planId: string,
  moduleOrder: number,
): Promise<TraineeQuizPagePayload | null> {
  const uid = traineeUserId.trim();
  const pid = planId.trim();
  if (!uid || !pid || !Number.isInteger(moduleOrder)) return null;

  const plan = await getAssignedTrainingPlanForTrainee(uid, pid);
  if (!plan) return null;

  const mod = plan.modules.find((m) => m.order === moduleOrder);
  if (!mod) return null;
  if (linuxSyllabusTopicIdForPlanModule(mod.entryId) !== null) return null;

  return loadTraineeQuizPageForOrder(uid, plan, moduleOrder, {
    headline: mod.title.trim() || "Module quiz",
    submitPath: `/api/trainee/plans/${encodeURIComponent(plan.id)}/quiz/module/${encodeURIComponent(String(moduleOrder))}`,
  });
}

async function loadTraineeQuizPageForOrder(
  traineeUserId: string,
  plan: SavedPlanSummary,
  moduleOrder: number,
  meta: { headline: string; submitPath: string },
): Promise<TraineeQuizPagePayload | null> {
  const exercise = await prisma.exercise.findFirst({
    where: { trainingPlanId: plan.id, order: moduleOrder },
    select: { details: true },
  });
  if (!exercise) return null;

  const mod = plan.modules.find((m) => m.order === moduleOrder);
  if (!mod) return null;

  let row = await prisma.traineePlanProgress.findUnique({
    where: {
      userId_trainingPlanId: { userId: traineeUserId, trainingPlanId: plan.id },
    },
  });
  if (row) {
    row = await scrubStaleHighestCompletedOrderRow(row);
    row = await reconcileTraineeProgressWithPlan(traineeUserId, plan, row);
  }
  const progress = progressRowToPayload(row, plan);

  let access: TraineeQuizPageAccess;
  if (progress.status === "not_started") {
    access = "start_plan_first";
  } else if (isModuleQuizCompleted(plan, progress, moduleOrder)) {
    access = "already_passed";
  } else if (!allQuizCohortStudyMarked(plan, progress, moduleOrder)) {
    access = "need_study";
  } else {
    access = "active";
  }

  const parsed = parseExerciseRow(exercise.details);
  const bullets = topicBulletsForTraineeModule(mod, mod.entryId ?? parsed.entryId ?? null);
  const { publicQuiz } = resolveModuleQuiz(plan.id, moduleOrder, mod, parsed, bullets);

  return {
    plan,
    progress,
    access,
    moduleOrder,
    headline: meta.headline,
    quizQuestions: publicQuiz,
    submitPath: meta.submitPath,
  };
}
