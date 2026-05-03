import type { ModuleQuizItem } from "@/lib/exercise-details-json";
import { readLinuxModuleGuideMarkdown } from "@/lib/linux-module-guide-file";
import { parseLinuxSyllabusQuizMarkdown } from "@/lib/parse-linux-syllabus-quiz";

const cache = new Map<string, ModuleQuizItem[] | null>();

/**
 * Loads and parses the end-of-module quiz from `courses/linux/{basic|intermediate|advanced}/{topicId}.md`.
 * Server-only (filesystem). Returns null if the file is missing or unparsable.
 */
export function loadLinuxSyllabusModuleQuiz(topicId: string): ModuleQuizItem[] | null {
  const id = topicId.trim();
  if (!id) return null;
  const cached = cache.get(id);
  if (cached !== undefined) return cached;

  const md = readLinuxModuleGuideMarkdown(id);
  if (!md) {
    cache.set(id, null);
    return null;
  }

  const quiz = parseLinuxSyllabusQuizMarkdown(md);
  cache.set(id, quiz);
  return quiz;
}
