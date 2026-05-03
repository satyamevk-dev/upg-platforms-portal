"use client";

import type { LinuxTopic } from "@/lib/linux-topic";
import { TopicLibraryPanel } from "./topic-library-panel";

type Props = {
  topics: LinuxTopic[];
  selectedIds: Set<string>;
  onToggleTopic: (topicId: string) => void;
  onSectionBulkSelect: (include: boolean) => void;
};

export function NetworkingIntermediateLibraryPanel({
  topics,
  selectedIds,
  onToggleTopic,
  onSectionBulkSelect,
}: Props) {
  return (
    <TopicLibraryPanel
      title="Intermediate"
      panelIdPrefix="networking-intermediate"
      topics={topics}
      selectedIds={selectedIds}
      onToggleTopic={onToggleTopic}
      onSectionBulkSelect={onSectionBulkSelect}
    />
  );
}
