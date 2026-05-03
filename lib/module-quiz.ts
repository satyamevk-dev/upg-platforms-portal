import type { ModuleQuizItem } from "@/lib/exercise-details-json";
import {
  isLinuxKernelVsDistributionFocus,
  resolveTrainingContext,
} from "@/lib/module-dynamic-training-content";
import { generateLinuxKernelDistributionQuizItems } from "@/lib/module-quiz-linux-kernel-distribution";
import { generateTopicTrackLevelQuizItems } from "@/lib/module-quiz-topic-track";

/** Question count for {@link generateModuleQuiz} (programmatic bank). Syllabus-backed LINUX quizzes use fewer items — see {@link loadLinuxSyllabusModuleQuiz}. */
export const MODULE_QUIZ_QUESTION_COUNT = 25;

export type QuizQuestionPublic = {
  question: string;
  choices: string[];
  /** Used by the trainee UI for immediate feedback after each selection (grading still happens server-side). */
  correctIndex: number;
};

function hashSeed(parts: string[]): number {
  const s = parts.join("|");
  let h = 1779033703;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

/**
 * Builds 25 distinct multiple-choice questions for a module. Deterministic for the same inputs.
 * Always derived from {@link resolveTrainingContext}: topic focus, track label, syllabus minors, and tier
 * (Basic / Intermediate / Advanced / General→Basic). Specialized bank for Linux kernel vs distribution;
 * otherwise {@link generateTopicTrackLevelQuizItems}.
 */
export function generateModuleQuiz(params: {
  planId: string;
  moduleOrder: number;
  moduleTitle: string;
  topicBullets: string[];
  sectionHeader?: string | null;
  entryId?: string | null;
  subtitle?: string | null;
}): ModuleQuizItem[] {
  const ctx = resolveTrainingContext(params.entryId ?? null, params.sectionHeader ?? null, {
    title: params.moduleTitle,
    subtitle: params.subtitle ?? "",
  });

  if (isLinuxKernelVsDistributionFocus(ctx.topicFocus)) {
    const seed = hashSeed([
      params.planId,
      String(params.moduleOrder),
      params.moduleTitle,
      "quiz:linux-kernel-distro",
      ctx.level,
      ctx.topicFocus,
    ]);
    return generateLinuxKernelDistributionQuizItems(seed, ctx.level);
  }

  const seed = hashSeed([
    params.planId,
    String(params.moduleOrder),
    params.moduleTitle,
    "quiz:topic-track",
    ctx.level,
    ctx.topicFocus,
    ctx.trackLabel,
    ctx.majorTopic ?? "",
    ctx.curriculumMinors.join("\u001f"),
  ]);
  return generateTopicTrackLevelQuizItems(seed, ctx, params.topicBullets, params.moduleTitle);
}

export function normalizeQuizFromDetails(raw: ModuleQuizItem[] | undefined): ModuleQuizItem[] | null {
  if (!raw || raw.length !== MODULE_QUIZ_QUESTION_COUNT) {
    return null;
  }
  for (const q of raw) {
    if (
      !q.question?.trim() ||
      !Array.isArray(q.choices) ||
      q.choices.length < 2 ||
      typeof q.correctIndex !== "number" ||
      q.correctIndex < 0 ||
      q.correctIndex >= q.choices.length
    ) {
      return null;
    }
  }
  return raw;
}

export function stripQuizAnswers(quiz: ModuleQuizItem[]): QuizQuestionPublic[] {
  return quiz.map((q) => ({
    question: q.question,
    choices: q.choices,
    correctIndex: q.correctIndex,
  }));
}

export function gradeQuiz(quiz: ModuleQuizItem[], answers: number[]): { correctCount: number } {
  let correctCount = 0;
  for (let i = 0; i < quiz.length; i++) {
    const a = answers[i];
    const q = quiz[i];
    if (typeof a !== "number" || !Number.isInteger(a) || !q) continue;
    if (a === q.correctIndex) {
      correctCount += 1;
    }
  }
  return { correctCount };
}
