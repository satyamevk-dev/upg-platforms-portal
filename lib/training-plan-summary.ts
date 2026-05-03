import { masterClientForPortalResponse } from "@/lib/map-master-client-for-portal";
import { parseExerciseDetailsJson } from "@/lib/exercise-details-json";

export type SavedPlanModule = {
  order: number;
  title: string;
  subtitle: string;
  sectionHeader: string | null;
  entryId: string | null;
  /** Stable slot id from exercise JSON; drives quiz completion key when set. */
  contentId: string | null;
};

export type SavedPlanTrainee = {
  id: string;
  name: string | null;
  email: string;
};

export type SavedPlanSummary = {
  id: string;
  title: string;
  description: string | null;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  client: { id: string; name: string | null; email: string };
  /** When set, the plan is assigned to this trainee; otherwise visible to all trainees of the client. */
  trainee: SavedPlanTrainee | null;
  modules: SavedPlanModule[];
};

type ExerciseRow = { name: string; details: string | null; order: number };

export function mapSavedExercise(e: ExerciseRow): SavedPlanModule {
  const p = parseExerciseDetailsJson(e.details);
  const entryId = typeof p.entryId === "string" ? p.entryId : null;
  const contentRaw = typeof p.contentId === "string" ? p.contentId.trim() : "";
  return {
    order: e.order,
    title: e.name,
    subtitle: typeof p.subtitle === "string" ? p.subtitle : "",
    sectionHeader: p.sectionHeader ?? null,
    entryId,
    contentId: contentRaw || null,
  };
}

/** Row shape expected by {@link toSavedPlanSummary} (Prisma result + optional trainee hydration). */
export type TrainingPlanSummarySourceRow = {
  id: string;
  title: string;
  description: string | null;
  isDraft: boolean;
  createdAt: Date;
  updatedAt: Date;
  clientMaster: { id: string; name: string };
  traineeUser: { id: string; name: string | null; email: string } | null;
  exercises: ExerciseRow[];
};

export function toSavedPlanSummary(p: TrainingPlanSummarySourceRow): SavedPlanSummary {
  const client = masterClientForPortalResponse(p.clientMaster);
  if (!client) {
    throw new Error(`Training plan ${p.id} is missing client master`);
  }
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    isDraft: p.isDraft,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    client,
    trainee: p.traineeUser
      ? {
          id: p.traineeUser.id,
          name: p.traineeUser.name,
          email: p.traineeUser.email,
        }
      : null,
    modules: p.exercises.map(mapSavedExercise),
  };
}
