"use client";

import type { ReactNode } from "react";
import { PORTAL_DISCLOSURE } from "@/lib/portal-ui-classes";

type Props = {
  /** One-line summary row (title, badges, key metadata). Click to expand. */
  summary: ReactNode;
  /** Full plan body shown when expanded (description, modules, etc.). */
  children: ReactNode;
};

/**
 * Collapsed-by-default plan row using native `<details>` (no client JS).
 * Keeps long module lists out of the way until the user expands.
 */
export function SavedPlanCollapsible({ summary, children }: Props) {
  return (
    <details
      className={`${PORTAL_DISCLOSURE} overflow-hidden [&_summary::-webkit-details-marker]:hidden`}
    >
      <summary className="cursor-pointer select-none list-none px-4 py-3 sm:px-5 sm:py-4">
        {summary}
      </summary>
      <div className="border-t border-[#d8d0c4]/50 bg-white/70 px-4 pb-4 pt-3 sm:px-5 sm:pb-5">{children}</div>
    </details>
  );
}
