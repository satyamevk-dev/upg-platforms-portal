"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { SavedPlanSummary } from "@/lib/training-plan-summary";
import type { TraineeProgressPayload } from "@/lib/trainee-plan-progress";
import {
  allQuizCohortStudyMarked,
  completionKeyForModule,
  isModuleStudyMarked,
} from "@/lib/trainee-plan-progress";
import { linuxSyllabusTopicIdForPlanModule } from "@/lib/linux-plan-topic-group";
import {
  avayaAocPlatformToolsSyllabusSectionsForPlan,
  avayaAocSolutionLifecycleSyllabusSectionsForPlan,
  avayaAocSyllabusSectionsForPlan,
  postgresqlSyllabusSectionsForPlan,
  pythonSyllabusSectionsForPlan,
} from "@/lib/course-syllabus-sections-for-plan";
import { linuxSyllabusSectionsForPlan } from "@/lib/linux-syllabus-for-plan";
import { networkingSyllabusSectionsForPlan } from "@/lib/networking-syllabus-for-plan";
import { parseJsonResponse } from "@/lib/parse-json-response";
import { TraineeAvayaAocPlatformToolsSyllabusSection } from "@/components/trainee-avaya-aoc-platform-tools-syllabus-section";
import { TraineeAvayaAocSolutionLifecycleSyllabusSection } from "@/components/trainee-avaya-aoc-solution-lifecycle-syllabus-section";
import { TraineeAvayaAocSyllabusSection } from "@/components/trainee-avaya-aoc-syllabus-section";
import { TraineeLinuxSyllabusSection } from "@/components/trainee-linux-syllabus-section";
import { TraineeNetworkingSyllabusSection } from "@/components/trainee-networking-syllabus-section";
import { TraineePostgresqlSyllabusSection } from "@/components/trainee-postgresql-syllabus-section";
import { TraineePythonSyllabusSection } from "@/components/trainee-python-syllabus-section";
import { traineeSyllabusTopicQuizClientPath } from "@/lib/syllabus-topic-quiz-path";
import { PORTAL_SURFACE } from "@/lib/portal-ui-classes";

type Props = {
  planId: string;
  initialPlan: SavedPlanSummary;
  initialProgress: TraineeProgressPayload;
};

function StatusPill({ status }: { status: TraineeProgressPayload["status"] }) {
  const map = {
    not_started: "bg-slate-100 text-slate-700 ring-slate-200",
    in_progress: "bg-[#ECFBFA] text-[#177F78] ring-[#F46036]/25",
    paused: "bg-amber-50 text-amber-900 ring-amber-200/80",
    completed: "bg-emerald-50 text-emerald-900 ring-emerald-200/80",
  } as const;
  const label =
    status === "not_started"
      ? "Not started"
      : status === "in_progress"
        ? "In progress"
        : status === "paused"
          ? "Paused"
          : "Completed";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ${map[status]}`}
    >
      {label}
    </span>
  );
}

function ModuleStatusBadge({
  done,
  planStatus,
}: {
  done: boolean;
  planStatus: TraineeProgressPayload["status"];
}) {
  if (done) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200/80">
        <svg className="size-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
          <path
            fillRule="evenodd"
            d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
            clipRule="evenodd"
          />
        </svg>
        Done
      </span>
    );
  }
  if (planStatus === "not_started") {
    return (
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200/80">
        Locked
      </span>
    );
  }
  if (planStatus === "paused") {
    return (
      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 ring-1 ring-amber-200/70">
        Paused
      </span>
    );
  }
  return (
    <span className="rounded-full bg-[#F46036]/10 px-2.5 py-1 text-xs font-semibold text-[#177F78] ring-1 ring-[#F46036]/20">
      Open
    </span>
  );
}

export function TraineePlanProgressPanel({ planId, initialPlan, initialProgress }: Props) {
  const [plan, setPlan] = useState(initialPlan);
  const [progress, setProgress] = useState(initialProgress);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [cancelPauseOpen, setCancelPauseOpen] = useState(false);
  const [cancelPauseStep, setCancelPauseStep] = useState<1 | 2>(1);

  const modulesSorted = useMemo(
    () =>
      [...plan.modules].sort((a, b) =>
        a.order !== b.order ? a.order - b.order : a.title.localeCompare(b.title),
      ),
    [plan.modules],
  );

  const modulesDisplay = useMemo(() => {
    const seen = new Set<number>();
    return modulesSorted.filter((m) => {
      if (seen.has(m.order)) return false;
      seen.add(m.order);
      return true;
    });
  }, [modulesSorted]);

  const linuxSyllabusSections = useMemo(() => linuxSyllabusSectionsForPlan(plan), [plan]);
  const networkingSyllabusSections = useMemo(() => networkingSyllabusSectionsForPlan(plan), [plan]);
  const pythonSyllabusSections = useMemo(() => pythonSyllabusSectionsForPlan(plan), [plan]);
  const postgresqlSyllabusSections = useMemo(() => postgresqlSyllabusSectionsForPlan(plan), [plan]);
  const avayaAocSyllabusSections = useMemo(() => avayaAocSyllabusSectionsForPlan(plan), [plan]);
  const avayaSlSyllabusSections = useMemo(() => avayaAocSolutionLifecycleSyllabusSectionsForPlan(plan), [plan]);
  const avayaPtaSyllabusSections = useMemo(() => avayaAocPlatformToolsSyllabusSectionsForPlan(plan), [plan]);

  const canOpenModules =
    progress.status === "in_progress" || progress.status === "paused" || progress.status === "completed";

  const { completedCount, totalModules, progressPercent } = useMemo(() => {
    const total = modulesDisplay.length;
    const done = modulesDisplay.filter((m) =>
      (progress.completedEntryIds ?? []).includes(completionKeyForModule(m)),
    ).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { completedCount: done, totalModules: total, progressPercent: pct };
  }, [modulesDisplay, progress.completedEntryIds]);

  async function runAction(action: string, moduleOrder?: number) {
    setError(null);
    setPending(true);
    try {
      const res = await fetch(`/api/trainee/plans/${encodeURIComponent(planId)}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          moduleOrder !== undefined ? { action, moduleOrder } : { action },
        ),
        credentials: "same-origin",
      });
      const data = await parseJsonResponse<{
        plan?: SavedPlanSummary;
        progress?: TraineeProgressPayload;
        error?: string;
      }>(res);
      if (!res.ok) {
        throw new Error(data.error ?? "Request failed");
      }
      if (data.plan && data.progress) {
        setPlan(data.plan);
        setProgress(data.progress);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  async function startPlan() {
    setError(null);
    setPending(true);
    try {
      const res = await fetch(`/api/trainee/plans/${encodeURIComponent(planId)}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
        credentials: "same-origin",
      });
      const data = await parseJsonResponse<{
        plan?: SavedPlanSummary;
        progress?: TraineeProgressPayload;
        error?: string;
      }>(res);
      if (!res.ok) {
        throw new Error(data.error ?? "Request failed");
      }
      if (data.plan && data.progress) {
        setPlan(data.plan);
        setProgress(data.progress);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  const clientLabel = plan.client.name?.trim() || plan.client.email;

  return (
    <div className="overflow-hidden rounded-3xl border border-[#D0D3E7] bg-white shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.03]">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#F46036]/[0.09] via-white to-[#F7F7FF] px-6 pb-8 pt-8 sm:px-10 sm:pb-10 sm:pt-10">
        <div
          className="pointer-events-none absolute right-0 top-0 h-40 w-40 opacity-[0.45] sm:h-52 sm:w-52"
          aria-hidden
          style={{
            background: `radial-gradient(circle at 70% 30%, rgba(0, 168, 158, 0.2) 0%, transparent 65%)`,
          }}
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b23d1e]">Your training plan</p>
              <StatusPill status={progress.status} />
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{plan.title}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-2 py-1 text-slate-700 ring-1 ring-[#D0D3E7]/80">
                <svg className="size-4 text-[#F46036]" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v4.59L7.3 9.23a.75.75 0 0 0-1.1 1.02l3.25 3.5a.75.75 0 0 0 1.1 0l3.25-3.5a.75.75 0 1 0-1.1-1.02l-1.45 1.56V6.75Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-slate-800">Client</span>
                <span>{clientLabel}</span>
              </span>
            </p>
            {plan.description ? (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">{plan.description}</p>
            ) : null}
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[200px] sm:items-end">
            <Link
              href="/client"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D0D3E7] bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#b23d1e] shadow-sm transition-colors hover:bg-[#ECFBFA] sm:justify-end"
            >
              <svg className="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path
                  fillRule="evenodd"
                  d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
                  clipRule="evenodd"
                />
              </svg>
              Trainee area
            </Link>
          </div>
        </div>

        {totalModules > 0 ? (
          <div className={`relative mt-8 ${PORTAL_SURFACE} p-4 backdrop-blur-sm sm:p-5`}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Overall progress</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
                  {completedCount}
                  <span className="text-lg font-semibold text-slate-400"> / {totalModules}</span>
                  <span className="ml-2 text-base font-semibold text-[#b23d1e]">{progressPercent}%</span>
                </p>
              </div>
              <p className="max-w-xs text-right text-xs leading-relaxed text-slate-500">
                Complete modules in any order. Your plan finishes when every quiz is passed.
              </p>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#D0D3E7]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#F46036] to-[#4FCEC0] transition-[width] duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        ) : null}

        <div className="relative mt-6 flex flex-wrap gap-2">
          {progress.status === "not_started" ? (
            <button
              type="button"
              disabled={pending || modulesDisplay.length === 0}
              onClick={() => void startPlan()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F46036] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#F46036]/25 transition hover:bg-[#d44a20] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.89a1.5 1.5 0 0 0 0-2.54L6.3 2.841Z" />
              </svg>
              {modulesDisplay.length === 0 ? "No modules" : "Start plan"}
            </button>
          ) : null}

          {progress.status === "in_progress" ? (
            <button
              type="button"
              disabled={pending}
              onClick={() => void runAction("pause")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D0D3E7] bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-[#F7F7FF] disabled:opacity-60"
            >
              <svg className="size-4 text-slate-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path d="M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 7.25 3h-1.5Zm6.5 0a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75h-1.5Z" />
              </svg>
              Pause
            </button>
          ) : null}

          {progress.status === "paused" ? (
            <>
              <button
                type="button"
                disabled={pending}
                onClick={() => void runAction("resume")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F46036] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#d44a20] disabled:opacity-60"
              >
                Resume
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  setCancelPauseStep(1);
                  setCancelPauseOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-800 transition hover:bg-rose-50 disabled:opacity-60"
              >
                Cancel pause
              </button>
            </>
          ) : null}
        </div>

        {error ? (
          <div
            className="relative mt-5 flex gap-3 rounded-xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-900"
            role="alert"
          >
            <svg className="mt-0.5 size-5 shrink-0 text-rose-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clipRule="evenodd"
              />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        ) : null}
      </div>

      {/* Modules */}
      <div className="border-t border-[#D0D3E7] bg-[#F7F7FF]/90 px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Modules</h2>
          <p className="text-sm text-slate-600">
            Study each module first; quizzes are on separate pages. Syllabus-cohort tracks (Linux, Networking, Python,
            PostgreSQL, and the Avaya AOC programs) each share one topic quiz after every related step is marked studied.
          </p>
        </div>

        <ol className="mt-6 space-y-3">
          {modulesDisplay.map((m, idx) => {
            const done = (progress.completedEntryIds ?? []).includes(completionKeyForModule(m));
            const moduleHref = `/client/plans/${encodeURIComponent(planId)}/module/${encodeURIComponent(String(m.order))}`;
            const showStudy = canOpenModules && !done;
            const cohortTopicId = linuxSyllabusTopicIdForPlanModule(m.entryId);
            const studyDone = isModuleStudyMarked(plan, progress, m.order);
            const cohortQuizReady = allQuizCohortStudyMarked(plan, progress, m.order);
            const topicQuizHref = cohortTopicId ? traineeSyllabusTopicQuizClientPath(planId, cohortTopicId) : null;
            const moduleQuizHref = `/client/plans/${encodeURIComponent(planId)}/quiz/module/${encodeURIComponent(String(m.order))}`;
            const showTopicQuiz = Boolean(showStudy && topicQuizHref && cohortQuizReady);
            const showModuleQuiz = Boolean(showStudy && !cohortTopicId && cohortQuizReady);

            return (
              <li key={`${m.entryId ?? "mod"}-${idx}-${m.order}`}>
                <div
                  className={`group flex flex-col gap-4 rounded-3xl border p-4 transition duration-200 sm:flex-row sm:items-center sm:justify-between sm:p-5 ${
                    done
                      ? "border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-white shadow-sm shadow-emerald-900/[0.03]"
                      : canOpenModules
                        ? "border-[#BFEFED]/90 bg-white shadow-sm ring-1 ring-black/[0.03] hover:border-[#F46036]/35 hover:shadow-md"
                        : "border-[#D0D3E7] bg-slate-50/50 ring-1 ring-black/[0.02]"
                  }`}
                >
                  <div className="flex min-w-0 flex-1 gap-4">
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold tabular-nums ${
                        done
                          ? "bg-emerald-100 text-emerald-800"
                          : canOpenModules
                            ? "bg-[#F46036]/12 text-[#177F78]"
                            : "bg-slate-200/80 text-slate-600"
                      }`}
                    >
                      {done ? (
                        <svg className="size-6" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path
                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <div className="min-w-0">
                      {m.sectionHeader ? (
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#b23d1e]">
                          {m.sectionHeader}
                        </p>
                      ) : null}
                      <p className="font-semibold leading-snug text-slate-900">{m.title}</p>
                      {m.subtitle ? (
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">{m.subtitle}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                    <ModuleStatusBadge done={done} planStatus={progress.status} />
                    <div className="flex flex-wrap gap-2">
                      {done ? (
                        <Link
                          href={moduleHref}
                          className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50"
                        >
                          Review
                        </Link>
                      ) : null}
                      {showStudy ? (
                        <div className="flex max-w-[18rem] flex-col items-stretch gap-2 sm:items-end">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Link
                              href={moduleHref}
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#BFEFED] bg-white px-4 py-2 text-xs font-semibold text-[#177F78] shadow-sm transition hover:bg-[#ECFBFA]"
                            >
                              Study
                              <svg className="size-3.5 opacity-90" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                                <path
                                  fillRule="evenodd"
                                  d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </Link>
                            {showTopicQuiz ? (
                              <Link
                                href={topicQuizHref!}
                                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#F46036] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-[#F46036]/20 transition hover:bg-[#d44a20]"
                              >
                                Topic quiz
                                <svg className="size-3.5 opacity-90" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                                  <path
                                    fillRule="evenodd"
                                    d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </Link>
                            ) : null}
                            {showModuleQuiz ? (
                              <Link
                                href={moduleQuizHref}
                                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#F46036] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-[#F46036]/20 transition hover:bg-[#d44a20]"
                              >
                                Module quiz
                                <svg className="size-3.5 opacity-90" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                                  <path
                                    fillRule="evenodd"
                                    d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </Link>
                            ) : null}
                          </div>
                          {cohortTopicId && !cohortQuizReady ? (
                            <p className="text-right text-[11px] leading-snug text-slate-500">
                              Topic quiz unlocks after study is marked on every step for this syllabus file
                              {studyDone ? " (this step done)" : ""}.
                            </p>
                          ) : null}
                          {!cohortTopicId && !cohortQuizReady && !studyDone ? (
                            <p className="text-right text-[11px] leading-snug text-slate-500">
                              Module quiz unlocks after you mark study complete on the study page.
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <TraineeLinuxSyllabusSection sections={linuxSyllabusSections} />
      <TraineeNetworkingSyllabusSection sections={networkingSyllabusSections} />
      <TraineePythonSyllabusSection sections={pythonSyllabusSections} />
      <TraineePostgresqlSyllabusSection sections={postgresqlSyllabusSections} />
      <TraineeAvayaAocSyllabusSection sections={avayaAocSyllabusSections} />
      <TraineeAvayaAocSolutionLifecycleSyllabusSection sections={avayaSlSyllabusSections} />
      <TraineeAvayaAocPlatformToolsSyllabusSection sections={avayaPtaSyllabusSections} />

      {cancelPauseOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[3px]"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setCancelPauseOpen(false);
              setCancelPauseStep(1);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-pause-title"
            className={`max-w-md overflow-hidden ${PORTAL_SURFACE} shadow-2xl shadow-slate-900/20`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="border-b border-[#D0D3E7] bg-gradient-to-r from-rose-50/80 to-white px-6 py-4">
              <h3 id="cancel-pause-title" className="text-lg font-bold text-slate-900">
                {cancelPauseStep === 1 ? "Cancel pause?" : "Confirm cancel pause"}
              </h3>
            </div>
            <p className="px-6 py-4 text-sm leading-relaxed text-slate-600">
              {cancelPauseStep === 1 ? (
                (progress.completedEntryIds ?? []).length === 0 ? (
                  <>
                    This will set the plan back to <strong className="text-slate-800">not started</strong>. You have
                    not completed a module yet.
                  </>
                ) : (
                  <>
                    This will end the paused state and return your plan to{" "}
                    <strong className="text-slate-800">in progress</strong> so you can continue from where you left off.
                  </>
                )
              ) : (
                <>
                  Please confirm again:{" "}
                  {(progress.completedEntryIds ?? []).length === 0 ? (
                    <>
                      the plan will stay <strong className="text-slate-800">not started</strong> until you press{" "}
                      <strong className="text-slate-800">Start plan</strong>.
                    </>
                  ) : (
                    <>pause will be cleared and you can keep completing modules in any order.</>
                  )}
                </>
              )}
            </p>
            <div className="flex flex-wrap justify-end gap-2 border-t border-[#D0D3E7] bg-[#F7F7FF]/80 px-6 py-4">
              <button
                type="button"
                className="rounded-xl border border-[#D0D3E7] bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-[#F7F7FF]"
                onClick={() => {
                  if (cancelPauseStep === 2) {
                    setCancelPauseStep(1);
                  } else {
                    setCancelPauseOpen(false);
                    setCancelPauseStep(1);
                  }
                }}
              >
                {cancelPauseStep === 1 ? "Keep paused" : "Back"}
              </button>
              {cancelPauseStep === 1 ? (
                <button
                  type="button"
                  className="rounded-xl bg-[#F46036] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#d44a20]"
                  onClick={() => setCancelPauseStep(2)}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  disabled={pending}
                  className="rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-800 disabled:opacity-60"
                  onClick={() => {
                    setCancelPauseOpen(false);
                    setCancelPauseStep(1);
                    void runAction("cancel_pause");
                  }}
                >
                  Yes, cancel pause
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
