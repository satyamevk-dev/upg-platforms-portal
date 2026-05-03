/**
 * Shared visual tokens for Trainee / Trainer (and Dashboard) portal pages.
 * Elevated surfaces, teal-tinted hero bands, consistent with the plan detail page.
 */

export const PORTAL_SURFACE =
  "rounded-3xl border border-[#d8d0c4] bg-white shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.03]";

/** Standard padded section card */
export const PORTAL_CARD = `${PORTAL_SURFACE} p-6 backdrop-blur-sm sm:p-8`;

/** Intro / page header wrapper (use with {@link PORTAL_INTRO_HERO}) */
export const PORTAL_INTRO_SHELL = `overflow-hidden ${PORTAL_SURFACE}`;

export const PORTAL_INTRO_HERO =
  "relative bg-gradient-to-br from-[#00A89E]/[0.09] via-white to-[#faf8f4] px-6 py-8 sm:px-10 sm:py-10";

/** Muted inner panel (tables, nested blocks) */
export const PORTAL_INSET =
  "rounded-2xl border border-[#d8d0c4]/90 bg-[#faf9f7]/80 shadow-sm";

/** Trainer plan builder: collapsible library group shell (inactive) */
export const PORTAL_NESTED_INACTIVE =
  "rounded-3xl border border-[#d8d0c4] bg-[#faf9f7]/55 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.1)] ring-1 ring-black/[0.03]";

/** Trainer plan builder: library group when the section has selections */
export const PORTAL_NESTED_ACTIVE =
  "rounded-3xl border border-[#00A89E] bg-white shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)] ring-2 ring-[#00A89E]/20";

/** `<details>` / muted admin subsection */
export const PORTAL_DISCLOSURE =
  "rounded-2xl border border-[#d8d0c4] bg-[#faf9f7]/60 shadow-sm ring-1 ring-black/[0.03]";

/** Scrollable data table frame (compose with `mt-4` when needed) */
export const PORTAL_TABLE_FRAME =
  "overflow-x-auto rounded-xl border border-[#d8d0c4] bg-white/80 shadow-sm ring-1 ring-black/[0.03]";

export const PORTAL_TABLE_HEAD_ROW = "border-b border-[#d8d0c4] bg-[#faf9f7]";

/** In-app confirmation / form modal (warm surface) */
export const PORTAL_MODAL_SHEET =
  "max-h-[min(90vh,36rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-[#d8d0c4] bg-[#faf9f7] p-6 shadow-2xl ring-1 ring-black/[0.03]";
