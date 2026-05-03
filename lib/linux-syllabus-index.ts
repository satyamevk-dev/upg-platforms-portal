import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { posix } from "path";

const SYLLABUS_REL = "courses/linux/syllabus.md";

/** Track tier as defined by `## Track N — …` headings in `syllabus.md`. */
export type LinuxSyllabusTrackLevel = "Basic" | "Intermediate" | "Advanced";

export type LinuxSyllabusTopicEntry = {
  /** Repo-relative path e.g. `courses/linux/intermediate/int-storage.md` */
  guideRepoPath: string;
  /** Syllabus track (level) this topic belongs to. */
  trackLevel: LinuxSyllabusTrackLevel;
};

let cachedTopics: Map<string, LinuxSyllabusTopicEntry> | undefined | null;

const TRACK_HEADER_RE = /^## Track \d+\s+—\s+(Basic|Intermediate|Advanced)\s*$/;
const TABLE_ROW_RE =
  /^\|\s*\d+\s*\|\s*`([^`]+)`\s*\|\s*[^|]*\|\s*\[[^\]]*\]\(([^)]+\.md)\)\s*\|\s*$/;

/**
 * Parses `courses/linux/syllabus.md`: each table row under a track heading gets
 * `topicId → { guide path, track level }`. Cached for the process lifetime.
 */
function loadLinuxSyllabusTopicEntries(): Map<string, LinuxSyllabusTopicEntry> | null {
  if (cachedTopics !== undefined) return cachedTopics;

  const abs = join(process.cwd(), SYLLABUS_REL);
  if (!existsSync(abs)) {
    cachedTopics = null;
    return null;
  }

  let text: string;
  try {
    text = readFileSync(abs, "utf8");
  } catch {
    cachedTopics = null;
    return null;
  }

  const map = new Map<string, LinuxSyllabusTopicEntry>();
  let trackLevel: LinuxSyllabusTrackLevel = "Basic";

  for (const line of text.split(/\r?\n/)) {
    const trackMatch = line.match(TRACK_HEADER_RE);
    if (trackMatch) {
      trackLevel = trackMatch[1] as LinuxSyllabusTrackLevel;
      continue;
    }
    const rowMatch = line.match(TABLE_ROW_RE);
    if (rowMatch) {
      const topicId = rowMatch[1]!.trim();
      const linkTarget = rowMatch[2]!.trim();
      if (topicId && linkTarget) {
        map.set(topicId, {
          guideRepoPath: posix.join("courses/linux", linkTarget),
          trackLevel,
        });
      }
    }
  }

  cachedTopics = map;
  return map;
}

export function getLinuxSyllabusTopicEntry(topicId: string): LinuxSyllabusTopicEntry | null {
  const id = topicId.trim();
  if (!id) return null;
  const topics = loadLinuxSyllabusTopicEntries();
  if (!topics) return null;
  return topics.get(id) ?? null;
}

/** Official guide path from the syllabus table, or null if this topic id is not listed. */
export function getLinuxSyllabusModuleGuideRepoPath(topicId: string): string | null {
  return getLinuxSyllabusTopicEntry(topicId)?.guideRepoPath ?? null;
}

/** Syllabus track (Basic / Intermediate / Advanced) for a listed topic, or null. */
export function getLinuxSyllabusTopicTrackLevel(topicId: string): LinuxSyllabusTrackLevel | null {
  return getLinuxSyllabusTopicEntry(topicId)?.trackLevel ?? null;
}

export function isLinuxTopicListedInSyllabus(topicId: string): boolean {
  return getLinuxSyllabusTopicEntry(topicId) !== null;
}
