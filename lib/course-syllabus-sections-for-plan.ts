import { avayaAocLibrary } from "@/lib/avaya-aoc-library";
import { avayaAocPlatformToolsAutomationLibrary } from "@/lib/avaya-aoc-platform-tools-automation-library";
import { avayaAocSolutionLifecycleLibrary } from "@/lib/avaya-aoc-solution-lifecycle-library";
import type { LinuxSyllabusTrackSection } from "@/lib/linux-syllabus-for-plan";
import { parsePlanEntryId } from "@/lib/plan-sequence";
import { postgresqlAdvancedLibrary } from "@/lib/postgresql-advanced-library";
import { postgresqlBasicsLibrary } from "@/lib/postgresql-basics-library";
import { postgresqlIntermediateLibrary } from "@/lib/postgresql-intermediate-library";
import { pythonAdvancedLibrary } from "@/lib/python-advanced-library";
import { pythonBasicsLibrary } from "@/lib/python-basics-library";
import { pythonIntermediateLibrary } from "@/lib/python-intermediate-library";
import type { SavedPlanSummary } from "@/lib/training-plan-summary";
import { getTrainingSourceForTopicId } from "@/lib/training-topic-source";
import type { LinuxTopic } from "@/lib/linux-topic";

function assignedMajorTopicIds(plan: SavedPlanSummary, trainingGroup: string): Set<string> {
  const s = new Set<string>();
  for (const m of plan.modules) {
    const eid = m.entryId?.trim();
    if (!eid) continue;
    const p = parsePlanEntryId(eid);
    if (!p) continue;
    if (getTrainingSourceForTopicId(p.topicId)?.group !== trainingGroup) continue;
    s.add(p.topicId);
  }
  return s;
}

function pythonModuleGuidePath(topicId: string): string {
  if (topicId.startsWith("pya-")) return `courses/python/advanced/${topicId}.md`;
  if (topicId.startsWith("pyi-")) return `courses/python/intermediate/${topicId}.md`;
  return `courses/python/basic/${topicId}.md`;
}

function postgresqlModuleGuidePath(topicId: string): string {
  if (topicId.startsWith("pga-")) return `courses/postgresql/advanced/${topicId}.md`;
  if (topicId.startsWith("pgi-")) return `courses/postgresql/intermediate/${topicId}.md`;
  return `courses/postgresql/basic/${topicId}.md`;
}

function avayaAocModuleGuidePath(topicId: string): string {
  return `courses/avaya-aoc/modules/${topicId}.md`;
}

function avayaSlModuleGuidePath(topicId: string): string {
  return `courses/avaya-aoc-solution-lifecycle/modules/${topicId}.md`;
}

function avayaPtaModuleGuidePath(topicId: string): string {
  return `courses/avaya-aoc-platform-tools-automation/modules/${topicId}.md`;
}

const pythonTrackLibs = [
  { level: "Basic" as const, lib: pythonBasicsLibrary, effort: "30–42 hours including labs" },
  { level: "Intermediate" as const, lib: pythonIntermediateLibrary, effort: "35–48 hours including labs" },
  { level: "Advanced" as const, lib: pythonAdvancedLibrary, effort: "40–55 hours including labs" },
];

const postgresqlTrackLibs = [
  { level: "Basic" as const, lib: postgresqlBasicsLibrary, effort: "28–40 hours including labs" },
  { level: "Intermediate" as const, lib: postgresqlIntermediateLibrary, effort: "32–46 hours including labs" },
  { level: "Advanced" as const, lib: postgresqlAdvancedLibrary, effort: "38–52 hours including labs" },
];

function sectionsFromLibs(
  plan: SavedPlanSummary,
  trainingGroup: string,
  trackLibs: { level: "Basic" | "Intermediate" | "Advanced"; lib: LinuxTopic[]; effort: string }[],
  guidePath: (id: string) => string,
): LinuxSyllabusTrackSection[] {
  const assigned = assignedMajorTopicIds(plan, trainingGroup);
  if (assigned.size === 0) return [];

  const sections: LinuxSyllabusTrackSection[] = [];
  for (const { level, lib, effort } of trackLibs) {
    const hasAny = lib.some((t) => assigned.has(t.id));
    if (!hasAny) continue;
    sections.push({
      level,
      effort,
      modules: lib.map((t) => ({
        id: t.id,
        topic: t.major,
        guidePath: guidePath(t.id),
        inPlan: assigned.has(t.id),
      })),
    });
  }
  return sections;
}

export function pythonSyllabusSectionsForPlan(plan: SavedPlanSummary): LinuxSyllabusTrackSection[] {
  return sectionsFromLibs(plan, "Python", pythonTrackLibs, pythonModuleGuidePath);
}

export function postgresqlSyllabusSectionsForPlan(plan: SavedPlanSummary): LinuxSyllabusTrackSection[] {
  return sectionsFromLibs(plan, "PostgreSQL", postgresqlTrackLibs, postgresqlModuleGuidePath);
}

export function avayaAocSyllabusSectionsForPlan(plan: SavedPlanSummary): LinuxSyllabusTrackSection[] {
  const assigned = assignedMajorTopicIds(plan, "Avaya AOC");
  if (assigned.size === 0) return [];
  return [
    {
      level: "Basic",
      effort: "24–36 hours including workshops",
      modules: avayaAocLibrary.map((t) => ({
        id: t.id,
        topic: t.major,
        guidePath: avayaAocModuleGuidePath(t.id),
        inPlan: assigned.has(t.id),
      })),
    },
  ];
}

export function avayaAocSolutionLifecycleSyllabusSectionsForPlan(plan: SavedPlanSummary): LinuxSyllabusTrackSection[] {
  const assigned = assignedMajorTopicIds(plan, "Avaya AOC Solution Lifecycle");
  if (assigned.size === 0) return [];
  return [
    {
      level: "Basic",
      effort: "24–36 hours including workshops",
      modules: avayaAocSolutionLifecycleLibrary.map((t) => ({
        id: t.id,
        topic: t.major,
        guidePath: avayaSlModuleGuidePath(t.id),
        inPlan: assigned.has(t.id),
      })),
    },
  ];
}

export function avayaAocPlatformToolsSyllabusSectionsForPlan(plan: SavedPlanSummary): LinuxSyllabusTrackSection[] {
  const assigned = assignedMajorTopicIds(plan, "Avaya AOC Platform Tools & Automation");
  if (assigned.size === 0) return [];
  return [
    {
      level: "Basic",
      effort: "24–36 hours including workshops",
      modules: avayaAocPlatformToolsAutomationLibrary.map((t) => ({
        id: t.id,
        topic: t.major,
        guidePath: avayaPtaModuleGuidePath(t.id),
        inPlan: assigned.has(t.id),
      })),
    },
  ];
}
