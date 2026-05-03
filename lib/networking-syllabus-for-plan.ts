import { networkingAdvancedLibrary } from "@/lib/networking-advanced-library";
import { networkingBasicsLibrary } from "@/lib/networking-basics-library";
import { networkingIntermediateLibrary } from "@/lib/networking-intermediate-library";
import type { LinuxSyllabusTrackSection } from "@/lib/linux-syllabus-for-plan";
import { parsePlanEntryId } from "@/lib/plan-sequence";
import type { SavedPlanSummary } from "@/lib/training-plan-summary";
import { getTrainingSourceForTopicId } from "@/lib/training-topic-source";

const TRACK_LIBS = [
  { level: "Basic" as const, lib: networkingBasicsLibrary, effort: "30–40 hours including labs" },
  { level: "Intermediate" as const, lib: networkingIntermediateLibrary, effort: "35–50 hours including labs" },
  { level: "Advanced" as const, lib: networkingAdvancedLibrary, effort: "40–55 hours including labs" },
];

export function networkingModuleGuidePath(topicId: string): string {
  if (topicId.startsWith("neta-")) return `courses/networking/advanced/${topicId}.md`;
  if (topicId.startsWith("neti-")) return `courses/networking/intermediate/${topicId}.md`;
  return `courses/networking/basic/${topicId}.md`;
}

export function assignedNetworkingMajorTopicIds(plan: SavedPlanSummary): Set<string> {
  const s = new Set<string>();
  for (const m of plan.modules) {
    const eid = m.entryId?.trim();
    if (!eid) continue;
    const p = parsePlanEntryId(eid);
    if (!p) continue;
    if (getTrainingSourceForTopicId(p.topicId)?.group !== "Networking") continue;
    s.add(p.topicId);
  }
  return s;
}

/** Syllabus slices for each Networking tier that appears in the plan (same shape as Linux for UI reuse). */
export function networkingSyllabusSectionsForPlan(plan: SavedPlanSummary): LinuxSyllabusTrackSection[] {
  const assigned = assignedNetworkingMajorTopicIds(plan);
  if (assigned.size === 0) return [];

  const sections: LinuxSyllabusTrackSection[] = [];
  for (const { level, lib, effort } of TRACK_LIBS) {
    const hasAny = lib.some((t) => assigned.has(t.id));
    if (!hasAny) continue;
    sections.push({
      level,
      effort,
      modules: lib.map((t) => ({
        id: t.id,
        topic: t.major,
        guidePath: networkingModuleGuidePath(t.id),
        inPlan: assigned.has(t.id),
      })),
    });
  }
  return sections;
}
