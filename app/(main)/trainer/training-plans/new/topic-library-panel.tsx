"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LinuxTopic } from "@/lib/linux-topic";
import { planEntryBelongsToSectionTopic, subtopicPlanId } from "@/lib/plan-sequence";
import { PORTAL_CARD } from "@/lib/portal-ui-classes";

export type TopicLibraryPanelProps = {
  title: string;
  panelIdPrefix: string;
  topics: LinuxTopic[];
  selectedIds: Set<string>;
  onToggleTopic: (topicId: string) => void;
  /** `true` = add all section topics to the plan (in list order); `false` = remove all from this section. */
  onSectionBulkSelect: (include: boolean) => void;
  /** When true, each sub-topic row gets a checkbox (entry id `st:topicId:index`). */
  allowSubtopicCheckboxes?: boolean;
};

function TopicRow({
  topic,
  selectedIds,
  onToggleTopic,
  allowSubtopicCheckboxes,
}: {
  topic: LinuxTopic;
  selectedIds: Set<string>;
  onToggleTopic: (entryId: string) => void;
  allowSubtopicCheckboxes: boolean;
}) {
  const majorInputRef = useRef<HTMLInputElement>(null);
  const hasMajor = selectedIds.has(topic.id);
  const hasAnySubtopic =
    allowSubtopicCheckboxes &&
    topic.minors.some((_, i) => selectedIds.has(subtopicPlanId(topic.id, i)));
  const majorIndeterminate = allowSubtopicCheckboxes && !hasMajor && hasAnySubtopic;

  useEffect(() => {
    const el = majorInputRef.current;
    if (!el) return;
    el.indeterminate = majorIndeterminate;
  }, [majorIndeterminate]);

  const majorChecked = hasMajor;

  return (
    <li
      className={`overflow-hidden rounded-xl border text-sm shadow-sm transition-colors ${
        majorChecked || hasAnySubtopic
          ? "border-[#F46036] bg-[#e8f7f5] ring-2 ring-[#F46036]/35 ring-offset-1 ring-offset-[#F7F7FF]"
          : "border-[#D0D3E7] bg-[#F7F7FF]"
      }`}
    >
      <div className="flex items-stretch">
        <label
          className="flex shrink-0 cursor-pointer items-center border-r border-[#D0D3E7] px-2.5 py-3 sm:px-3.5"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <input
            ref={majorInputRef}
            type="checkbox"
            className="h-4 w-4 rounded border-[#D0D3E7] text-[#F46036] focus:ring-[#F46036]"
            checked={majorChecked}
            onChange={() => onToggleTopic(topic.id)}
            aria-label={`Include ${topic.major} in plan`}
          />
        </label>
        <details className="group min-w-0 flex-1">
          <summary className="flex cursor-pointer list-none items-center gap-2.5 px-3 py-3 pr-2 marker:content-none [&::-webkit-details-marker]:hidden">
            <span
              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[#D0D3E7] bg-white text-[10px] font-bold leading-none text-[#F46036] transition-transform duration-200 group-open:rotate-90"
              aria-hidden
            >
              ▸
            </span>
            <span className="font-semibold leading-snug text-slate-900">{topic.major}</span>
          </summary>
          <ul className="space-y-1.5 border-t border-[#D0D3E7] bg-white/60 px-3 py-2.5 pl-4 text-xs leading-relaxed text-slate-600">
            {topic.minors.map((minor, minorIndex) => {
              const subId = subtopicPlanId(topic.id, minorIndex);
              const subChecked = selectedIds.has(subId);
              return (
                <li
                  key={`${topic.id}-${minorIndex}`}
                  className={`relative flex items-start gap-2 border-l-2 pl-3 ${
                    subChecked ? "border-[#F46036] bg-[#ECFBFA]/90" : "border-[#F46036]/35"
                  }`}
                >
                  {allowSubtopicCheckboxes ? (
                    <label className="flex cursor-pointer items-start gap-2 pt-0.5">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-[#D0D3E7] text-[#F46036] focus:ring-[#F46036]"
                        checked={subChecked}
                        onChange={() => onToggleTopic(subId)}
                        aria-label={`Include sub-topic: ${minor}`}
                      />
                      <span>{minor}</span>
                    </label>
                  ) : (
                    <span className="pl-0">{minor}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </details>
      </div>
    </li>
  );
}

export function TopicLibraryPanel({
  title,
  panelIdPrefix,
  topics,
  selectedIds,
  onToggleTopic,
  onSectionBulkSelect,
  allowSubtopicCheckboxes = false,
}: TopicLibraryPanelProps) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const sectionCheckboxRef = useRef<HTMLInputElement>(null);

  const listId = `${panelIdPrefix}-library-list`;
  const toggleId = `${panelIdPrefix}-library-toggle`;

  const sectionTopicIds = useMemo(() => new Set(topics.map((t) => t.id)), [topics]);

  const { allSelected, someSelected } = useMemo(() => {
    if (topics.length === 0) {
      return { allSelected: false, someSelected: false };
    }
    let majorInPlan = 0;
    for (const t of topics) {
      if (selectedIds.has(t.id)) majorInPlan += 1;
    }
    const allMajorsInPlan = majorInPlan === topics.length;
    let anyInSection = majorInPlan > 0;
    if (!anyInSection) {
      for (const id of selectedIds) {
        if (planEntryBelongsToSectionTopic(id, sectionTopicIds)) {
          anyInSection = true;
          break;
        }
      }
    }
    return {
      allSelected: allMajorsInPlan,
      someSelected: anyInSection,
    };
  }, [topics, selectedIds, sectionTopicIds]);

  useEffect(() => {
    const el = sectionCheckboxRef.current;
    if (!el) return;
    el.indeterminate = someSelected && !allSelected;
  }, [someSelected, allSelected]);

  const isListVisible = libraryOpen;

  const sectionActiveClass = someSelected ? "border-[#F46036] ring-2 ring-[#F46036]/25" : "";

  return (
    <div
      className={`${PORTAL_CARD} ${sectionActiveClass} flex min-h-0 flex-col lg:max-h-[min(42rem,calc(100vh-8rem))]`}
    >
      <div className="flex w-full items-start gap-3">
        <label
          className={`mt-1 flex shrink-0 cursor-pointer items-start pt-0.5 ${
            topics.length === 0 ? "pointer-events-none opacity-40" : ""
          }`}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <input
            ref={sectionCheckboxRef}
            type="checkbox"
            className="h-4 w-4 rounded border-[#D0D3E7] text-[#F46036] focus:ring-[#F46036]"
            checked={allSelected && topics.length > 0}
            disabled={topics.length === 0}
            onChange={(e) => onSectionBulkSelect(e.target.checked)}
            aria-label={`Select all modules in ${title}`}
          />
        </label>
        <button
          type="button"
          className="flex min-w-0 flex-1 items-start justify-between gap-3 rounded-xl text-left outline-none ring-[#F46036] focus-visible:ring-2 focus-visible:ring-offset-2"
          onClick={() => setLibraryOpen((open) => !open)}
          aria-expanded={isListVisible}
          aria-controls={listId}
          id={toggleId}
        >
          <div className="min-w-0 pr-1">
            <div className="flex flex-wrap items-baseline gap-2 gap-y-1">
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
              <span className="rounded-md bg-slate-100/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                Optional
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {isListVisible
                ? allowSubtopicCheckboxes
                  ? "Section checkbox selects all whole modules. Each row toggles the full module; open a row to tick individual sub-topics."
                  : "Use the section checkbox for all major modules in this list, or each row checkbox for one whole topic. Sub-topics describe what that row covers."
                : "Expand to browse topics and use checkboxes. The section highlights when anything here is included in the plan."}
            </p>
          </div>
          <span
            className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D0D3E7] bg-[#F7F7FF] text-sm font-bold text-[#F46036] transition-transform duration-200 ${
              isListVisible ? "rotate-90" : ""
            }`}
            aria-hidden
          >
            ▸
          </span>
        </button>
      </div>

      {isListVisible ? (
        <ul
          id={listId}
          role="region"
          aria-labelledby={toggleId}
          className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1"
        >
          {topics.map((topic) => (
            <TopicRow
              key={topic.id}
              topic={topic}
              selectedIds={selectedIds}
              onToggleTopic={onToggleTopic}
              allowSubtopicCheckboxes={allowSubtopicCheckboxes}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}
