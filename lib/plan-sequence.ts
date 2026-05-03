/** Prefix for plan entries that are a single sub-topic (minor) within a major topic. */
const SUBTOPIC_PREFIX = "st:";

export function subtopicPlanId(topicId: string, minorIndex: number): string {
  return `${SUBTOPIC_PREFIX}${topicId}:${minorIndex}`;
}

export type ParsedPlanEntry =
  | { kind: "major"; topicId: string }
  | { kind: "subtopic"; topicId: string; minorIndex: number };

export function parsePlanEntryId(id: string): ParsedPlanEntry | null {
  if (id.startsWith(SUBTOPIC_PREFIX)) {
    const rest = id.slice(SUBTOPIC_PREFIX.length);
    const lastColon = rest.lastIndexOf(":");
    if (lastColon <= 0) return null;
    const topicId = rest.slice(0, lastColon);
    const idx = Number(rest.slice(lastColon + 1));
    if (!Number.isInteger(idx) || idx < 0) return null;
    return { kind: "subtopic", topicId, minorIndex: idx };
  }
  if (id.length === 0) return null;
  return { kind: "major", topicId: id };
}

/** True if this plan entry belongs to a library section that owns `topicId` (major or subtopic under it). */
export function planEntryBelongsToSectionTopic(
  planEntryId: string,
  sectionTopicIds: Set<string>
): boolean {
  const p = parsePlanEntryId(planEntryId);
  if (!p) return false;
  return sectionTopicIds.has(p.topicId);
}
