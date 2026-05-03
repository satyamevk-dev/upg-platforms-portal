import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { linuxModuleGuidePath } from "@/lib/linux-syllabus-for-plan";
import { getLinuxSyllabusModuleGuideRepoPath } from "@/lib/linux-syllabus-index";

const cache = new Map<string, string | null>();

/**
 * Raw markdown for a LINUX module guide. Path resolution:
 * 1. `courses/linux/syllabus.md` table (Module ID + module guide link) when listed.
 * 2. Otherwise {@link linuxModuleGuidePath} (tier prefix convention).
 *
 * Server-only. Cached per topic id for the process lifetime.
 */
export function readLinuxModuleGuideMarkdown(topicId: string): string | null {
  const id = topicId.trim();
  if (!id) return null;
  const hit = cache.get(id);
  if (hit !== undefined) return hit;

  const rel = getLinuxSyllabusModuleGuideRepoPath(id) ?? linuxModuleGuidePath(id);
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
