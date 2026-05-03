export type ModuleQuizItem = {
  question: string;
  choices: string[];
  correctIndex: number;
};

/** Prefix for quiz/progress keys derived from {@link ParsedExerciseDetails.contentId}. */
export const EXERCISE_PROGRESS_CONTENT_PREFIX = "__cid:";

export type ParsedExerciseDetails = {
  entryId?: string;
  /** Stable per-module id (UUID); survives entryId/title edits for the same plan slot. */
  contentId?: string;
  subtitle?: string;
  sectionHeader?: string | null;
  /** Markdown or plain text shown on the trainee module page */
  learningContent?: string;
  /** Legacy field; ignored at runtime. Trainee quizzes are generated from module topic + learning-track level. */
  quiz?: ModuleQuizItem[];
};

export function parseExerciseDetailsJson(details: string | null): ParsedExerciseDetails {
  if (!details?.trim()) {
    return {};
  }
  try {
    const j = JSON.parse(details) as Record<string, unknown>;
    const out: ParsedExerciseDetails = {};
    if (typeof j.entryId === "string") out.entryId = j.entryId;
    if (typeof j.contentId === "string") out.contentId = j.contentId;
    if (typeof j.subtitle === "string") out.subtitle = j.subtitle;
    if (j.sectionHeader === null || typeof j.sectionHeader === "string") {
      out.sectionHeader = j.sectionHeader as string | null;
    }
    if (typeof j.learningContent === "string") out.learningContent = j.learningContent;
    if (Array.isArray(j.quiz)) {
      const quiz: ModuleQuizItem[] = [];
      for (const row of j.quiz) {
        if (!row || typeof row !== "object") continue;
        const r = row as Record<string, unknown>;
        if (typeof r.question !== "string" || !Array.isArray(r.choices)) continue;
        const choices = r.choices.filter((c): c is string => typeof c === "string");
        const ci = r.correctIndex;
        if (
          choices.length < 2 ||
          typeof ci !== "number" ||
          !Number.isInteger(ci) ||
          ci < 0 ||
          ci >= choices.length
        ) {
          continue;
        }
        quiz.push({ question: r.question, choices, correctIndex: ci });
      }
      if (quiz.length > 0) {
        out.quiz = quiz;
      }
    }
    return out;
  } catch {
    return {};
  }
}

/** Entry id stored on the exercise row (plan module identity for progress). */
export function parseEntryIdFromExerciseDetails(details: string | null): string {
  const p = parseExerciseDetailsJson(details);
  return typeof p.entryId === "string" ? p.entryId : "";
}

export function parseContentIdFromExerciseDetails(details: string | null): string | null {
  const p = parseExerciseDetailsJson(details);
  const c = typeof p.contentId === "string" ? p.contentId.trim() : "";
  return c || null;
}

/** Progress/topic key segment when `contentId` is set (full key is {@link EXERCISE_PROGRESS_CONTENT_PREFIX} + id). */
export function stableProgressKeyFromContentId(contentId: string | null | undefined): string | null {
  const c = contentId?.trim();
  return c ? `${EXERCISE_PROGRESS_CONTENT_PREFIX}${c}` : null;
}
