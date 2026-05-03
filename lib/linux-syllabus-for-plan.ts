import { linuxAdvancedLibrary } from "@/lib/linux-advanced-library";
import { linuxBasicsLibrary } from "@/lib/linux-basics-library";
import { linuxIntermediateLibrary } from "@/lib/linux-intermediate-library";
import { parsePlanEntryId } from "@/lib/plan-sequence";
import type { SavedPlanSummary } from "@/lib/training-plan-summary";
import { getTrainingSourceForTopicId } from "@/lib/training-topic-source";

const TRACK_LIBS = [
  { level: "Basic" as const, lib: linuxBasicsLibrary, effort: "35–45 hours including labs" },
  { level: "Intermediate" as const, lib: linuxIntermediateLibrary, effort: "40–55 hours including labs" },
  { level: "Advanced" as const, lib: linuxAdvancedLibrary, effort: "45–60 hours including labs" },
];

/**
 * Relative repo path by naming convention. The app prefers paths from `courses/linux/syllabus.md` when
 * the topic id appears there; this function is the fallback for ids not (yet) listed in the syllabus table.
 */
export function linuxModuleGuidePath(topicId: string): string {
  if (topicId.startsWith("adv-")) return `courses/linux/advanced/${topicId}.md`;
  if (topicId.startsWith("int-")) return `courses/linux/intermediate/${topicId}.md`;
  return `courses/linux/basic/${topicId}.md`;
}

/** Major LINUX topic ids explicitly included in the plan (library majors or subtopics under them). */
export function assignedLinuxMajorTopicIds(plan: SavedPlanSummary): Set<string> {
  const s = new Set<string>();
  for (const m of plan.modules) {
    const eid = m.entryId?.trim();
    if (!eid) continue;
    const p = parsePlanEntryId(eid);
    if (!p) continue;
    const src = getTrainingSourceForTopicId(p.topicId);
    if (src?.group !== "LINUX") continue;
    s.add(p.topicId);
  }
  return s;
}

export type LinuxSyllabusTrackRow = { id: string; topic: string; guidePath: string; inPlan: boolean };

export type LinuxSyllabusTrackSection = {
  level: "Basic" | "Intermediate" | "Advanced";
  effort: string;
  modules: LinuxSyllabusTrackRow[];
};

/**
 * Syllabus slices from `courses/linux/syllabus.md` for each LINUX tier that appears in the plan.
 * Within a tier, lists the full track (like the markdown syllabus) and marks modules assigned to this plan.
 */
export function linuxSyllabusSectionsForPlan(plan: SavedPlanSummary): LinuxSyllabusTrackSection[] {
  const assigned = assignedLinuxMajorTopicIds(plan);
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
        /** Same paths as `courses/linux/syllabus.md` links; safe for client bundles (no `fs`). */
        guidePath: linuxModuleGuidePath(t.id),
        inPlan: assigned.has(t.id),
      })),
    });
  }
  return sections;
}
