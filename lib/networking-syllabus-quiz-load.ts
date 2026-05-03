import type { ModuleQuizItem } from "@/lib/exercise-details-json";
import { parseLinuxSyllabusQuizMarkdown } from "@/lib/parse-linux-syllabus-quiz";
import { readNetworkingModuleGuideMarkdown } from "@/lib/networking-module-guide-file";

const cache = new Map<string, ModuleQuizItem[] | null>();

/**
 * Loads and parses the end-of-module quiz from Networking tier folders (`netb-`, `neti-`, `neta-` ids).
 * Server-only (filesystem). Returns null if the file is missing or unparsable.
 */
export function loadNetworkingSyllabusModuleQuiz(topicId: string): ModuleQuizItem[] | null {
  const id = topicId.trim();
  if (!id) return null;
  const cached = cache.get(id);
  if (cached !== undefined) return cached;

  const md = readNetworkingModuleGuideMarkdown(id);
  if (!md) {
    cache.set(id, null);
    return null;
  }

  const quiz = parseLinuxSyllabusQuizMarkdown(md);
  cache.set(id, quiz);
  return quiz;
}
