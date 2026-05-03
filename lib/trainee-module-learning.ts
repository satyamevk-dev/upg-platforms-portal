import { getTrainingTopicById } from "@/lib/all-training-topics";
import { trainingGroupIsSyllabusCohort } from "@/lib/course-catalog-syllabus";
import { loadCourseSyllabusModuleLessonMarkdown } from "@/lib/course-syllabus-lesson-load";
import { loadCourseSyllabusModuleQuiz } from "@/lib/course-syllabus-quiz-load";
import type { ParsedExerciseDetails } from "@/lib/exercise-details-json";
import { parseExerciseDetailsJson } from "@/lib/exercise-details-json";
import { generateModuleQuiz, stripQuizAnswers, type QuizQuestionPublic } from "@/lib/module-quiz";
import {
  buildDynamicModuleOverviewMarkdown,
  buildDynamicStudyNotesFromResolvedContext,
  resolveTrainingContext,
} from "@/lib/module-dynamic-training-content";
import { buildModuleKeyTermsMarkdown } from "@/lib/module-topic-glossary";
import { parsePlanEntryId } from "@/lib/plan-sequence";
import type { SavedPlanModule } from "@/lib/training-plan-summary";
import { getTrainingSourceForTopicId } from "@/lib/training-topic-source";

export type ExerciseRowForModule = {
  id: string;
  name: string;
  details: string | null;
  order: number;
};

/** Bullet lines derived from library topic when entryId references a known topic. */
export function topicBulletsFromEntryId(entryId: string | null): string[] {
  if (!entryId?.trim()) return [];
  const parsed = parsePlanEntryId(entryId);
  if (!parsed) return [];
  const topic = getTrainingTopicById(parsed.topicId);
  if (!topic) return [];
  if (parsed.kind === "subtopic") {
    const line = topic.minors[parsed.minorIndex];
    return line ? [line] : [];
  }
  return [topic.major, ...topic.minors];
}

/**
 * Bullets for quizzes and curriculum anchors: trainee-visible module title first (same string as the
 * "Module study" heading), then library syllabus lines without duplicating that label.
 */
export function topicBulletsForTraineeModule(
  module: Pick<SavedPlanModule, "title">,
  entryId: string | null,
): string[] {
  const base = topicBulletsFromEntryId(entryId);
  const label = module.title.trim();
  if (!label) return base;
  const rest = base.filter((b) => b.trim() !== label);
  return [label, ...rest];
}

/**
 * Module overview paragraph — always derived from resolved topic focus + learning track (see {@link resolveTrainingContext}).
 */
export function buildModuleTopicOverview(
  entryId: string | null,
  module: Pick<SavedPlanModule, "title" | "subtitle" | "sectionHeader">,
): string {
  const ctx = resolveTrainingContext(entryId, module.sectionHeader ?? null, module);
  return buildDynamicModuleOverviewMarkdown(ctx);
}

export function buildModuleLearningMarkdown(
  module: Pick<SavedPlanModule, "title" | "subtitle" | "sectionHeader">,
  parsed: ParsedExerciseDetails,
  topicBullets: string[],
  resolvedEntryId: string | null,
): string {
  const entryForCtx = resolvedEntryId ?? parsed.entryId ?? null;
  const ctx = resolveTrainingContext(entryForCtx, module.sectionHeader ?? null, module);

  const parsedEntry = entryForCtx?.trim() ? parsePlanEntryId(entryForCtx.trim()) : null;
  const topicId = parsedEntry?.topicId ?? null;
  let syllabusGuideLesson: string | null = null;
  if (topicId) {
    const labels = getTrainingSourceForTopicId(topicId);
    if (trainingGroupIsSyllabusCohort(labels?.group)) {
      syllabusGuideLesson = loadCourseSyllabusModuleLessonMarkdown(topicId);
    }
  }

  const lines: string[] = [];
  const title = module.title.trim() || "Module";
  lines.push(`# ${title}`);
  lines.push("");
  if (module.subtitle?.trim()) {
    lines.push(module.subtitle.trim());
    lines.push("");
  }
  if (module.sectionHeader?.trim()) {
    lines.push(`**Learning track:** ${module.sectionHeader.trim()}`);
    lines.push("");
  }

  if (syllabusGuideLesson) {
    lines.push("## Module guide");
    lines.push("");
    lines.push(
      "The following sections are taken from the **syllabus** module guide for this topic (overview, objectives, lessons, and takeaways). The quiz uses the **Quiz** section in that same syllabus-linked file when present.",
    );
    lines.push("");
    lines.push(syllabusGuideLesson);
    lines.push("");
    const keyTermsMd = buildModuleKeyTermsMarkdown(resolvedEntryId ?? parsed.entryId ?? null, module);
    if (keyTermsMd.trim()) {
      lines.push(keyTermsMd);
      lines.push("");
    }
  } else {
    lines.push("## Module overview");
    lines.push("");
    lines.push(buildDynamicModuleOverviewMarkdown(ctx));
    lines.push("");
    const keyTermsMd = buildModuleKeyTermsMarkdown(resolvedEntryId ?? parsed.entryId ?? null, module);
    if (keyTermsMd.trim()) {
      lines.push(keyTermsMd);
      lines.push("");
    }
  }

  lines.push("## How completion works");
  lines.push("");
  if (syllabusGuideLesson) {
    lines.push(
      "Read the **module guide** above. When you are ready, use the **topic quiz** linked from your plan (after every related step is marked studied). Submitting that quiz completes every row for this topic; use per-question feedback on the quiz page to reinforce what you learned.",
    );
  } else {
    lines.push(
      "Read all sections below, then mark study complete. Take the **module or topic quiz** from your plan overview when it unlocks. For syllabus-backed tracks (for example `courses/linux/syllabus.md`, `courses/networking/syllabus.md`, `courses/python/syllabus.md`, `courses/postgresql/syllabus.md`, and the Avaya cohort syllabi under `courses/avaya-aoc/`), questions come from the **Quiz** section in the syllabus-linked module guide when available; otherwise the app generates questions from your plan.",
    );
  }
  lines.push("");

  if (parsed.learningContent?.trim()) {
    lines.push("## Extended material");
    lines.push("");
    lines.push(parsed.learningContent.trim());
    lines.push("");
  }

  if (!syllabusGuideLesson) {
    lines.push("## Study notes");
    lines.push("");
    lines.push(buildDynamicStudyNotesFromResolvedContext(ctx));
    lines.push("");
  }

  if (topicBullets.length > 0) {
    lines.push("### Curriculum anchors (from your plan)");
    lines.push("");
    for (const b of topicBullets) {
      lines.push(`- ${b}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Quiz for this plan module: for any syllabus cohort track, use the `## Quiz` in the module guide for the **syllabus topic**
 * (see `courses/<track>/syllabus.md`). One quiz per syllabus topic id — plan
 * modules that reference the same topic (including `st:topicId:n` subtopic rows) **share** that grouped quiz.
 * Other tracks or missing/unparseable file quiz fall back to generation.
 */
export function resolveModuleQuiz(
  planId: string,
  moduleOrder: number,
  module: Pick<SavedPlanModule, "title" | "subtitle" | "sectionHeader" | "entryId">,
  parsed: ParsedExerciseDetails,
  topicBullets: string[],
): { quiz: import("@/lib/exercise-details-json").ModuleQuizItem[]; publicQuiz: QuizQuestionPublic[] } {
  const resolvedEntryId = module.entryId ?? parsed.entryId ?? null;
  const parsedEntry = resolvedEntryId?.trim() ? parsePlanEntryId(resolvedEntryId.trim()) : null;
  const topicId = parsedEntry?.topicId ?? null;
  if (topicId) {
    const labels = getTrainingSourceForTopicId(topicId);
    if (trainingGroupIsSyllabusCohort(labels?.group)) {
      const guideQuiz = loadCourseSyllabusModuleQuiz(topicId);
      if (guideQuiz && guideQuiz.length > 0) {
        return { quiz: guideQuiz, publicQuiz: stripQuizAnswers(guideQuiz) };
      }
    }
  }

  /** Generated MCQs from module topic + learning-track level when no syllabus file quiz applies. */
  const quiz = generateModuleQuiz({
    planId,
    moduleOrder,
    moduleTitle: module.title.trim() || "Module",
    topicBullets,
    sectionHeader: module.sectionHeader,
    entryId: module.entryId ?? parsed.entryId ?? null,
    subtitle: module.subtitle,
  });
  return { quiz, publicQuiz: stripQuizAnswers(quiz) };
}

export function parseExerciseRow(details: string | null): ParsedExerciseDetails {
  return parseExerciseDetailsJson(details);
}
