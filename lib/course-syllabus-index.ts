import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { posix } from "path";

export type CourseSyllabusTrackLevel = "Basic" | "Intermediate" | "Advanced";

export type CourseSyllabusTopicEntry = {
  guideRepoPath: string;
  trackLevel: CourseSyllabusTrackLevel;
};

const cache = new Map<string, Map<string, CourseSyllabusTopicEntry> | null>();

const TRACK_HEADER_RE = /^## Track \d+\s+—\s+(Basic|Intermediate|Advanced)\s*$/;
const TABLE_ROW_RE =
  /^\|\s*\d+\s*\|\s*`([^`]+)`\s*\|\s*[^|]*\|\s*\[[^\]]*\]\(([^)]+\.md)\)\s*\|\s*$/;

/**
 * Root directory containing `syllabus.md` (e.g. `courses/python`).
 * Table links are joined relative to this root.
 */
function loadTopicEntries(syllabusRelPath: string, courseRootDir: string): Map<string, CourseSyllabusTopicEntry> | null {
  const cached = cache.get(syllabusRelPath);
  if (cached !== undefined) return cached;

  const abs = join(process.cwd(), syllabusRelPath);
  if (!existsSync(abs)) {
    cache.set(syllabusRelPath, null);
    return null;
  }

  let text: string;
  try {
    text = readFileSync(abs, "utf8");
  } catch {
    cache.set(syllabusRelPath, null);
    return null;
  }

  const map = new Map<string, CourseSyllabusTopicEntry>();
  let trackLevel: CourseSyllabusTrackLevel = "Basic";

  for (const line of text.split(/\r?\n/)) {
    const trackMatch = line.match(TRACK_HEADER_RE);
    if (trackMatch) {
      trackLevel = trackMatch[1] as CourseSyllabusTrackLevel;
      continue;
    }
    const rowMatch = line.match(TABLE_ROW_RE);
    if (rowMatch) {
      const topicId = rowMatch[1]!.trim();
      const linkTarget = rowMatch[2]!.trim();
      if (topicId && linkTarget) {
        map.set(topicId, {
          guideRepoPath: posix.join(courseRootDir, linkTarget),
          trackLevel,
        });
      }
    }
  }

  cache.set(syllabusRelPath, map);
  return map;
}

function courseRootFromSyllabusRel(syllabusRelPath: string): string {
  const parts = syllabusRelPath.split("/");
  parts.pop();
  return parts.join("/");
}

export function getCourseSyllabusModuleGuideRepoPath(
  syllabusRelPath: string,
  topicId: string,
): string | null {
  const id = topicId.trim();
  if (!id) return null;
  const root = courseRootFromSyllabusRel(syllabusRelPath);
  const topics = loadTopicEntries(syllabusRelPath, root);
  if (!topics) return null;
  return topics.get(id)?.guideRepoPath ?? null;
}
