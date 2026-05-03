"use client";

import { avayaAocLibrary } from "@/lib/avaya-aoc-library";
import { avayaAocPlatformToolsAutomationLibrary } from "@/lib/avaya-aoc-platform-tools-automation-library";
import { avayaAocSolutionLifecycleLibrary } from "@/lib/avaya-aoc-solution-lifecycle-library";
import { linuxAdvancedLibrary } from "@/lib/linux-advanced-library";
import { linuxBasicsLibrary } from "@/lib/linux-basics-library";
import { linuxIntermediateLibrary } from "@/lib/linux-intermediate-library";
import { networkingAdvancedLibrary } from "@/lib/networking-advanced-library";
import { networkingBasicsLibrary } from "@/lib/networking-basics-library";
import { networkingIntermediateLibrary } from "@/lib/networking-intermediate-library";
import { pythonAdvancedLibrary } from "@/lib/python-advanced-library";
import { pythonBasicsLibrary } from "@/lib/python-basics-library";
import { pythonIntermediateLibrary } from "@/lib/python-intermediate-library";
import { postgresqlAdvancedLibrary } from "@/lib/postgresql-advanced-library";
import { postgresqlBasicsLibrary } from "@/lib/postgresql-basics-library";
import { postgresqlIntermediateLibrary } from "@/lib/postgresql-intermediate-library";
import { AvayaAocLibraryGroup } from "./avaya-aoc-library-group";
import { AvayaAocPlatformToolsAutomationLibraryGroup } from "./avaya-aoc-platform-tools-automation-library-group";
import { AvayaAocSolutionLifecycleLibraryGroup } from "./avaya-aoc-solution-lifecycle-library-group";
import { LinuxLibraryGroup } from "./linux-library-group";
import { NetworkingLibraryGroup } from "./networking-library-group";
import { PostgresqlLibraryGroup } from "./postgresql-library-group";
import { PythonLibraryGroup } from "./python-library-group";
import { TopicLibraryPanel } from "./topic-library-panel";

export type PlanTopicLibrariesStackProps = {
  linuxTopicIdSet: Set<string>;
  networkingTopicIdSet: Set<string>;
  pythonTopicIdSet: Set<string>;
  postgresqlTopicIdSet: Set<string>;
  avayaAocTopicIdSet: Set<string>;
  solutionLifecycleTopicIdSet: Set<string>;
  platformToolsAutomationTopicIdSet: Set<string>;
  selectedIds: Set<string>;
  onToggleTopic: (entryId: string) => void;
  onSectionBulkSelect: (topicIds: string[], include: boolean) => void;
  /** Enable per–sub-topic checkboxes in library rows. */
  allowSubtopicCheckboxes?: boolean;
};

/**
 * LINUX › Basic / Intermediate / Advanced, Networking › three tiers, Python › three tiers,
 * PostgreSQL › three tiers, and Avaya program groups — same structure as the delivery library,
 * with independent selection wiring.
 */
export function PlanTopicLibrariesStack({
  linuxTopicIdSet,
  networkingTopicIdSet,
  pythonTopicIdSet,
  postgresqlTopicIdSet,
  avayaAocTopicIdSet,
  solutionLifecycleTopicIdSet,
  platformToolsAutomationTopicIdSet,
  selectedIds,
  onToggleTopic,
  onSectionBulkSelect,
  allowSubtopicCheckboxes = false,
}: PlanTopicLibrariesStackProps) {
  return (
    <div className="flex min-h-0 flex-col gap-6">
      <LinuxLibraryGroup linuxTopicIdSet={linuxTopicIdSet} selectedIds={selectedIds}>
        <TopicLibraryPanel
          title="Basic"
          panelIdPrefix="linux-basics"
          topics={linuxBasicsLibrary}
          selectedIds={selectedIds}
          onToggleTopic={onToggleTopic}
          onSectionBulkSelect={(include) =>
            onSectionBulkSelect(
              linuxBasicsLibrary.map((t) => t.id),
              include,
            )
          }
          allowSubtopicCheckboxes={allowSubtopicCheckboxes}
        />
        <TopicLibraryPanel
          title="Intermediate"
          panelIdPrefix="linux-intermediate"
          topics={linuxIntermediateLibrary}
          selectedIds={selectedIds}
          onToggleTopic={onToggleTopic}
          onSectionBulkSelect={(include) =>
            onSectionBulkSelect(
              linuxIntermediateLibrary.map((t) => t.id),
              include,
            )
          }
          allowSubtopicCheckboxes={allowSubtopicCheckboxes}
        />
        <TopicLibraryPanel
          title="Advanced"
          panelIdPrefix="linux-advanced"
          topics={linuxAdvancedLibrary}
          selectedIds={selectedIds}
          onToggleTopic={onToggleTopic}
          onSectionBulkSelect={(include) =>
            onSectionBulkSelect(
              linuxAdvancedLibrary.map((t) => t.id),
              include,
            )
          }
          allowSubtopicCheckboxes={allowSubtopicCheckboxes}
        />
      </LinuxLibraryGroup>

      <NetworkingLibraryGroup
        networkingTopicIdSet={networkingTopicIdSet}
        selectedIds={selectedIds}
      >
        <TopicLibraryPanel
          title="Basic"
          panelIdPrefix="networking-basics"
          topics={networkingBasicsLibrary}
          selectedIds={selectedIds}
          onToggleTopic={onToggleTopic}
          onSectionBulkSelect={(include) =>
            onSectionBulkSelect(
              networkingBasicsLibrary.map((t) => t.id),
              include,
            )
          }
          allowSubtopicCheckboxes={allowSubtopicCheckboxes}
        />
        <TopicLibraryPanel
          title="Intermediate"
          panelIdPrefix="networking-intermediate"
          topics={networkingIntermediateLibrary}
          selectedIds={selectedIds}
          onToggleTopic={onToggleTopic}
          onSectionBulkSelect={(include) =>
            onSectionBulkSelect(
              networkingIntermediateLibrary.map((t) => t.id),
              include,
            )
          }
          allowSubtopicCheckboxes={allowSubtopicCheckboxes}
        />
        <TopicLibraryPanel
          title="Advanced"
          panelIdPrefix="networking-advanced"
          topics={networkingAdvancedLibrary}
          selectedIds={selectedIds}
          onToggleTopic={onToggleTopic}
          onSectionBulkSelect={(include) =>
            onSectionBulkSelect(
              networkingAdvancedLibrary.map((t) => t.id),
              include,
            )
          }
          allowSubtopicCheckboxes={allowSubtopicCheckboxes}
        />
      </NetworkingLibraryGroup>

      <PythonLibraryGroup pythonTopicIdSet={pythonTopicIdSet} selectedIds={selectedIds}>
        <TopicLibraryPanel
          title="Basic"
          panelIdPrefix="python-basics"
          topics={pythonBasicsLibrary}
          selectedIds={selectedIds}
          onToggleTopic={onToggleTopic}
          onSectionBulkSelect={(include) =>
            onSectionBulkSelect(
              pythonBasicsLibrary.map((t) => t.id),
              include,
            )
          }
          allowSubtopicCheckboxes={allowSubtopicCheckboxes}
        />
        <TopicLibraryPanel
          title="Intermediate"
          panelIdPrefix="python-intermediate"
          topics={pythonIntermediateLibrary}
          selectedIds={selectedIds}
          onToggleTopic={onToggleTopic}
          onSectionBulkSelect={(include) =>
            onSectionBulkSelect(
              pythonIntermediateLibrary.map((t) => t.id),
              include,
            )
          }
          allowSubtopicCheckboxes={allowSubtopicCheckboxes}
        />
        <TopicLibraryPanel
          title="Advanced"
          panelIdPrefix="python-advanced"
          topics={pythonAdvancedLibrary}
          selectedIds={selectedIds}
          onToggleTopic={onToggleTopic}
          onSectionBulkSelect={(include) =>
            onSectionBulkSelect(
              pythonAdvancedLibrary.map((t) => t.id),
              include,
            )
          }
          allowSubtopicCheckboxes={allowSubtopicCheckboxes}
        />
      </PythonLibraryGroup>

      <PostgresqlLibraryGroup postgresqlTopicIdSet={postgresqlTopicIdSet} selectedIds={selectedIds}>
        <TopicLibraryPanel
          title="Basic"
          panelIdPrefix="postgresql-basics"
          topics={postgresqlBasicsLibrary}
          selectedIds={selectedIds}
          onToggleTopic={onToggleTopic}
          onSectionBulkSelect={(include) =>
            onSectionBulkSelect(
              postgresqlBasicsLibrary.map((t) => t.id),
              include,
            )
          }
          allowSubtopicCheckboxes={allowSubtopicCheckboxes}
        />
        <TopicLibraryPanel
          title="Intermediate"
          panelIdPrefix="postgresql-intermediate"
          topics={postgresqlIntermediateLibrary}
          selectedIds={selectedIds}
          onToggleTopic={onToggleTopic}
          onSectionBulkSelect={(include) =>
            onSectionBulkSelect(
              postgresqlIntermediateLibrary.map((t) => t.id),
              include,
            )
          }
          allowSubtopicCheckboxes={allowSubtopicCheckboxes}
        />
        <TopicLibraryPanel
          title="Advanced"
          panelIdPrefix="postgresql-advanced"
          topics={postgresqlAdvancedLibrary}
          selectedIds={selectedIds}
          onToggleTopic={onToggleTopic}
          onSectionBulkSelect={(include) =>
            onSectionBulkSelect(
              postgresqlAdvancedLibrary.map((t) => t.id),
              include,
            )
          }
          allowSubtopicCheckboxes={allowSubtopicCheckboxes}
        />
      </PostgresqlLibraryGroup>

      <AvayaAocLibraryGroup avayaAocTopicIdSet={avayaAocTopicIdSet} selectedIds={selectedIds}>
        <TopicLibraryPanel
          title="Training modules"
          panelIdPrefix="avaya-aoc"
          topics={avayaAocLibrary}
          selectedIds={selectedIds}
          onToggleTopic={onToggleTopic}
          onSectionBulkSelect={(include) =>
            onSectionBulkSelect(
              avayaAocLibrary.map((t) => t.id),
              include,
            )
          }
          allowSubtopicCheckboxes={allowSubtopicCheckboxes}
        />
      </AvayaAocLibraryGroup>

      <AvayaAocSolutionLifecycleLibraryGroup
        solutionLifecycleTopicIdSet={solutionLifecycleTopicIdSet}
        selectedIds={selectedIds}
      >
        <TopicLibraryPanel
          title="Lifecycle modules"
          panelIdPrefix="avaya-aoc-solution-lifecycle"
          topics={avayaAocSolutionLifecycleLibrary}
          selectedIds={selectedIds}
          onToggleTopic={onToggleTopic}
          onSectionBulkSelect={(include) =>
            onSectionBulkSelect(
              avayaAocSolutionLifecycleLibrary.map((t) => t.id),
              include,
            )
          }
          allowSubtopicCheckboxes={allowSubtopicCheckboxes}
        />
      </AvayaAocSolutionLifecycleLibraryGroup>

      <AvayaAocPlatformToolsAutomationLibraryGroup
        platformToolsAutomationTopicIdSet={platformToolsAutomationTopicIdSet}
        selectedIds={selectedIds}
      >
        <TopicLibraryPanel
          title="Tools & automation modules"
          panelIdPrefix="avaya-aoc-platform-tools-automation"
          topics={avayaAocPlatformToolsAutomationLibrary}
          selectedIds={selectedIds}
          onToggleTopic={onToggleTopic}
          onSectionBulkSelect={(include) =>
            onSectionBulkSelect(
              avayaAocPlatformToolsAutomationLibrary.map((t) => t.id),
              include,
            )
          }
          allowSubtopicCheckboxes={allowSubtopicCheckboxes}
        />
      </AvayaAocPlatformToolsAutomationLibraryGroup>
    </div>
  );
}
