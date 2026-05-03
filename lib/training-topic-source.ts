import { avayaAocLibrary } from "./avaya-aoc-library";
import { avayaAocPlatformToolsAutomationLibrary } from "./avaya-aoc-platform-tools-automation-library";
import { avayaAocSolutionLifecycleLibrary } from "./avaya-aoc-solution-lifecycle-library";
import type { LinuxTopic } from "./linux-topic";
import { linuxAdvancedLibrary } from "./linux-advanced-library";
import { linuxBasicsLibrary } from "./linux-basics-library";
import { linuxIntermediateLibrary } from "./linux-intermediate-library";
import { networkingAdvancedLibrary } from "./networking-advanced-library";
import { networkingBasicsLibrary } from "./networking-basics-library";
import { networkingIntermediateLibrary } from "./networking-intermediate-library";
import { postgresqlAdvancedLibrary } from "./postgresql-advanced-library";
import { postgresqlBasicsLibrary } from "./postgresql-basics-library";
import { postgresqlIntermediateLibrary } from "./postgresql-intermediate-library";
import { pythonAdvancedLibrary } from "./python-advanced-library";
import { pythonBasicsLibrary } from "./python-basics-library";
import { pythonIntermediateLibrary } from "./python-intermediate-library";

export type TrainingSourceLabels = {
  /** Top collapsible group / program name shown in the builder sidebar. */
  group: string;
  /** Tier for multi-level tracks (LINUX, Networking, Python, PostgreSQL: Basic, Intermediate, Advanced). */
  level?: string;
};

function registerTopics(
  map: Map<string, TrainingSourceLabels>,
  topics: LinuxTopic[],
  group: string,
  level?: string
) {
  for (const t of topics) {
    map.set(t.id, level ? { group, level } : { group });
  }
}

function buildTopicIdToSource(): Map<string, TrainingSourceLabels> {
  const m = new Map<string, TrainingSourceLabels>();
  registerTopics(m, linuxBasicsLibrary, "LINUX", "Basic");
  registerTopics(m, linuxIntermediateLibrary, "LINUX", "Intermediate");
  registerTopics(m, linuxAdvancedLibrary, "LINUX", "Advanced");
  registerTopics(m, networkingBasicsLibrary, "Networking", "Basic");
  registerTopics(m, networkingIntermediateLibrary, "Networking", "Intermediate");
  registerTopics(m, networkingAdvancedLibrary, "Networking", "Advanced");
  registerTopics(m, pythonBasicsLibrary, "Python", "Basic");
  registerTopics(m, pythonIntermediateLibrary, "Python", "Intermediate");
  registerTopics(m, pythonAdvancedLibrary, "Python", "Advanced");
  registerTopics(m, postgresqlBasicsLibrary, "PostgreSQL", "Basic");
  registerTopics(m, postgresqlIntermediateLibrary, "PostgreSQL", "Intermediate");
  registerTopics(m, postgresqlAdvancedLibrary, "PostgreSQL", "Advanced");
  registerTopics(m, avayaAocLibrary, "Avaya AOC");
  registerTopics(m, avayaAocSolutionLifecycleLibrary, "Avaya AOC Solution Lifecycle");
  registerTopics(m, avayaAocPlatformToolsAutomationLibrary, "Avaya AOC Platform Tools & Automation");
  return m;
}

const topicIdToSource = buildTopicIdToSource();

export function getTrainingSourceForTopicId(topicId: string): TrainingSourceLabels | undefined {
  return topicIdToSource.get(topicId);
}

/** Single line for Plan sequence (e.g. `LINUX › Basic` or `Avaya AOC`). */
export function formatTrainingSourceHeader(labels: TrainingSourceLabels): string {
  return labels.level ? `${labels.group} › ${labels.level}` : labels.group;
}
