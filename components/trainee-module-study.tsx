"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ModuleLearningMarkdown } from "@/components/module-learning-markdown";
import type { TraineeModuleAccess } from "@/lib/trainee-module-page-data";
import { parseJsonResponse } from "@/lib/parse-json-response";
import { PORTAL_CARD, PORTAL_SURFACE } from "@/lib/portal-ui-classes";

const planOverviewHref = (planId: string) => `/client/plans/${encodeURIComponent(planId)}`;

type Props = {
  planId: string;
  moduleOrder: number;
  moduleTitle: string;
  learningMarkdown: string;
  access: TraineeModuleAccess;
  studyMarked: boolean;
  quizDone: boolean;
  quizHref: string | null;
  syllabusCohortTopicId: string | null;
};

export function TraineeModuleStudy({
  planId,
  moduleOrder,
  moduleTitle,
  learningMarkdown,
  access,
  studyMarked,
  quizDone,
  quizHref,
  syllabusCohortTopicId,
}: Props) {
  const router = useRouter();
  const [marked, setMarked] = useState(studyMarked);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [confirmStudyOpen, setConfirmStudyOpen] = useState(false);

  async function confirmMarkStudyComplete() {
    setError(null);
    setPending(true);
    try {
      const res = await fetch(
        `/api/trainee/plans/${encodeURIComponent(planId)}/modules/${encodeURIComponent(String(moduleOrder))}/study-complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
          credentials: "same-origin",
        },
      );
      const data = await parseJsonResponse<{ ok?: boolean; error?: string }>(res);
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Could not update study progress");
      }
      if (data.ok === true) {
        setConfirmStudyOpen(false);
        setMarked(true);
        router.push(`/client/plans/${encodeURIComponent(planId)}`);
        return;
      }
      throw new Error("Unexpected response");
    } catch (e) {
      setConfirmStudyOpen(false);
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  if (access === "start_plan_first") {
    return (
      <div className={PORTAL_CARD}>
        <h1 className="text-xl font-bold text-slate-900">{moduleTitle}</h1>
        <p className="mt-3 text-sm text-slate-600">
          Start this plan from the overview before opening module study.
        </p>
        <Link href={planOverviewHref(planId)} className="mt-6 inline-flex rounded-xl bg-[#F46036] px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#d44a20]">
          Go to plan overview
        </Link>
      </div>
    );
  }

  if (access === "completed_review") {
    return (
      <div className="space-y-8">
        <header className={PORTAL_CARD}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F46036]">Module review</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{moduleTitle}</h1>
            </div>
            <span className="inline-flex shrink-0 items-center rounded-full border border-[#BFEFED] bg-[#ECFBFA] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#b23d1e]">
              Module {moduleOrder}
            </span>
          </div>
        </header>
        <div className="rounded-xl border border-[#BFEFED] bg-[#ECFBFA] px-4 py-3 text-sm leading-relaxed text-slate-800">
          You have passed the quiz for this module{syllabusCohortTopicId ? " (or topic group)" : ""}. Review the material below
          anytime.
        </div>
        <section className={`overflow-hidden ${PORTAL_SURFACE}`}>
          <div className="border-b border-[#D0D3E7] bg-[#F7F7FF]/80 px-6 py-4 sm:px-8">
            <h2 className="text-sm font-semibold text-slate-800">Study material</h2>
          </div>
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <ModuleLearningMarkdown markdown={learningMarkdown} />
          </div>
        </section>
        <Link href={planOverviewHref(planId)} className="inline-flex rounded-xl border border-[#D0D3E7] bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-[#F7F7FF]">
          Back to plan
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className={PORTAL_CARD}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F46036]">Module study</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{moduleTitle}</h1>
          </div>
          <span className="inline-flex shrink-0 items-center rounded-full border border-[#BFEFED] bg-[#ECFBFA] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#b23d1e]">
            Module {moduleOrder}
          </span>
        </div>
      </header>

      {!quizDone && syllabusCohortTopicId ? (
        <div className="rounded-xl border border-[#D0D3E7] bg-[#F7F7FF] px-4 py-3 text-sm leading-relaxed text-slate-700">
          This topic shares one syllabus file with other steps on your plan. Mark study complete on{" "}
          <strong className="text-slate-900">each</strong> of those steps, then take the{" "}
          <strong className="text-slate-900">single topic quiz</strong> from the plan overview (or the link below when
          it appears).
        </div>
      ) : null}

      <section className={`overflow-hidden ${PORTAL_SURFACE}`}>
        <div className="border-b border-[#D0D3E7] bg-[#F7F7FF]/80 px-6 py-5 sm:px-8">
          <h2 className="text-base font-semibold text-slate-900">Read &amp; review</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            Work through the sections below. When you are done with this step, mark study complete. The quiz is on a
            separate page and {syllabusCohortTopicId ? "unlocks after every related step is marked." : "unlocks after you mark this step."}
          </p>
        </div>
        <div className="px-6 py-6 sm:px-8 sm:py-10">
          <ModuleLearningMarkdown markdown={learningMarkdown} />
        </div>
        <div className="flex flex-col gap-4 border-t border-[#D0D3E7] bg-[#F7F7FF]/60 px-6 py-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-8">
          <div className="min-w-0 space-y-2">
            {marked ? (
              <p className="text-sm font-medium text-[#177F78]">Study marked complete for this step.</p>
            ) : (
              <p className="text-sm text-slate-600">Finished reading? Confirm below.</p>
            )}
            {error ? (
              <p className="text-sm font-medium text-rose-700" role="alert">
                {error}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {!marked ? (
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  setError(null);
                  setConfirmStudyOpen(true);
                }}
                className="inline-flex shrink-0 justify-center rounded-xl bg-[#F46036] px-5 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#d44a20] disabled:opacity-60"
              >
                Mark study complete
              </button>
            ) : null}
            {quizHref ? (
              <Link
                href={quizHref}
                className="inline-flex shrink-0 justify-center rounded-xl border border-[#F46036]/40 bg-[#ECFBFA] px-5 py-3 text-sm font-semibold text-[#177F78] shadow-sm transition-colors hover:bg-[#D8F6F3]"
              >
                {syllabusCohortTopicId ? "Open topic quiz" : "Open module quiz"}
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <Link href={planOverviewHref(planId)} className="inline-flex rounded-xl border border-[#D0D3E7] bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-[#F7F7FF]">
        Back to plan
      </Link>

      {confirmStudyOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[3px]"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !pending) {
              setConfirmStudyOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-study-title"
            className={`max-w-md overflow-hidden ${PORTAL_SURFACE} shadow-2xl shadow-slate-900/20`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="border-b border-[#D0D3E7] bg-gradient-to-r from-[#ECFBFA]/90 to-white px-6 py-4">
              <h2 id="confirm-study-title" className="text-lg font-bold text-slate-900">
                Mark study complete?
              </h2>
            </div>
            <p className="px-6 py-4 text-sm leading-relaxed text-slate-600">
              This records that you have finished reviewing <span className="font-medium text-slate-800">{moduleTitle}</span>.
              You can return to this material anytime from your plan. Continue to the plan overview?
            </p>
            <div className="flex flex-wrap justify-end gap-2 border-t border-[#D0D3E7] bg-[#F7F7FF]/80 px-6 py-4">
              <button
                type="button"
                disabled={pending}
                className="rounded-xl border border-[#D0D3E7] bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-[#F7F7FF] disabled:opacity-60"
                onClick={() => setConfirmStudyOpen(false)}
              >
                No, stay here
              </button>
              <button
                type="button"
                disabled={pending}
                className="rounded-xl bg-[#F46036] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#d44a20] disabled:opacity-60"
                onClick={() => void confirmMarkStudyComplete()}
              >
                {pending ? "Saving…" : "Yes, go to plan"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
