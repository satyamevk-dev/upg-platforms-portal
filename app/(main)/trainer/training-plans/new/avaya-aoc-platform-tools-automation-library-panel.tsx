"use client";

import type { LinuxTopic } from "@/lib/linux-topic";
import { TopicLibraryPanel } from "./topic-library-panel";

type Props = {
  topics: LinuxTopic[];
  selectedIds: Set<string>;
  onToggleTopic: (topicId: string) => void;
  onSectionBulkSelect: (include: boolean) => void;
};

export function AvayaAocPlatformToolsAutomationLibraryPanel({
  topics,
  selectedIds,
  onToggleTopic,
  onSectionBulkSelect,
}: Props) {
  return (
    <TopicLibraryPanel
      title="Tools & automation modules"
      panelIdPrefix="avaya-aoc-platform-tools-automation"
      topics={topics}
      selectedIds={selectedIds}
      onToggleTopic={onToggleTopic}
      onSectionBulkSelect={onSectionBulkSelect}
    />
  );
}
