import type { LinuxTopic } from "@/lib/linux-topic";
import { avayaAocLibrary } from "@/lib/avaya-aoc-library";
import { avayaAocPlatformToolsAutomationLibrary } from "@/lib/avaya-aoc-platform-tools-automation-library";
import { avayaAocSolutionLifecycleLibrary } from "@/lib/avaya-aoc-solution-lifecycle-library";
import { linuxAdvancedLibrary } from "@/lib/linux-advanced-library";
import { linuxBasicsLibrary } from "@/lib/linux-basics-library";
import { linuxIntermediateLibrary } from "@/lib/linux-intermediate-library";
import { networkingAdvancedLibrary } from "@/lib/networking-advanced-library";
import { networkingBasicsLibrary } from "@/lib/networking-basics-library";
import { networkingIntermediateLibrary } from "@/lib/networking-intermediate-library";
import { postgresqlAdvancedLibrary } from "@/lib/postgresql-advanced-library";
import { postgresqlBasicsLibrary } from "@/lib/postgresql-basics-library";
import { postgresqlIntermediateLibrary } from "@/lib/postgresql-intermediate-library";
import { pythonAdvancedLibrary } from "@/lib/python-advanced-library";
import { pythonBasicsLibrary } from "@/lib/python-basics-library";
import { pythonIntermediateLibrary } from "@/lib/python-intermediate-library";

const ALL: LinuxTopic[] = [
  ...linuxBasicsLibrary,
  ...linuxIntermediateLibrary,
  ...linuxAdvancedLibrary,
  ...networkingBasicsLibrary,
  ...networkingIntermediateLibrary,
  ...networkingAdvancedLibrary,
  ...pythonBasicsLibrary,
  ...pythonIntermediateLibrary,
  ...pythonAdvancedLibrary,
  ...postgresqlBasicsLibrary,
  ...postgresqlIntermediateLibrary,
  ...postgresqlAdvancedLibrary,
  ...avayaAocLibrary,
  ...avayaAocSolutionLifecycleLibrary,
  ...avayaAocPlatformToolsAutomationLibrary,
];

const byId = new Map<string, LinuxTopic>(ALL.map((t) => [t.id, t]));

export function getTrainingTopicById(topicId: string): LinuxTopic | undefined {
  return byId.get(topicId);
}
