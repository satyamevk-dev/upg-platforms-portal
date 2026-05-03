import type { ModuleQuizItem } from "@/lib/exercise-details-json";
import { parseLinuxSyllabusQuizMarkdown } from "@/lib/parse-linux-syllabus-quiz";
import { readCourseModuleGuideMarkdown } from "@/lib/course-module-guide-file";

const cache = new Map<string, ModuleQuizItem[] | null>();

/** Loads `## Quiz` from any syllabus-backed `courses/**` module file. Server-only. */
export function loadCourseSyllabusModuleQuiz(topicId: string): ModuleQuizItem[] | null {
  const id = topicId.trim();
  if (!id) return null;
  const cached = cache.get(id);
  if (cached !== undefined) return cached;

  const md = readCourseModuleGuideMarkdown(id);
  if (!md) {
    cache.set(id, null);
    return null;
  }

  const quiz = parseLinuxSyllabusQuizMarkdown(md);
  cache.set(id, quiz);
  return quiz;
}
