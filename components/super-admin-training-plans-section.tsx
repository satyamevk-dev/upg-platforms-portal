import { listTrainingPlansForTrainer } from "@/lib/training-plans-list";
import {
  trainingPlanClientSelectLabel,
  trainingPlanTraineeSelectLabel,
} from "@/lib/training-plan-clients";
import { PORTAL_CARD, PORTAL_TABLE_FRAME, PORTAL_TABLE_HEAD_ROW } from "@/lib/portal-ui-classes";

const cardClass = PORTAL_CARD;

type Props = {
  headingId: string;
};

/** Read-only listing of every training plan (platform owner). */
export async function SuperAdminTrainingPlansSection({ headingId }: Props) {
  let loadError: string | null = null;
  let plans: Awaited<ReturnType<typeof listTrainingPlansForTrainer>> = [];
  try {
    plans = await listTrainingPlansForTrainer();
  } catch (err) {
    console.error("[SuperAdminTrainingPlansSection] listTrainingPlansForTrainer failed:", err);
    loadError =
      "Could not load training plans. Check the database connection and try again.";
  }

  return (
    <section className={cardClass} aria-labelledby={headingId}>
      <div>
        <h2 id={headingId} className="text-lg font-semibold text-slate-900">
          Training plans
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          All plans in the system across clients. Editing is done by trainer accounts from the plan builder.
        </p>
      </div>
      {loadError ? (
        <p className="mt-4 text-sm text-rose-700" role="alert">
          {loadError}
        </p>
      ) : plans.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">No training plans yet.</p>
      ) : (
        <div className={`mt-4 ${PORTAL_TABLE_FRAME}`}>
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead>
              <tr className={PORTAL_TABLE_HEAD_ROW}>
                <th className="px-4 py-3 font-semibold text-slate-800">Title</th>
                <th className="px-4 py-3 font-semibold text-slate-800">Client</th>
                <th className="px-4 py-3 font-semibold text-slate-800">Trainee</th>
                <th className="px-4 py-3 font-semibold text-slate-800">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-800">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D0D3E7]">
              {plans.map((p) => {
                const updated = new Date(p.updatedAt);
                return (
                  <tr key={p.id} className="text-slate-700">
                    <td className="px-4 py-3 font-medium text-slate-900">{p.title}</td>
                    <td className="px-4 py-3">{trainingPlanClientSelectLabel(p.client)}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {p.trainee ? trainingPlanTraineeSelectLabel(p.trainee) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {p.isDraft ? (
                        <span className="rounded-full bg-[#ECFBFA] px-2 py-0.5 text-xs font-semibold text-[#177F78]">
                          Draft
                        </span>
                      ) : (
                        <span className="rounded-full bg-[#ECFBFA] px-2 py-0.5 text-xs font-semibold text-[#b23d1e]">
                          Published
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {updated.toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
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
