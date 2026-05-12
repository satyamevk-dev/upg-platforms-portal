import Link from "next/link";
import { SavedPlanCollapsible } from "@/components/saved-plan-collapsible";
import { listTrainingPlansAssignedToTrainee } from "@/lib/training-plans-list";
import { PORTAL_CARD } from "@/lib/portal-ui-classes";

const cardClass = PORTAL_CARD;

type Props = {
  traineeUserId: string;
  headingId: string;
};

/** Plans where `traineeUserId` matches the signed-in trainee (explicit assignment). */
export async function TraineeAssignedPlansSection({ traineeUserId, headingId }: Props) {
  let loadError: string | null = null;
  let plans: Awaited<ReturnType<typeof listTrainingPlansAssignedToTrainee>> = [];
  try {
    plans = await listTrainingPlansAssignedToTrainee(traineeUserId);
  } catch (err) {
    console.error("[TraineeAssignedPlansSection] listTrainingPlansAssignedToTrainee failed:", err);
    loadError =
      "Could not load your training plans. Check the database connection and try again.";
  }

  const clientLabel = (name: string | null, email: string) => name?.trim() || email;

  return (
    <section className={cardClass} aria-labelledby={headingId}>
      <h2 id={headingId} className="text-lg font-semibold text-slate-900">
        Your assigned training plans
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Plans your trainer linked specifically to you. Other plans for your organization may exist but
        only assigned plans appear here.
      </p>
      {loadError ? (
        <p className="mt-4 text-sm text-rose-700" role="alert">
          {loadError}
        </p>
      ) : plans.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">
          No training plan is assigned to you yet. When a trainer assigns a plan to your account, it will
          show up here.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {plans.map((plan) => {
            const updated = new Date(plan.updatedAt);
            return (
              <li key={plan.id} className="list-none">
                <SavedPlanCollapsible
                  summary={
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-semibold text-slate-900">{plan.title}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          <span className="font-medium text-slate-700">Client:</span>{" "}
                          {clientLabel(plan.client.name, plan.client.email)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {plan.modules.length} module(s) — expand for description and outline.
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <Link
                          href={`/client/plans/${encodeURIComponent(plan.id)}`}
                          className="rounded-lg bg-[#F46036] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#d44a20]"
                        >
                          Open plan
                        </Link>
                        {plan.isDraft ? (
                          <span className="rounded-full bg-[#ECFBFA] px-2.5 py-0.5 text-xs font-semibold text-[#177F78]">
                            Draft
                          </span>
                        ) : (
                          <span className="rounded-full bg-[#ECFBFA] px-2.5 py-0.5 text-xs font-semibold text-[#b23d1e]">
                            Published
                          </span>
                        )}
                        <span className="text-xs text-slate-500">
                          Updated{" "}
                          {updated.toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
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
                      {plan.modules.slice(0, 12).map((m) => (
                        <li
                          key={`${plan.id}-${m.order}`}
                          className="rounded-lg border border-[#D0D3E7] bg-white px-3 py-2"
                        >
                          {m.sectionHeader ? (
                            <p className="mb-0.5 text-[11px] font-semibold leading-snug text-[#b23d1e]">
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
                    {plan.modules.length > 12 ? (
                      <p className="mt-2 text-xs text-slate-500">
                        +{plan.modules.length - 12} more module
                        {plan.modules.length - 12 === 1 ? "" : "s"}
                      </p>
                    ) : null}
                  </div>
                </SavedPlanCollapsible>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
