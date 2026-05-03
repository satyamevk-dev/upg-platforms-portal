import Link from "next/link";
import { getTrainerClientScope } from "@/lib/trainees-for-trainer";
import { listTrainingPlansForTrainerClient } from "@/lib/training-plans-list";
import type { SavedPlanSummary } from "@/lib/training-plan-summary";
import {
  trainingPlanClientSelectLabel,
  trainingPlanTraineeSelectLabel,
} from "@/lib/training-plan-clients";
import { PORTAL_CARD, PORTAL_TABLE_FRAME, PORTAL_TABLE_HEAD_ROW } from "@/lib/portal-ui-classes";

const cardClass = PORTAL_CARD;

type Props = {
  trainerUserId: string;
  /** Accessible heading id (unique per page). */
  headingId: string;
};

export async function TrainerTrainingPlansBlock({ trainerUserId, headingId }: Props) {
  const scope = await getTrainerClientScope(trainerUserId);
  const clientName = scope.ok ? scope.clientName : null;
  const clientMasterId = scope.ok ? scope.trainerMasterId : null;

  let plans: SavedPlanSummary[] = [];
  let loadError: string | null = null;
  if (scope.ok) {
    try {
      plans = await listTrainingPlansForTrainerClient(trainerUserId);
    } catch (err) {
      console.error("[TrainerTrainingPlansBlock] listTrainingPlansForTrainerClient failed:", err);
      loadError =
        "Could not load training plans. Check the database connection and try again.";
    }
  }

  return (
    <section className={cardClass} aria-labelledby={headingId}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id={headingId} className="text-lg font-semibold text-slate-900">
            Training plans
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Plans for{" "}
            {clientName ? (
              <span className="font-medium text-slate-800">{clientName}</span>
            ) : (
              "your assigned client"
            )}
            . Create and edit plans that trainees on this client will see.
          </p>
        </div>
        {clientMasterId ? (
          <Link
            href={`/trainer/training-plans/new?client=${encodeURIComponent(clientMasterId)}`}
            className="rounded-xl bg-[#00A89E] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#00A89E]/20 hover:bg-[#008f86]"
          >
            Create plan
          </Link>
        ) : null}
      </div>
      {!clientMasterId ? (
        <p className="mt-4 text-sm text-slate-600">
          No client is assigned to your trainer account, so you cannot manage plans. Ask a platform owner
          to set your client mapping.
        </p>
      ) : loadError ? (
        <p className="mt-4 text-sm text-rose-700" role="alert">
          {loadError}
        </p>
      ) : plans.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">No training plans yet for this client.</p>
      ) : (
        <div className={`mt-4 ${PORTAL_TABLE_FRAME}`}>
          <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
            <thead>
              <tr className={PORTAL_TABLE_HEAD_ROW}>
                <th className="px-4 py-3 font-semibold text-slate-800">Title</th>
                <th className="px-4 py-3 font-semibold text-slate-800">Client</th>
                <th className="px-4 py-3 font-semibold text-slate-800">Trainee</th>
                <th className="px-4 py-3 font-semibold text-slate-800">Updated</th>
                <th className="px-4 py-3 font-semibold text-slate-800">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d8d0c4]">
              {plans.map((p) => {
                const updated = new Date(p.updatedAt);
                return (
                  <tr key={p.id} className="text-slate-700">
                    <td className="px-4 py-3 font-medium text-slate-900">{p.title}</td>
                    <td className="px-4 py-3">{trainingPlanClientSelectLabel(p.client)}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {p.trainee ? trainingPlanTraineeSelectLabel(p.trainee) : "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {updated.toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/trainer/training-plans/${encodeURIComponent(p.id)}/edit`}
                        className="font-medium text-[#00786f] underline-offset-2 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
