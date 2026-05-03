"use client";

import type { LinuxTopic } from "@/lib/linux-topic";
import { TopicLibraryPanel } from "./topic-library-panel";

type Props = {
  topics: LinuxTopic[];
  selectedIds: Set<string>;
  onToggleTopic: (topicId: string) => void;
  onSectionBulkSelect: (include: boolean) => void;
};

export function LinuxAdvancedLibraryPanel({
  topics,
  selectedIds,
  onToggleTopic,
  onSectionBulkSelect,
}: Props) {
  return (
    <TopicLibraryPanel
      title="Advanced"
      panelIdPrefix="linux-advanced"
      topics={topics}
      selectedIds={selectedIds}
      onToggleTopic={onToggleTopic}
      onSectionBulkSelect={onSectionBulkSelect}
    />
  );
}
