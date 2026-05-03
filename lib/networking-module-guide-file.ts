import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { getNetworkingSyllabusModuleGuideRepoPath } from "@/lib/networking-syllabus-index";
import { networkingModuleGuidePath } from "@/lib/networking-syllabus-for-plan";

const cache = new Map<string, string | null>();

/**
 * Raw markdown for a Networking module guide. Path resolution:
 * 1. `courses/networking/syllabus.md` table when listed.
 * 2. Otherwise {@link networkingModuleGuidePath} (tier prefix convention).
 *
 * Server-only. Cached per topic id for the process lifetime.
 */
export function readNetworkingModuleGuideMarkdown(topicId: string): string | null {
  const id = topicId.trim();
  if (!id) return null;
  const hit = cache.get(id);
  if (hit !== undefined) return hit;

  const rel = getNetworkingSyllabusModuleGuideRepoPath(id) ?? networkingModuleGuidePath(id);
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
