"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { linuxBasicsLibrary } from "@/lib/linux-basics-library";
import { linuxAdvancedLibrary } from "@/lib/linux-advanced-library";
import { linuxIntermediateLibrary } from "@/lib/linux-intermediate-library";
import { networkingBasicsLibrary } from "@/lib/networking-basics-library";
import { networkingIntermediateLibrary } from "@/lib/networking-intermediate-library";
import { networkingAdvancedLibrary } from "@/lib/networking-advanced-library";
import { pythonAdvancedLibrary } from "@/lib/python-advanced-library";
import { pythonBasicsLibrary } from "@/lib/python-basics-library";
import { pythonIntermediateLibrary } from "@/lib/python-intermediate-library";
import { postgresqlAdvancedLibrary } from "@/lib/postgresql-advanced-library";
import { postgresqlBasicsLibrary } from "@/lib/postgresql-basics-library";
import { postgresqlIntermediateLibrary } from "@/lib/postgresql-intermediate-library";
import { avayaAocLibrary } from "@/lib/avaya-aoc-library";
import { avayaAocPlatformToolsAutomationLibrary } from "@/lib/avaya-aoc-platform-tools-automation-library";
import { avayaAocSolutionLifecycleLibrary } from "@/lib/avaya-aoc-solution-lifecycle-library";
import { parsePlanEntryId } from "@/lib/plan-sequence";
import {
  formatTrainingSourceHeader,
  getTrainingSourceForTopicId,
} from "@/lib/training-topic-source";
import type { LinuxTopic } from "@/lib/linux-topic";
import { SavedPlanCollapsible } from "@/components/saved-plan-collapsible";
import { PlanTopicLibrariesStack } from "./plan-topic-libraries-stack";
import type { SavedPlanSummary } from "@/lib/training-plan-summary";
import {
  trainingPlanClientSelectLabel,
  trainingPlanTraineeSelectLabel,
} from "@/lib/training-plan-clients";
import { PORTAL_CARD, PORTAL_SURFACE } from "@/lib/portal-ui-classes";

const cardClass = PORTAL_CARD;

const inputFocus =
  "focus:border-[#00A89E] focus:outline-none focus:ring-2 focus:ring-[#00A89E]/25";

/** Legacy trainer-defined entries; stripped from plans on load. */
const LEGACY_CUSTOM_ENTRY_PREFIX = "__custom__:";

const ALL_TOPIC_LISTS: LinuxTopic[][] = [
  linuxBasicsLibrary,
  linuxIntermediateLibrary,
  linuxAdvancedLibrary,
  networkingBasicsLibrary,
  networkingIntermediateLibrary,
  networkingAdvancedLibrary,
  pythonBasicsLibrary,
  pythonIntermediateLibrary,
  pythonAdvancedLibrary,
  postgresqlBasicsLibrary,
  postgresqlIntermediateLibrary,
  postgresqlAdvancedLibrary,
  avayaAocLibrary,
  avayaAocSolutionLifecycleLibrary,
  avayaAocPlatformToolsAutomationLibrary,
];

type ClientOption = { id: string; name: string | null; email: string };
type TraineeOption = { id: string; name: string | null; email: string };

type PlanSlot = { entryId: string; contentId: string };

type PlanItemPayload = {
  entryId: string;
  contentId: string;
  title: string;
  subtitle: string;
  sectionHeader: string | null;
};

type SavedPlansScope = "all" | "trainer-client";

type Props = {
  initialSavedPlans: SavedPlanSummary[];
  /** When creating, pre-select this client master id if it appears in the loaded client list. */
  defaultClientMasterId?: string | null;
  /** When set, form hydrates from this plan and saves via PATCH. */
  editingPlan?: SavedPlanSummary | null;
  savedPlansScope?: SavedPlansScope;
};

export function TrainingPlanBuilderSection({
  initialSavedPlans,
  defaultClientMasterId = null,
  editingPlan = null,
  savedPlansScope = "all",
}: Props) {
  const [planSlots, setPlanSlots] = useState<PlanSlot[]>(() =>
    editingPlan
      ? [...editingPlan.modules]
          .sort((a, b) => a.order - b.order)
          .map((m) => {
            const eid = m.entryId;
            if (typeof eid !== "string" || !eid.length || eid.startsWith(LEGACY_CUSTOM_ENTRY_PREFIX)) {
              return null;
            }
            return {
              entryId: eid,
              contentId: m.contentId?.trim() || crypto.randomUUID(),
            };
          })
          .filter((x): x is PlanSlot => x !== null)
      : [],
  );
  const [planTitle, setPlanTitle] = useState(() => editingPlan?.title ?? "");
  const [planNotes, setPlanNotes] = useState(() => editingPlan?.description ?? "");
  const [clientId, setClientId] = useState(() => editingPlan?.client.id ?? "");
  const [traineeUserId, setTraineeUserId] = useState(() => editingPlan?.trainee?.id ?? "");
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [clientsError, setClientsError] = useState<string | null>(null);
  const [trainees, setTrainees] = useState<TraineeOption[]>([]);
  const [traineesLoading, setTraineesLoading] = useState(true);
  const [traineesError, setTraineesError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedPlans, setSavedPlans] = useState<SavedPlanSummary[]>(initialSavedPlans);
  const [savedPlansLoading, setSavedPlansLoading] = useState(false);
  const [savedPlansError, setSavedPlansError] = useState<string | null>(null);

  const hasPlanTopics = planSlots.length > 0;

  const traineeOptions = useMemo(() => {
    const base = [...trainees];
    const assigned = editingPlan?.trainee;
    if (assigned && !base.some((t) => t.id === assigned.id)) {
      base.unshift({
        id: assigned.id,
        name: assigned.name,
        email: assigned.email,
      });
    }
    return base;
  }, [trainees, editingPlan]);

  const topicById = useMemo(() => {
    const m = new Map<string, LinuxTopic>();
    for (const list of ALL_TOPIC_LISTS) {
      for (const t of list) {
        m.set(t.id, t);
      }
    }
    return m;
  }, []);

  const selectedIds = useMemo(() => new Set(planSlots.map((s) => s.entryId)), [planSlots]);

  const linuxTopicIdSet = useMemo(() => {
    const s = new Set<string>();
    for (const t of linuxBasicsLibrary) s.add(t.id);
    for (const t of linuxIntermediateLibrary) s.add(t.id);
    for (const t of linuxAdvancedLibrary) s.add(t.id);
    return s;
  }, []);

  const networkingTopicIdSet = useMemo(() => {
    const s = new Set<string>();
    for (const t of networkingBasicsLibrary) s.add(t.id);
    for (const t of networkingIntermediateLibrary) s.add(t.id);
    for (const t of networkingAdvancedLibrary) s.add(t.id);
    return s;
  }, []);

  const pythonTopicIdSet = useMemo(() => {
    const s = new Set<string>();
    for (const t of pythonBasicsLibrary) s.add(t.id);
    for (const t of pythonIntermediateLibrary) s.add(t.id);
    for (const t of pythonAdvancedLibrary) s.add(t.id);
    return s;
  }, []);

  const postgresqlTopicIdSet = useMemo(() => {
    const s = new Set<string>();
    for (const t of postgresqlBasicsLibrary) s.add(t.id);
    for (const t of postgresqlIntermediateLibrary) s.add(t.id);
    for (const t of postgresqlAdvancedLibrary) s.add(t.id);
    return s;
  }, []);

  const avayaAocTopicIdSet = useMemo(() => {
    const s = new Set<string>();
    for (const t of avayaAocLibrary) s.add(t.id);
    return s;
  }, []);

  const avayaAocSolutionLifecycleTopicIdSet = useMemo(() => {
    const s = new Set<string>();
    for (const t of avayaAocSolutionLifecycleLibrary) s.add(t.id);
    return s;
  }, []);

  const avayaAocPlatformToolsAutomationTopicIdSet = useMemo(() => {
    const s = new Set<string>();
    for (const t of avayaAocPlatformToolsAutomationLibrary) s.add(t.id);
    return s;
  }, []);

  const toggleTopic = useCallback((entryId: string) => {
    setPlanSlots((prev) => {
      if (prev.some((s) => s.entryId === entryId)) {
        return prev.filter((s) => s.entryId !== entryId);
      }
      let next = [...prev];
      const parsed = parsePlanEntryId(entryId);
      if (parsed?.kind === "major") {
        next = next.filter((s) => {
          const p = parsePlanEntryId(s.entryId);
          if (p?.kind === "subtopic" && p.topicId === entryId) return false;
          return true;
        });
      } else if (parsed?.kind === "subtopic") {
        next = next.filter((s) => s.entryId !== parsed.topicId);
      }
      if (next.some((s) => s.entryId === entryId)) return next;
      return [...next, { entryId, contentId: crypto.randomUUID() }];
    });
  }, []);

  const setSectionTopicsSelected = useCallback((topicIds: string[], include: boolean) => {
    const idSet = new Set(topicIds);
    setPlanSlots((prev) => {
      if (!include) {
        return prev.filter((s) => {
          if (idSet.has(s.entryId)) return false;
          const p = parsePlanEntryId(s.entryId);
          if (p?.kind === "subtopic" && idSet.has(p.topicId)) return false;
          return true;
        });
      }
      let next = [...prev];
      for (const id of topicIds) {
        next = next.filter((s) => {
          const p = parsePlanEntryId(s.entryId);
          if (p?.kind === "subtopic" && p.topicId === id) return false;
          return true;
        });
        if (!next.some((s) => s.entryId === id)) {
          next.push({ entryId: id, contentId: crypto.randomUUID() });
        }
      }
      return next;
    });
  }, []);

  const moveUp = useCallback((index: number) => {
    if (index <= 0) return;
    setPlanSlots((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  const moveDown = useCallback((index: number) => {
    setPlanSlots((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }, []);

  const removeAt = useCallback((index: number) => {
    setPlanSlots((prev) => prev.filter((_, i) => i !== index));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setClientsLoading(true);
      setClientsError(null);
      try {
        const res = await fetch("/api/training-plans/clients", { credentials: "same-origin" });
        const data = (await res.json()) as { clients?: ClientOption[]; error?: string };
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Not signed in — refresh the page or log in again.");
          }
          if (res.status === 403) {
            throw new Error("Your role cannot load clients. Use a trainer or admin account.");
          }
          throw new Error(data.error ?? "Failed to load clients");
        }
        if (cancelled) return;
        const loadedClients = data.clients ?? [];
        setClients(loadedClients);
        setClientId((prev) => {
          if (editingPlan) {
            return editingPlan.client.id;
          }
          if (prev && loadedClients.some((c) => c.id === prev)) return prev;
          if (defaultClientMasterId && loadedClients.some((c) => c.id === defaultClientMasterId)) {
            return defaultClientMasterId;
          }
          return loadedClients[0]?.id ?? "";
        });
        if (!loadedClients.length) {
          setClientsError(
            "No client masters found. Run: npx prisma migrate deploy && npx prisma db seed, or ask a platform owner to add clients.",
          );
        } else {
          setClientsError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setClients([]);
          setClientId(editingPlan?.client.id ?? "");
          setClientsError(e instanceof Error ? e.message : "Could not load clients");
        }
      } finally {
        if (!cancelled) setClientsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [defaultClientMasterId, editingPlan]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setTraineesLoading(true);
      setTraineesError(null);
      try {
        const res = await fetch("/api/training-plans/trainees", { credentials: "same-origin" });
        const data = (await res.json()) as {
          trainees?: TraineeOption[];
          trainerHasClient?: boolean;
          error?: string;
        };
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Not signed in — refresh the page or log in again.");
          }
          if (res.status === 403) {
            throw new Error("Only trainers can load the trainee roster.");
          }
          throw new Error(data.error ?? "Failed to load trainees");
        }
        if (cancelled) return;
        setTrainees(Array.isArray(data.trainees) ? data.trainees : []);
        if (data.trainerHasClient === false) {
          setTraineesError(
            "Assign a client to your trainer account to load trainees for plan assignment.",
          );
        }
      } catch (e) {
        if (!cancelled) {
          setTrainees([]);
          setTraineesError(e instanceof Error ? e.message : "Could not load trainees");
        }
      } finally {
        if (!cancelled) setTraineesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchSavedPlans = useCallback(async () => {
    setSavedPlansLoading(true);
    setSavedPlansError(null);
    try {
      const res = await fetch("/api/training-plans", { credentials: "same-origin" });
      const data = (await res.json()) as { plans?: SavedPlanSummary[]; error?: string };
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Not signed in — refresh the page or log in again.");
        }
        if (res.status === 403) {
          throw new Error("Your role cannot load saved plans.");
        }
        throw new Error(data.error ?? "Failed to load saved plans");
      }
      setSavedPlans(Array.isArray(data.plans) ? data.plans : []);
    } catch (e) {
      setSavedPlans([]);
      setSavedPlansError(e instanceof Error ? e.message : "Could not load saved plans");
    } finally {
      setSavedPlansLoading(false);
    }
  }, []);

  const buildPlanItems = useCallback((): PlanItemPayload[] => {
    const items: PlanItemPayload[] = [];
    for (const slot of planSlots) {
      const { entryId, contentId } = slot;
      if (entryId.startsWith(LEGACY_CUSTOM_ENTRY_PREFIX)) continue;
      const parsed = parsePlanEntryId(entryId);
      if (!parsed) continue;
      const topic = topicById.get(parsed.topicId);
      if (!topic) continue;
      const isSubtopic = parsed.kind === "subtopic";
      const titleLine =
        isSubtopic
          ? topic.minors[parsed.minorIndex] ?? `Sub-topic ${parsed.minorIndex + 1}`
          : topic.major;
      const subtitle = isSubtopic
        ? `Under: ${topic.major}`
        : `${topic.minors.length} sub-topics: ${topic.minors[0]}${
            topic.minors.length > 1 ? " …" : ""
          }`;
      const sourceLabels = getTrainingSourceForTopicId(parsed.topicId);
      const sectionHeader = sourceLabels ? formatTrainingSourceHeader(sourceLabels) : null;
      items.push({ entryId, contentId, title: titleLine, subtitle, sectionHeader });
    }
    return items;
  }, [planSlots, topicById]);

  const clientIdIsPersistable = useMemo(() => {
    const raw = clientId.trim();
    if (!raw) return false;
    if (raw.startsWith("__preset:") || raw.startsWith("__missing:")) return true;
    /** Editing: client is fixed to the plan’s row; don’t wait for the clients fetch to enable Update. */
    if (editingPlan && raw === editingPlan.client.id) return true;
    return clients.some((c) => c.id === raw);
  }, [clientId, clients, editingPlan]);

  const traineeIdIsPersistable = Boolean(traineeUserId.trim());

  const canPersistPlan =
    hasPlanTopics &&
    planTitle.trim().length > 0 &&
    clientIdIsPersistable &&
    traineeIdIsPersistable &&
    !isSaving;

  const persistPlan = useCallback(async () => {
      setSaveMessage(null);
      if (!hasPlanTopics || !planTitle.trim() || !clientIdIsPersistable) {
        setSaveMessage({
          type: "err",
          text: "Add a plan title, choose a client, and add at least one module.",
        });
        return;
      }
      if (!traineeUserId.trim()) {
        setSaveMessage({
          type: "err",
          text: "Choose the trainee user this plan is for. Both client and trainee are stored with the plan.",
        });
        return;
      }
      const items = buildPlanItems();
      if (items.length === 0) {
        setSaveMessage({ type: "err", text: "No valid modules to save." });
        return;
      }

      setIsSaving(true);
      try {
        const planId = editingPlan?.id;
        const isEditing = Boolean(planId);
        const res = await fetch(
          isEditing
            ? `/api/training-plans/${encodeURIComponent(planId!)}`
            : "/api/training-plans",
          {
            method: isEditing ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: planTitle.trim(),
              description: planNotes.trim() || null,
              clientId,
              traineeUserId: traineeUserId.trim(),
              isDraft: false,
              items,
            }),
            credentials: "same-origin",
          },
        );
        if (!res.ok) {
          let message = "Save failed";
          try {
            const errBody = (await res.json()) as { error?: string };
            if (typeof errBody.error === "string" && errBody.error.trim()) {
              message = errBody.error.trim();
            }
          } catch {
            /* ignore parse errors */
          }
          throw new Error(message);
        }
        const bust = Date.now();
        if (isEditing) {
          window.location.assign(
            `/trainer/training-plans/new?saved=${encodeURIComponent(planId!)}&t=${bust}`,
          );
        } else {
          window.location.assign(`/trainer/training-plans/new?t=${bust}`);
        }
      } catch (e) {
        setSaveMessage({
          type: "err",
          text: e instanceof Error ? e.message : "Could not save plan",
        });
      } finally {
        setIsSaving(false);
      }
  }, [
    buildPlanItems,
    clientId,
    clientIdIsPersistable,
    editingPlan,
    hasPlanTopics,
    planNotes,
    planTitle,
    traineeUserId,
  ]);

  return (
    <div className="flex flex-col gap-8">
      <section className={cardClass} aria-labelledby="saved-plans-heading">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="saved-plans-heading" className="text-lg font-semibold text-slate-900">
              Saved plans
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {savedPlansScope === "trainer-client"
                ? "Plans for your assigned client (newest first). Module order matches what was saved."
                : "Plans stored in the database for all clients (newest first). Module order matches what was saved."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void fetchSavedPlans()}
            disabled={savedPlansLoading}
            className="rounded-xl border border-[#d6cfc4] px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-[#faf9f7] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {savedPlansLoading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {savedPlansError ? (
          <p className="mt-4 text-sm text-rose-700" role="alert">
            {savedPlansError}
          </p>
        ) : null}

        {savedPlansLoading && savedPlans.length === 0 && !savedPlansError ? (
          <p className="mt-4 text-sm text-slate-600">Loading saved plans…</p>
        ) : null}

        {!savedPlansLoading && savedPlans.length === 0 && !savedPlansError ? (
          <p className="mt-4 text-sm text-slate-600">
            {editingPlan
              ? "No other saved plans for this client yet."
              : "No plans yet. Build a plan above and use Save plan."}
          </p>
        ) : null}

        {savedPlans.length > 0 ? (
          <ul className="mt-6 space-y-4">
            {savedPlans.map((plan) => {
              const clientLabel = trainingPlanClientSelectLabel(plan.client);
              const updated = new Date(plan.updatedAt);
              return (
                <li key={plan.id} className="list-none">
                  <SavedPlanCollapsible
                    summary={
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-base font-semibold text-slate-900">{plan.title}</p>
                          <p className="mt-1 text-sm text-slate-600">
                            <span className="font-medium text-slate-700">Client:</span> {clientLabel}
                            <span className="mx-2 text-slate-300">·</span>
                            <span className="font-medium text-slate-700">Trainee:</span>{" "}
                            {plan.trainee
                              ? trainingPlanTraineeSelectLabel(plan.trainee)
                              : "All trainees (not assigned to one user)"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {plan.modules.length} module(s) — expand for description and full list.
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                          {plan.isDraft ? (
                            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-900">
                              Draft
                            </span>
                          ) : (
                            <span className="rounded-full bg-[#e6f7f5] px-2.5 py-0.5 text-xs font-semibold text-[#00786f]">
                              Published
                            </span>
                          )}
                          {savedPlansScope === "trainer-client" ? (
                            <Link
                              href={`/trainer/training-plans/${encodeURIComponent(plan.id)}/edit`}
                              className="rounded-lg border border-[#d6cfc4] px-2.5 py-1 text-xs font-semibold text-[#00786f] hover:bg-[#faf9f7]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Edit
                            </Link>
                          ) : null}
                          <span className="text-xs text-slate-500">
                            Updated {updated.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                          </span>
                        </div>
                      </div>
                    }
                  >
                    {plan.description ? (
                      <p className="text-sm text-slate-600">{plan.description}</p>
                    ) : null}
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Modules ({plan.modules.length})
                      </p>
                      <ol className="mt-2 space-y-2">
                        {plan.modules.map((m) => (
                          <li
                            key={`${plan.id}-${m.order}`}
                            className="rounded-lg border border-[#d8d0c4] bg-white px-3 py-2"
                          >
                            {m.sectionHeader ? (
                              <p className="mb-0.5 text-[11px] font-semibold leading-snug text-[#00786f]">
                                {m.sectionHeader}
                              </p>
                            ) : null}
                            <p className="text-sm font-medium text-slate-800">
                              {m.order + 1}. {m.title}
                            </p>
                            {m.subtitle ? (
                              <p className="mt-0.5 text-xs text-slate-500">{m.subtitle}</p>
                            ) : null}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </SavedPlanCollapsible>
                </li>
              );
            })}
          </ul>
        ) : null}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className={`${cardClass} lg:col-span-2`}>
          <h2 className="text-lg font-semibold text-slate-900">Plan details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Client
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                disabled={clientsLoading || Boolean(editingPlan)}
                className={`rounded-xl border border-[#d6cfc4] bg-white px-3 py-2 text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 ${inputFocus}`}
              >
                {clientsLoading ? (
                  <option value="">Loading clients…</option>
                ) : (
                  <>
                    <option value="">Select client…</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {trainingPlanClientSelectLabel(c)}
                      </option>
                    ))}
                  </>
                )}
              </select>
              {clientsLoading ? (
                <span className="text-xs font-normal text-slate-500">Fetching client list from the server…</span>
              ) : editingPlan ? (
                <span className="text-xs font-normal text-slate-500">
                  Client is fixed while editing this plan.
                </span>
              ) : clientsError ? (
                <span className="text-xs font-normal text-rose-700">{clientsError}</span>
              ) : null}
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Plan title
              <input
                type="text"
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                placeholder="e.g., Linux Basics — Onboarding batch"
                className={`rounded-xl border border-[#d6cfc4] px-3 py-2 text-slate-900 placeholder:text-slate-400 ${inputFocus}`}
              />
            </label>
          </div>

          <label className="mt-4 flex flex-col gap-2 text-sm font-medium text-slate-700">
            Trainee user{" "}
            <span className="font-normal text-rose-700">(required — saved on the plan)</span>
            <select
              value={traineeUserId}
              onChange={(e) => setTraineeUserId(e.target.value)}
              disabled={traineesLoading}
              className={`rounded-xl border border-[#d6cfc4] bg-white px-3 py-2 text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 ${inputFocus}`}
            >
              <option value="">Select trainee…</option>
              {traineeOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {trainingPlanTraineeSelectLabel(t)}
                </option>
              ))}
            </select>
            {traineesLoading ? (
              <span className="text-xs font-normal text-slate-500">Loading trainee roster…</span>
            ) : traineesError ? (
              <span className="text-xs font-normal text-rose-700">{traineesError}</span>
            ) : traineeOptions.length === 0 ? (
              <span className="text-xs font-normal text-rose-700">
                No trainee users for this client. Add trainee accounts before saving a plan.
              </span>
            ) : (
              <span className="text-xs font-normal text-slate-500">
                Stored as <span className="font-medium text-slate-700">traineeUserId</span> with{" "}
                <span className="font-medium text-slate-700">clientMasterId</span> when you save.
              </span>
            )}
          </label>

          <label className="mt-4 flex flex-col gap-2 text-sm font-medium text-slate-700">
            Notes
            <textarea
              rows={4}
              value={planNotes}
              onChange={(e) => setPlanNotes(e.target.value)}
              placeholder="Add learning objectives, lab prerequisites, and trainer notes..."
              className={`rounded-xl border border-[#d6cfc4] px-3 py-2 text-slate-900 placeholder:text-slate-400 ${inputFocus}`}
            />
          </label>
        </div>

        <section
          className={`${cardClass} flex min-h-0 flex-col`}
          aria-labelledby="plan-topics-heading"
        >
          <h2 id="plan-topics-heading" className="text-lg font-semibold text-slate-900">
            Plan Topics
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            <span className="font-medium text-slate-700">Tracks:</span> LINUX, Networking, Python, PostgreSQL (relational
            DB basics), and AOC program tracks.
            Expand a tier to select whole modules or open a row for sub-topic checkboxes. Order modules in{" "}
            <span className="font-medium text-slate-700">Plan sequence</span> below.
          </p>
          <div className="mt-6 flex min-h-0 flex-col gap-6">
            <PlanTopicLibrariesStack
              linuxTopicIdSet={linuxTopicIdSet}
              networkingTopicIdSet={networkingTopicIdSet}
              pythonTopicIdSet={pythonTopicIdSet}
              postgresqlTopicIdSet={postgresqlTopicIdSet}
              avayaAocTopicIdSet={avayaAocTopicIdSet}
              solutionLifecycleTopicIdSet={avayaAocSolutionLifecycleTopicIdSet}
              platformToolsAutomationTopicIdSet={avayaAocPlatformToolsAutomationTopicIdSet}
              selectedIds={selectedIds}
              onToggleTopic={toggleTopic}
              onSectionBulkSelect={setSectionTopicsSelected}
              allowSubtopicCheckboxes
            />
          </div>
        </section>
      </section>

      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-slate-900">Plan sequence</h2>
        {planSlots.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">
            No modules in the plan yet. Use <span className="font-medium">Plan Topics</span> to add modules;
            they appear here in the order you add them. Reorder with Up / Down.
          </p>
        ) : (
          <ol className="mt-4 space-y-3">
            {planSlots.map((slot, index) => {
              const { entryId, contentId } = slot;
              if (entryId.startsWith(LEGACY_CUSTOM_ENTRY_PREFIX)) return null;

              const parsed = parsePlanEntryId(entryId);
              if (!parsed) return null;
              const topic = topicById.get(parsed.topicId);
              if (!topic) return null;

              const isSubtopic = parsed.kind === "subtopic";
              const titleLine =
                isSubtopic
                  ? topic.minors[parsed.minorIndex] ?? `Sub-topic ${parsed.minorIndex + 1}`
                  : topic.major;
              const subtitle = isSubtopic
                ? `Under: ${topic.major}`
                : `${topic.minors.length} sub-topics: ${topic.minors[0]}${
                    topic.minors.length > 1 ? " …" : ""
                  }`;

              const sourceLabels = getTrainingSourceForTopicId(parsed.topicId);
              const sectionHeader = sourceLabels ? formatTrainingSourceHeader(sourceLabels) : null;

              return (
                <li
                  key={contentId}
                  className={`flex items-center justify-between px-4 py-3 ${PORTAL_SURFACE}`}
                >
                  <div className="min-w-0 pr-2">
                    {sectionHeader ? (
                      <p className="mb-1 text-xs font-semibold leading-snug text-[#00786f]">
                        {sectionHeader}
                      </p>
                    ) : null}
                    <p className="text-sm font-medium text-slate-800">
                      {index + 1}. {titleLine}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="rounded-lg border border-[#d6cfc4] px-2 py-1 text-xs text-slate-600 hover:bg-[#faf9f7] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(index)}
                      disabled={index === planSlots.length - 1}
                      className="rounded-lg border border-[#d6cfc4] px-2 py-1 text-xs text-slate-600 hover:bg-[#faf9f7] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      onClick={() => removeAt(index)}
                      className="rounded-lg border border-rose-200 px-2 py-1 text-xs text-rose-800 hover:bg-rose-50"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!canPersistPlan}
              onClick={() => void persistPlan()}
              className="rounded-xl bg-[#00A89E] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#00A89E]/20 hover:bg-[#008f86] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none disabled:hover:bg-[#00A89E]"
            >
              {isSaving ? "Saving…" : editingPlan ? "Update plan" : "Save plan"}
            </button>
          </div>
          {saveMessage ? (
            <p
              className={`text-sm ${saveMessage.type === "ok" ? "text-[#00786f]" : "text-rose-800"}`}
              role="status"
            >
              {saveMessage.text}
            </p>
          ) : null}
          <p className="text-xs text-slate-500">
            Saving writes <span className="font-medium text-slate-700">clientMasterId</span> (client you
            selected) and <span className="font-medium text-slate-700">traineeUserId</span> (trainee you
            selected), plus module order. Ensure the database is migrated and seeded so saving works.
          </p>
        </div>
      </section>
    </div>
  );
}
