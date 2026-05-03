import { SYLLABUS_COHORT_TRAINING_GROUPS } from "@/lib/course-catalog-syllabus";
import { parsePlanEntryId } from "@/lib/plan-sequence";
import type { SavedPlanModule } from "@/lib/training-plan-summary";
import { getTrainingSourceForTopicId } from "@/lib/training-topic-source";

/** Topic groups that share one end-of-topic quiz backed by syllabus-linked module guides. */
const SYLLABUS_COHORT_GROUPS = new Set<string>(SYLLABUS_COHORT_TRAINING_GROUPS);

/**
 * Syllabus topic id for any syllabus-cohort track (Linux, Networking, Python, PostgreSQL, Avaya) and
 * `st:topicId:n` rows; otherwise null.
 */
export function linuxSyllabusTopicIdForPlanModule(entryId: string | null | undefined): string | null {
  const eid = entryId?.trim();
  if (!eid) return null;
  const p = parsePlanEntryId(eid);
  if (!p) return null;
  const g = getTrainingSourceForTopicId(p.topicId)?.group;
  if (!g || !SYLLABUS_COHORT_GROUPS.has(g)) return null;
  return p.topicId;
}

/** For each syllabus `topicId`, the plan `order` used as the primary study/quiz entry (lowest order wins). */
export function linuxSyllabusPrimaryOrderByTopic(
  modules: Pick<SavedPlanModule, "order" | "entryId">[],
): Map<string, number> {
  const map = new Map<string, number>();
  for (const m of modules) {
    const tid = linuxSyllabusTopicIdForPlanModule(m.entryId);
    if (!tid) continue;
    const cur = map.get(tid);
    if (cur === undefined || m.order < cur) map.set(tid, m.order);
  }
  return map;
}

/** Lowest plan `order` for a syllabus-backed topic on this plan, or null if the topic is not assigned. */
export function firstPlanOrderForLinuxTopicId(plan: { modules: SavedPlanModule[] }, topicId: string): number | null {
  let best: number | null = null;
  for (const m of plan.modules) {
    if (linuxSyllabusTopicIdForPlanModule(m.entryId) === topicId) {
      if (best === null || m.order < best) best = m.order;
    }
  }
  return best;
}
