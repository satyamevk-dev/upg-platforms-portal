"use client";

import { useMemo, useState, type ReactNode } from "react";
import { planEntryBelongsToSectionTopic } from "@/lib/plan-sequence";
import { PORTAL_NESTED_ACTIVE, PORTAL_NESTED_INACTIVE } from "@/lib/portal-ui-classes";

type Props = {
  postgresqlTopicIdSet: Set<string>;
  selectedIds: Set<string>;
  children: ReactNode;
};

export function PostgresqlLibraryGroup({ postgresqlTopicIdSet, selectedIds, children }: Props) {
  const [open, setOpen] = useState(false);

  const hasPostgresqlInPlan = useMemo(() => {
    for (const id of selectedIds) {
      if (planEntryBelongsToSectionTopic(id, postgresqlTopicIdSet)) return true;
    }
    return false;
  }, [selectedIds, postgresqlTopicIdSet]);

  const shellClass = hasPostgresqlInPlan ? PORTAL_NESTED_ACTIVE : PORTAL_NESTED_INACTIVE;

  return (
    <div className={`${shellClass} flex min-h-0 flex-col`}>
      <button
        type="button"
        className="flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left outline-none ring-[#F46036] transition hover:bg-black/[0.02] focus-visible:ring-2 focus-visible:ring-offset-2 sm:px-5 sm:py-4"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-wide text-slate-900">
            Relational DB basics · PostgreSQL
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Basic, Intermediate, and Advanced — expand to open each level.
          </p>
        </div>
        <span
          className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D0D3E7] bg-white text-sm font-bold text-[#F46036] transition-transform duration-200 ${
            open ? "rotate-90" : ""
          }`}
          aria-hidden
        >
          ▸
        </span>
      </button>
      {open ? (
        <div className="flex min-h-0 flex-col gap-6 border-t border-[#D0D3E7] px-3 py-4 sm:px-4 sm:py-5">
          {children}
        </div>
      ) : null}
    </div>
  );
}
