import { prisma } from "@/lib/prisma";
import { linuxSyllabusTopicIdForPlanModule } from "@/lib/linux-plan-topic-group";
import { traineeSyllabusTopicQuizClientPath } from "@/lib/syllabus-topic-quiz-path";
import {
  allQuizCohortStudyMarked,
  isModuleQuizCompleted,
  isModuleStudyMarked,
  progressRowToPayload,
  reconcileTraineeProgressWithPlan,
  scrubStaleHighestCompletedOrderRow,
} from "@/lib/trainee-plan-progress";
import {
  buildModuleLearningMarkdown,
  parseExerciseRow,
  topicBulletsForTraineeModule,
} from "@/lib/trainee-module-learning";
import type { TraineeProgressPayload } from "@/lib/trainee-plan-progress";
import { getAssignedTrainingPlanForTrainee } from "@/lib/training-plans-list";
import type { SavedPlanSummary } from "@/lib/training-plan-summary";

/** `start_plan_first` until the trainee starts the plan; then any incomplete module is `active`. */
export type TraineeModuleAccess = "active" | "completed_review" | "start_plan_first";

export type TraineeModulePagePayload = {
  plan: SavedPlanSummary;
  progress: TraineeProgressPayload;
  moduleOrder: number;
  moduleTitle: string;
  learningMarkdown: string;
  access: TraineeModuleAccess;
  studyMarked: boolean;
  quizDone: boolean;
  /** When quiz is still required and study rules are satisfied — link to topic or module quiz page. */
  quizHref: string | null;
  /** Set when this module shares a syllabus-backed topic quiz (Linux or Networking). */
  syllabusCohortTopicId: string | null;
};

export async function loadTraineeModulePageData(
  traineeUserId: string,
  planId: string,
  moduleOrder: number,
): Promise<TraineeModulePagePayload | null> {
  const uid = traineeUserId.trim();
  const pid = planId.trim();
  if (!uid || !pid || !Number.isInteger(moduleOrder)) {
    return null;
  }

  const plan = await getAssignedTrainingPlanForTrainee(uid, pid);
  if (!plan) {
    return null;
  }

  const exercise = await prisma.exercise.findFirst({
    where: { trainingPlanId: plan.id, order: moduleOrder },
    select: { name: true, details: true, order: true },
  });
  if (!exercise) {
    return null;
  }

  const mod = plan.modules.find((m) => m.order === moduleOrder);
  if (!mod) {
    return null;
  }

  let row = await prisma.traineePlanProgress.findUnique({
    where: {
      userId_trainingPlanId: { userId: uid, trainingPlanId: plan.id },
    },
  });
  if (row) {
    row = await scrubStaleHighestCompletedOrderRow(row);
    row = await reconcileTraineeProgressWithPlan(uid, plan, row);
  }
  const progress = progressRowToPayload(row, plan);

  const quizDone = isModuleQuizCompleted(plan, progress, moduleOrder);
  const studyMarked = isModuleStudyMarked(plan, progress, moduleOrder);

  let access: TraineeModuleAccess;
  if (progress.status === "not_started") {
    access = "start_plan_first";
  } else if (quizDone) {
    access = "completed_review";
  } else {
    access = "active";
  }

  const parsed = parseExerciseRow(exercise.details);
  const resolvedEntryId = mod.entryId ?? parsed.entryId ?? null;
  const bullets = topicBulletsForTraineeModule(mod, resolvedEntryId);
  const learningMarkdown = buildModuleLearningMarkdown(mod, parsed, bullets, resolvedEntryId);

  const syllabusCohortTopicId = linuxSyllabusTopicIdForPlanModule(mod.entryId);

  let quizHref: string | null = null;
  if (!quizDone && progress.status !== "not_started") {
    if (syllabusCohortTopicId) {
      if (allQuizCohortStudyMarked(plan, progress, moduleOrder)) {
        quizHref = traineeSyllabusTopicQuizClientPath(plan.id, syllabusCohortTopicId);
      }
    } else if (studyMarked) {
      quizHref = `/client/plans/${encodeURIComponent(plan.id)}/quiz/module/${encodeURIComponent(String(moduleOrder))}`;
    }
  }

  return {
    plan,
    progress,
    moduleOrder,
    moduleTitle: mod.title,
    learningMarkdown,
    access,
    studyMarked,
    quizDone,
    quizHref,
    syllabusCohortTopicId,
  };
}
