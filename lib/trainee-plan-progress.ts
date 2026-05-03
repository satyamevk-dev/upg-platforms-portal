import type { Prisma, TraineePlanProgress, TraineePlanProgressStatus } from "@prisma/client";
import {
  EXERCISE_PROGRESS_CONTENT_PREFIX,
  stableProgressKeyFromContentId,
} from "@/lib/exercise-details-json";
import { prisma } from "@/lib/prisma";
import { linuxSyllabusTopicIdForPlanModule } from "@/lib/linux-plan-topic-group";
import type { SavedPlanModule, SavedPlanSummary } from "@/lib/training-plan-summary";
import { getAssignedTrainingPlanForTrainee } from "@/lib/training-plans-list";
import {
  isTraineeStudyMarkerEntry,
  moduleCompletionKeyFromStudyMarker,
  studyMarkerForModuleCompletionKey,
} from "@/lib/trainee-study-keys";

export type TraineePlanAction =
  | "start"
  | "pause"
  | "resume"
  | "cancel_pause"
  | "complete_module";

export type TraineeProgressPayload = {
  status: TraineePlanProgress["status"] | "not_started";
  highestCompletedOrder: number;
  /** Module quiz completions: `__cid:` + contentId when set, else `entryId`, else `__order:n`. */
  completedEntryIds: string[];
  /**
   * Trainee confirmed study/review for each module (same key shape as {@link completionKeyForModule}).
   * Derived from `__trainee_study__:` entries in {@link completedEntryIds}.
   */
  studiedEntryIds: string[];
};

function defaultProgress(): TraineeProgressPayload {
  return { status: "not_started", highestCompletedOrder: -1, completedEntryIds: [], studiedEntryIds: [] };
}

/** Prisma may omit or null-list `completedEntryIds` on older rows; normalize before `.length` / spread. */
function storedCompletedEntryIds(row: Pick<TraineePlanProgress, "completedEntryIds">): string[] {
  const v = row.completedEntryIds;
  return Array.isArray(v) ? v : [];
}

function studiedCompletionKeysFromStoredRow(row: Pick<TraineePlanProgress, "completedEntryIds">): string[] {
  const out: string[] = [];
  for (const id of storedCompletedEntryIds(row)) {
    const inner = moduleCompletionKeyFromStudyMarker(id);
    if (inner) out.push(inner);
  }
  return out;
}

/** Per-exercise row when syncing trainee progress after a trainer save. */
export type PlanModuleProgressSyncRow = {
  order: number;
  entryId: string;
  contentId: string | null;
};

/** Stable key for quiz completion: `contentId` (preferred), else library/custom `entryId`, else positional fallback. */
export function completionKeyForModule(m: Pick<SavedPlanModule, "order" | "entryId" | "contentId">): string {
  const cidKey = stableProgressKeyFromContentId(m.contentId);
  if (cidKey) return cidKey;
  const id = m.entryId?.trim();
  if (id) return id;
  return `__order:${m.order}`;
}

/**
 * Topic identity for merging completions across plan edits. Prefer `contentId`; else library/custom `entryId`.
 * Anonymous modules (no id) do not survive edits.
 */
export function topicKeyFromPlanModule(m: Pick<SavedPlanModule, "entryId" | "contentId">): string | null {
  const cidKey = stableProgressKeyFromContentId(m.contentId);
  if (cidKey) return cidKey;
  const t = m.entryId?.trim();
  return t || null;
}

function orderKeyToTopic(key: string, previousModules: PlanModuleProgressSyncRow[]): string | null {
  const k = key.trim();
  const orderMatch = /^__order:(\d+)$/.exec(k);
  if (orderMatch) {
    const o = Number(orderMatch[1]);
    if (!Number.isInteger(o)) return null;
    const mod = previousModules.find((m) => m.order === o);
    if (!mod) return null;
    return topicKeyFromPlanModule(mod);
  }
  if (k.startsWith(EXERCISE_PROGRESS_CONTENT_PREFIX)) return k;
  return topicKeyFromPlanModule({ entryId: k, contentId: null });
}

/** True if this module should count as completed given stored topic keys (matches `contentId`, `entryId`, or legacy `entryId`-only keys). */
function moduleMatchesTopicDone(
  m: Pick<SavedPlanModule, "entryId" | "contentId">,
  topicDone: Set<string>,
): boolean {
  const primary = topicKeyFromPlanModule(m);
  if (primary && topicDone.has(primary)) return true;
  const eid = m.entryId?.trim();
  if (eid && topicDone.has(eid)) return true;
  return false;
}

/** Collect topic ids the trainee completed, using the **previous** plan shape to decode `__order:o` keys. */
function completedTopicSetFromRow(row: TraineePlanProgress, previousModules: PlanModuleProgressSyncRow[]): Set<string> {
  const topics = new Set<string>();
  for (const key of storedCompletedEntryIds(row)) {
    if (isTraineeStudyMarkerEntry(key)) continue;
    const t = orderKeyToTopic(key, previousModules);
    if (t) topics.add(t);
  }
  return topics;
}

function studiedTopicSetFromRow(row: TraineePlanProgress, previousModules: PlanModuleProgressSyncRow[]): Set<string> {
  const topics = new Set<string>();
  for (const key of storedCompletedEntryIds(row)) {
    if (!isTraineeStudyMarkerEntry(key)) continue;
    const inner = moduleCompletionKeyFromStudyMarker(key);
    if (!inner) continue;
    const t = orderKeyToTopic(inner, previousModules);
    if (t) topics.add(t);
  }
  return topics;
}

/** Rebuild stored completion keys for the new plan from topic-level completions (order/titles may change). */
function completedEntryIdsForModulesFromTopics(
  topicDone: Set<string>,
  nextModules: PlanModuleProgressSyncRow[],
): string[] {
  const out: string[] = [];
  for (const m of nextModules) {
    if (moduleMatchesTopicDone(m, topicDone)) {
      out.push(
        completionKeyForModule({
          order: m.order,
          entryId: m.entryId || null,
          contentId: m.contentId,
        }),
      );
    }
  }
  return out;
}

function studyMarkersForModulesFromTopics(
  topicDone: Set<string>,
  nextModules: PlanModuleProgressSyncRow[],
): string[] {
  const out: string[] = [];
  for (const m of nextModules) {
    if (moduleMatchesTopicDone(m, topicDone)) {
      out.push(
        studyMarkerForModuleCompletionKey(
          completionKeyForModule({
            order: m.order,
            entryId: m.entryId || null,
            contentId: m.contentId,
          }),
        ),
      );
    }
  }
  return out;
}

function moduleAtOrder(plan: SavedPlanSummary, order: number): SavedPlanModule | undefined {
  return plan.modules.find((m) => m.order === order);
}

/**
 * Quiz completions must come only from `completedEntryIds`. A stale `highestCompletedOrder` with an empty list
 * used to infer “complete” on whatever plan loaded next (including newly assigned modules).
 */
export function effectiveCompletedEntryIds(_plan: SavedPlanSummary, row: TraineePlanProgress | null): string[] {
  if (!row) return [];
  return [...storedCompletedEntryIds(row)];
}

/** Clear orphaned positional progress when there are no explicit module completion keys. */
export async function scrubStaleHighestCompletedOrderRow(row: TraineePlanProgress): Promise<TraineePlanProgress>;
export async function scrubStaleHighestCompletedOrderRow(row: null): Promise<null>;
export async function scrubStaleHighestCompletedOrderRow(
  row: TraineePlanProgress | null,
): Promise<TraineePlanProgress | null> {
  if (!row) return null;
  if (storedCompletedEntryIds(row).length > 0) return row;

  const data: { highestCompletedOrder?: number; status?: TraineePlanProgressStatus } = {};
  if (row.highestCompletedOrder >= 0) {
    data.highestCompletedOrder = -1;
  }
  if (row.status === "completed") {
    data.status = "in_progress";
  }
  if (Object.keys(data).length === 0) return row;

  return prisma.traineePlanProgress.update({
    where: { id: row.id },
    data,
  });
}

function payloadFromRow(plan: SavedPlanSummary | null, row: TraineePlanProgress | null): TraineeProgressPayload {
  if (!row) return defaultProgress();
  const completedEntryIds = plan ? effectiveCompletedEntryIds(plan, row) : [...storedCompletedEntryIds(row)];
  const studiedEntryIds = studiedCompletionKeysFromStoredRow(row);
  let status: TraineeProgressPayload["status"] = row.status;
  if (plan && row.status === "completed") {
    const interim: TraineeProgressPayload = {
      status: "completed",
      highestCompletedOrder: row.highestCompletedOrder,
      completedEntryIds,
      studiedEntryIds,
    };
    const next = getNextRequiredModuleOrder(plan, getSortedModuleOrdersFromPlan(plan), interim);
    if (next !== null) {
      status = "in_progress";
    }
  }
  return {
    status,
    highestCompletedOrder: row.highestCompletedOrder,
    completedEntryIds,
    studiedEntryIds,
  };
}

export function progressRowToPayload(
  row: TraineePlanProgress | null,
  plan: SavedPlanSummary | null = null,
): TraineeProgressPayload {
  return payloadFromRow(plan, row);
}

function maxCompletedOrderForKeys(plan: SavedPlanSummary, keys: Set<string>): number {
  let max = -1;
  for (const m of plan.modules) {
    if (keys.has(completionKeyForModule(m))) {
      max = Math.max(max, m.order);
    }
  }
  return max;
}

/** All current plan modules (by sequence order) have a passed quiz. */
export function allPlanModulesCompleted(plan: SavedPlanSummary, completedEntryIds: string[] | undefined): boolean {
  const sorted = getSortedModuleOrdersFromPlan(plan);
  if (sorted.length === 0) return false;
  const done = new Set(completedEntryIds ?? []);
  return sorted.every((o) => {
    const m = moduleAtOrder(plan, o);
    return m ? done.has(completionKeyForModule(m)) : false;
  });
}

/**
 * First module in plan sequence (by `order`) whose quiz is not yet passed.
 * Used only as a **suggested** “next” link — trainees may complete modules in any order.
 */
export function getNextRequiredModuleOrder(
  plan: SavedPlanSummary,
  sortedOrders: number[],
  progress: TraineeProgressPayload,
): number | null {
  const done = new Set(progress.completedEntryIds ?? []);
  for (const o of sortedOrders) {
    const m = moduleAtOrder(plan, o);
    if (!m) continue;
    if (!done.has(completionKeyForModule(m))) return o;
  }
  return null;
}

/** Whether the trainee has passed the quiz for this plan step (topic). */
export function isModuleQuizCompleted(
  plan: SavedPlanSummary,
  progress: TraineeProgressPayload,
  moduleOrder: number,
): boolean {
  const m = moduleAtOrder(plan, moduleOrder);
  if (!m) return false;
  return (progress.completedEntryIds ?? []).includes(completionKeyForModule(m));
}

/** Plan modules that share one end-of-topic quiz (any syllabus-cohort track, or a single non-cohort module). */
export function quizCohortPlanModules(plan: SavedPlanSummary, moduleOrder: number): SavedPlanModule[] {
  const mod = moduleAtOrder(plan, moduleOrder);
  if (!mod) return [];
  const syllabusCohortTopicId = linuxSyllabusTopicIdForPlanModule(mod.entryId);
  if (syllabusCohortTopicId === null) return [mod];
  return plan.modules.filter((m) => linuxSyllabusTopicIdForPlanModule(m.entryId) === syllabusCohortTopicId);
}

/**
 * Study step satisfied: explicit mark, or legacy/quiz already passed for this module (counts as done).
 */
export function isModuleStudyMarked(
  plan: SavedPlanSummary,
  progress: TraineeProgressPayload,
  moduleOrder: number,
): boolean {
  if (isModuleQuizCompleted(plan, progress, moduleOrder)) return true;
  const m = moduleAtOrder(plan, moduleOrder);
  if (!m) return false;
  return (progress.studiedEntryIds ?? []).includes(completionKeyForModule(m));
}

/** Every module in the quiz cohort has {@link isModuleStudyMarked} true — required before topic/module quiz. */
export function allQuizCohortStudyMarked(
  plan: SavedPlanSummary,
  progress: TraineeProgressPayload,
  moduleOrder: number,
): boolean {
  return quizCohortPlanModules(plan, moduleOrder).every((m) =>
    isModuleStudyMarked(plan, progress, m.order),
  );
}

/** Distinct module `order` values from the plan, sorted ascending (sequence for the trainee). */
export function getSortedModuleOrdersFromPlan(plan: SavedPlanSummary): number[] {
  return [...new Set(plan.modules.map((m) => m.order))].sort((a, b) => a - b);
}

/** Same module list for progress purposes: `entryId` and `contentId` per slot, in order. */
export function planModuleProgressSyncRowsEqual(a: PlanModuleProgressSyncRow[], b: PlanModuleProgressSyncRow[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].entryId !== b[i].entryId) return false;
    const ca = a[i].contentId?.trim() ?? "";
    const cb = b[i].contentId?.trim() ?? "";
    if (ca !== cb) return false;
  }
  return true;
}

/**
 * Migrates per-trainee quiz completion keys when module list/content ids change.
 * Optional `tx` runs updates inside the same interactive transaction as the plan save.
 */
export async function syncTraineeProgressAfterPlanEntryListChange(
  args: {
    trainingPlanId: string;
    previousModules: PlanModuleProgressSyncRow[];
    nextModules: PlanModuleProgressSyncRow[];
  },
  tx?: Prisma.TransactionClient,
): Promise<void> {
  const { trainingPlanId, previousModules, nextModules } = args;
  if (planModuleProgressSyncRowsEqual(previousModules, nextModules)) {
    return;
  }
  const db = tx ?? prisma;
  const rows = await db.traineePlanProgress.findMany({
    where: { trainingPlanId },
  });
  for (const row of rows) {
    const data = migrateProgressRowForPlanModuleChange(row, previousModules, nextModules);
    await db.traineePlanProgress.update({
      where: { id: row.id },
      data,
    });
  }
}

function migrateProgressRowForPlanModuleChange(
  row: TraineePlanProgress,
  previousModules: PlanModuleProgressSyncRow[],
  nextModules: PlanModuleProgressSyncRow[],
): {
  completedEntryIds: string[];
  highestCompletedOrder: number;
  status: TraineePlanProgressStatus;
} {
  const topicDoneQuiz = completedTopicSetFromRow(row, previousModules);
  const topicDoneStudy = studiedTopicSetFromRow(row, previousModules);
  const quizKeys = completedEntryIdsForModulesFromTopics(topicDoneQuiz, nextModules);
  const studyKeys = studyMarkersForModulesFromTopics(topicDoneStudy, nextModules);
  const completedEntryIds = [...new Set([...quizKeys, ...studyKeys])];

  let max = -1;
  for (const m of nextModules) {
    if (moduleMatchesTopicDone(m, topicDoneQuiz)) {
      max = Math.max(max, m.order);
    }
  }

  const doneKeys = new Set(completedEntryIds);
  const allDone =
    nextModules.length > 0 &&
    nextModules.every((m) =>
      doneKeys.has(
        completionKeyForModule({
          order: m.order,
          entryId: m.entryId || null,
          contentId: m.contentId,
        }),
      ),
    );

  let status: TraineePlanProgressStatus = row.status;
  if (allDone) {
    status = "completed";
  } else if (status === "completed") {
    status = "in_progress";
  } else if (completedEntryIds.length > 0 && status === "not_started") {
    status = "in_progress";
  }

  return {
    completedEntryIds,
    highestCompletedOrder: max,
    status,
  };
}

/** If the plan gained modules after the trainee finished, downgrade DB status from completed → in progress. */
export async function reconcileTraineeProgressWithPlan(
  traineeUserId: string,
  plan: SavedPlanSummary,
  row: TraineePlanProgress,
): Promise<TraineePlanProgress> {
  if (row.status !== "completed") return row;
  const interim = payloadFromRow(plan, row);
  const next = getNextRequiredModuleOrder(plan, getSortedModuleOrdersFromPlan(plan), interim);
  if (next === null) return row;
  return prisma.traineePlanProgress.update({
    where: { id: row.id },
    data: { status: "in_progress" },
  });
}

export async function getTraineePlanProgressPayload(
  traineeUserId: string,
  planId: string,
): Promise<{ plan: SavedPlanSummary; progress: TraineeProgressPayload } | null> {
  const plan = await getAssignedTrainingPlanForTrainee(traineeUserId, planId);
  if (!plan) return null;
  let row = await prisma.traineePlanProgress.findUnique({
    where: {
      userId_trainingPlanId: {
        userId: traineeUserId,
        trainingPlanId: plan.id,
      },
    },
  });
  if (row) {
    row = await scrubStaleHighestCompletedOrderRow(row);
    row = await reconcileTraineeProgressWithPlan(traineeUserId, plan, row);
  }
  return { plan, progress: progressRowToPayload(row, plan) };
}

/**
 * Marks a module complete after the trainee submits that module’s quiz (server-graded).
 * Modules may be completed in any order. Completion is keyed by stable `contentId` when present, else `entryId`.
 */
export async function completeTraineeModuleAfterQuiz(
  traineeUserId: string,
  planId: string,
  moduleOrder: number,
): Promise<
  | { ok: true; plan: SavedPlanSummary; progress: TraineeProgressPayload }
  | { ok: false; error: string }
> {
  const uid = traineeUserId.trim();
  const pid = planId.trim();
  if (!uid || !pid) {
    return { ok: false, error: "Invalid request." };
  }
  if (typeof moduleOrder !== "number" || !Number.isInteger(moduleOrder)) {
    return { ok: false, error: "Module order is required." };
  }

  const planDb = await prisma.trainingPlan.findFirst({
    where: { id: pid, traineeUserId: uid },
    include: {
      exercises: { orderBy: { order: "asc" }, select: { order: true } },
    },
  });
  if (!planDb) {
    return { ok: false, error: "Plan not found or not assigned to you." };
  }

  const orderSet = new Set(planDb.exercises.map((e) => e.order));

  let progress = await prisma.traineePlanProgress.findUnique({
    where: {
      userId_trainingPlanId: {
        userId: uid,
        trainingPlanId: planDb.id,
      },
    },
  });
  if (progress) {
    progress = await scrubStaleHighestCompletedOrderRow(progress);
  }

  const ensureSummary = async (row: TraineePlanProgress | null) => {
    const plan = await getAssignedTrainingPlanForTrainee(uid, planDb.id);
    if (!plan) return { ok: false as const, error: "Could not load plan." };
    return { ok: true as const, plan, progress: progressRowToPayload(row, plan) };
  };

  if (!progress) {
    return { ok: false, error: "Start the plan before completing modules." };
  }
  if (progress.status === "completed") {
    const planEarly = await getAssignedTrainingPlanForTrainee(uid, planDb.id);
    if (planEarly) {
      progress = await reconcileTraineeProgressWithPlan(uid, planEarly, progress);
    }
    if (progress.status === "completed") {
      return { ok: false, error: "Plan is already completed." };
    }
  }
  if (progress.status !== "in_progress" && progress.status !== "paused") {
    return { ok: false, error: "Resume the plan before completing the module quiz." };
  }

  const plan = await getAssignedTrainingPlanForTrainee(uid, planDb.id);
  if (!plan) {
    return { ok: false, error: "Could not load plan." };
  }

  if (!orderSet.has(moduleOrder)) {
    return { ok: false, error: "Invalid module for this plan." };
  }

  const mod = moduleAtOrder(plan, moduleOrder);
  if (!mod) {
    return { ok: false, error: "Module not found on plan." };
  }

  const progressSnapshot = progressRowToPayload(progress, plan);
  if (!allQuizCohortStudyMarked(plan, progressSnapshot, moduleOrder)) {
    return {
      ok: false,
      error:
        "Mark study complete on every plan step for this topic first. The quiz unlocks after all of them.",
    };
  }

  const key = completionKeyForModule(mod);
  const syllabusCohortTopicId = linuxSyllabusTopicIdForPlanModule(mod.entryId);
  const keysToRecord =
    syllabusCohortTopicId !== null
      ? plan.modules
          .filter((m) => linuxSyllabusTopicIdForPlanModule(m.entryId) === syllabusCohortTopicId)
          .map((m) => completionKeyForModule(m))
      : [key];

  const existingIds = storedCompletedEntryIds(progress);
  const priorStored = existingIds.length > 0 ? [...existingIds] : [];

  if (keysToRecord.length > 0 && keysToRecord.every((k) => priorStored.includes(k))) {
    return { ok: false, error: "This quiz was already submitted." };
  }

  const merged = [...new Set([...priorStored, ...keysToRecord])];
  const doneSet = new Set(merged);
  const allDone = allPlanModulesCompleted(plan, merged);
  const newHighest = maxCompletedOrderForKeys(plan, doneSet);

  const row = await prisma.traineePlanProgress.update({
    where: { id: progress.id },
    data: {
      completedEntryIds: merged,
      highestCompletedOrder: newHighest,
      status: allDone ? "completed" : progress.status === "paused" ? "paused" : "in_progress",
    },
  });
  const next = await ensureSummary(row);
  return next.ok ? { ok: true, plan: next.plan, progress: next.progress } : next;
}

/**
 * Records that the trainee finished study/review for one plan module (does not affect quiz completion).
 */
export async function markTraineeModuleStudyComplete(
  traineeUserId: string,
  planId: string,
  moduleOrder: number,
): Promise<
  | { ok: true; plan: SavedPlanSummary; progress: TraineeProgressPayload }
  | { ok: false; error: string }
> {
  const uid = traineeUserId.trim();
  const pid = planId.trim();
  if (!uid || !pid) {
    return { ok: false, error: "Invalid request." };
  }
  if (typeof moduleOrder !== "number" || !Number.isInteger(moduleOrder)) {
    return { ok: false, error: "Module order is required." };
  }

  const planDb = await prisma.trainingPlan.findFirst({
    where: { id: pid, traineeUserId: uid },
    include: {
      exercises: { orderBy: { order: "asc" }, select: { order: true } },
    },
  });
  if (!planDb) {
    return { ok: false, error: "Plan not found or not assigned to you." };
  }

  const orderSet = new Set(planDb.exercises.map((e) => e.order));

  let progress = await prisma.traineePlanProgress.findUnique({
    where: {
      userId_trainingPlanId: {
        userId: uid,
        trainingPlanId: planDb.id,
      },
    },
  });
  if (progress) {
    progress = await scrubStaleHighestCompletedOrderRow(progress);
  }

  const ensureSummary = async (row: TraineePlanProgress | null) => {
    const plan = await getAssignedTrainingPlanForTrainee(uid, planDb.id);
    if (!plan) return { ok: false as const, error: "Could not load plan." };
    return { ok: true as const, plan, progress: progressRowToPayload(row, plan) };
  };

  if (!progress) {
    return { ok: false, error: "Start the plan before marking study complete." };
  }
  if (progress.status !== "in_progress" && progress.status !== "paused") {
    return { ok: false, error: "Start or resume your plan before updating study progress." };
  }

  const plan = await getAssignedTrainingPlanForTrainee(uid, planDb.id);
  if (!plan) {
    return { ok: false, error: "Could not load plan." };
  }

  if (!orderSet.has(moduleOrder)) {
    return { ok: false, error: "Invalid module for this plan." };
  }

  const mod = moduleAtOrder(plan, moduleOrder);
  if (!mod) {
    return { ok: false, error: "Module not found on plan." };
  }

  const studyKey = completionKeyForModule(mod);
  const marker = studyMarkerForModuleCompletionKey(studyKey);
  const prior = storedCompletedEntryIds(progress);
  const merged = [...new Set([...prior, marker])];

  const row = await prisma.traineePlanProgress.update({
    where: { id: progress.id },
    data: { completedEntryIds: merged },
  });
  const next = await ensureSummary(row);
  return next.ok ? { ok: true, plan: next.plan, progress: next.progress } : next;
}

export async function applyTraineePlanAction(
  traineeUserId: string,
  planId: string,
  action: TraineePlanAction,
  moduleOrder?: number,
): Promise<
  | { ok: true; plan: SavedPlanSummary; progress: TraineeProgressPayload }
  | { ok: false; error: string }
> {
  const uid = traineeUserId.trim();
  const pid = planId.trim();
  if (!uid || !pid) {
    return { ok: false, error: "Invalid request." };
  }

  const planDb = await prisma.trainingPlan.findFirst({
    where: { id: pid, traineeUserId: uid },
    include: {
      exercises: { orderBy: { order: "asc" }, select: { order: true } },
    },
  });
  if (!planDb) {
    return { ok: false, error: "Plan not found or not assigned to you." };
  }

  const orderSet = new Set(planDb.exercises.map((e) => e.order));
  const sortedOrders = [...orderSet].sort((a, b) => a - b);

  let progress = await prisma.traineePlanProgress.findUnique({
    where: {
      userId_trainingPlanId: {
        userId: uid,
        trainingPlanId: planDb.id,
      },
    },
  });
  if (progress) {
    progress = await scrubStaleHighestCompletedOrderRow(progress);
  }

  const ensureSummary = async (row: TraineePlanProgress | null) => {
    const plan = await getAssignedTrainingPlanForTrainee(uid, planDb.id);
    if (!plan) return { ok: false as const, error: "Could not load plan." };
    return { ok: true as const, plan, progress: progressRowToPayload(row, plan) };
  };

  // No modules: starting completes the plan immediately.
  if (sortedOrders.length === 0) {
    if (action === "start") {
      const row = await prisma.traineePlanProgress.upsert({
        where: {
          userId_trainingPlanId: { userId: uid, trainingPlanId: planDb.id },
        },
        create: {
          userId: uid,
          trainingPlanId: planDb.id,
          status: "completed",
          highestCompletedOrder: -1,
          completedEntryIds: [],
        },
        update: {
          status: "completed",
          highestCompletedOrder: -1,
          completedEntryIds: [],
        },
      });
      const next = await ensureSummary(row);
      return next.ok ? { ok: true, plan: next.plan, progress: next.progress } : next;
    }
    return { ok: false, error: "This plan has no modules." };
  }

  switch (action) {
    case "start": {
      if (progress?.status === "completed") {
        const plan = await getAssignedTrainingPlanForTrainee(uid, planDb.id);
        if (plan && progress) {
          progress = await reconcileTraineeProgressWithPlan(uid, plan, progress);
        }
        if (progress?.status === "completed") {
          return { ok: false, error: "Plan is already completed." };
        }
      }
      if (!progress) {
        progress = await prisma.traineePlanProgress.create({
          data: {
            userId: uid,
            trainingPlanId: planDb.id,
            status: "in_progress",
            highestCompletedOrder: -1,
            completedEntryIds: [],
          },
        });
      } else if (progress.status === "paused") {
        return { ok: false, error: "Use Resume to continue your plan." };
      } else if (progress.status === "not_started") {
        progress = await prisma.traineePlanProgress.update({
          where: { id: progress.id },
          data: { status: "in_progress" },
        });
      }
      const next = await ensureSummary(progress);
      return next.ok ? { ok: true, plan: next.plan, progress: next.progress } : next;
    }
    case "pause": {
      if (!progress || progress.status !== "in_progress") {
        return { ok: false, error: "You can only pause while the plan is in progress." };
      }
      const row = await prisma.traineePlanProgress.update({
        where: { id: progress.id },
        data: { status: "paused" },
      });
      const next = await ensureSummary(row);
      return next.ok ? { ok: true, plan: next.plan, progress: next.progress } : next;
    }
    case "resume": {
      if (!progress || progress.status !== "paused") {
        return { ok: false, error: "Nothing to resume." };
      }
      const row = await prisma.traineePlanProgress.update({
        where: { id: progress.id },
        data: { status: "in_progress" },
      });
      const next = await ensureSummary(row);
      return next.ok ? { ok: true, plan: next.plan, progress: next.progress } : next;
    }
    case "cancel_pause": {
      if (!progress || progress.status !== "paused") {
        return { ok: false, error: "Nothing to cancel." };
      }
      const plan = await getAssignedTrainingPlanForTrainee(uid, planDb.id);
      const interim = plan ? progressRowToPayload(progress, plan) : progressRowToPayload(progress, null);
      const noCompletionsYet =
        (interim.completedEntryIds ?? []).filter((id) => !isTraineeStudyMarkerEntry(id)).length === 0;
      /** No modules completed yet: drop back to not_started so the trainee can leave the paused attempt. */
      const nextStatus = noCompletionsYet ? "not_started" : "in_progress";
      const row = await prisma.traineePlanProgress.update({
        where: { id: progress.id },
        data: { status: nextStatus },
      });
      const summary = await ensureSummary(row);
      return summary.ok ? { ok: true, plan: summary.plan, progress: summary.progress } : summary;
    }
    case "complete_module": {
      return {
        ok: false,
        error: "Modules are completed after you pass the quiz on the topic quiz page.",
      };
    }
    default:
      return { ok: false, error: "Unknown action." };
  }
}
