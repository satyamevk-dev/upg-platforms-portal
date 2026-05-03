import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { posix } from "path";

const SYLLABUS_REL = "courses/networking/syllabus.md";

/** Track tier as defined by `## Track N — …` headings in `syllabus.md`. */
export type NetworkingSyllabusTrackLevel = "Basic" | "Intermediate" | "Advanced";

export type NetworkingSyllabusTopicEntry = {
  guideRepoPath: string;
  trackLevel: NetworkingSyllabusTrackLevel;
};

let cachedTopics: Map<string, NetworkingSyllabusTopicEntry> | undefined | null;

const TRACK_HEADER_RE = /^## Track \d+\s+—\s+(Basic|Intermediate|Advanced)\s*$/;
const TABLE_ROW_RE =
  /^\|\s*\d+\s*\|\s*`([^`]+)`\s*\|\s*[^|]*\|\s*\[[^\]]*\]\(([^)]+\.md)\)\s*\|\s*$/;

function loadNetworkingSyllabusTopicEntries(): Map<string, NetworkingSyllabusTopicEntry> | null {
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

  const map = new Map<string, NetworkingSyllabusTopicEntry>();
  let trackLevel: NetworkingSyllabusTrackLevel = "Basic";

  for (const line of text.split(/\r?\n/)) {
    const trackMatch = line.match(TRACK_HEADER_RE);
    if (trackMatch) {
      trackLevel = trackMatch[1] as NetworkingSyllabusTrackLevel;
      continue;
    }
    const rowMatch = line.match(TABLE_ROW_RE);
    if (rowMatch) {
      const topicId = rowMatch[1]!.trim();
      const linkTarget = rowMatch[2]!.trim();
      if (topicId && linkTarget) {
        map.set(topicId, {
          guideRepoPath: posix.join("courses/networking", linkTarget),
          trackLevel,
        });
      }
    }
  }

  cachedTopics = map;
  return map;
}

export function getNetworkingSyllabusTopicEntry(topicId: string): NetworkingSyllabusTopicEntry | null {
  const id = topicId.trim();
  if (!id) return null;
  const topics = loadNetworkingSyllabusTopicEntries();
  if (!topics) return null;
  return topics.get(id) ?? null;
}

export function getNetworkingSyllabusModuleGuideRepoPath(topicId: string): string | null {
  return getNetworkingSyllabusTopicEntry(topicId)?.guideRepoPath ?? null;
}
