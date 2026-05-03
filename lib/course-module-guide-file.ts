import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { readLinuxModuleGuideMarkdown } from "@/lib/linux-module-guide-file";
import { readNetworkingModuleGuideMarkdown } from "@/lib/networking-module-guide-file";
import {
  courseModuleGuideFallbackRepoPath,
  syllabusRelPathForTrainingGroup,
  trainingGroupIsSyllabusCohort,
} from "@/lib/course-catalog-syllabus";
import { getCourseSyllabusModuleGuideRepoPath } from "@/lib/course-syllabus-index";
import { getTrainingSourceForTopicId } from "@/lib/training-topic-source";

const cache = new Map<string, string | null>();

/**
 * Raw markdown for any syllabus-backed module guide (Linux, Networking, Python, PostgreSQL, Avaya tracks).
 * Delegates to existing Linux/Networking readers where those loaders already encode syllabus + fallback rules.
 */
export function readCourseModuleGuideMarkdown(topicId: string): string | null {
  const id = topicId.trim();
  if (!id) return null;
  const hit = cache.get(id);
  if (hit !== undefined) return hit;

  const group = getTrainingSourceForTopicId(id)?.group;
  if (!trainingGroupIsSyllabusCohort(group)) {
    cache.set(id, null);
    return null;
  }

  if (group === "LINUX") {
    const md = readLinuxModuleGuideMarkdown(id);
    cache.set(id, md);
    return md;
  }
  if (group === "Networking") {
    const md = readNetworkingModuleGuideMarkdown(id);
    cache.set(id, md);
    return md;
  }

  const syllabusRel = syllabusRelPathForTrainingGroup(group);
  const rel = getCourseSyllabusModuleGuideRepoPath(syllabusRel, id) ?? courseModuleGuideFallbackRepoPath(id);
  if (!rel) {
    cache.set(id, null);
    return null;
  }

  const abs = join(process.cwd(), rel);
  if (!existsSync(abs)) {
    cache.set(id, null);
    return null;
  }

  try {
    const md = readFileSync(abs, "utf8");
    cache.set(id, md);
    return md;
  } catch {
    cache.set(id, null);
    return null;
  }
}
