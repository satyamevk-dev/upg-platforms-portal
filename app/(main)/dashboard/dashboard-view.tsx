import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { TrainerTrainingPlansBlock } from "@/components/trainer-training-plans-block";
import { TraineeTrainingProgressChart } from "@/components/trainee-training-progress-chart";
import { getDashboardAnalytics } from "@/lib/dashboard-analytics";
import { getTraineePlanProgressChartData } from "@/lib/trainee-dashboard-training-progress";
import { getTraineesForTrainer, type TraineeRow } from "@/lib/trainees-for-trainer";
import { DashboardAnalyticsCharts } from "./dashboard-analytics-charts";
import { PORTAL_CARD, PORTAL_TABLE_FRAME, PORTAL_TABLE_HEAD_ROW } from "@/lib/portal-ui-classes";

function roleLabel(role: string) {
  switch (role) {
    case "super_admin":
      return "Platform Owner";
    case "trainer":
      return "Trainer";
    case "trainee":
      return "Trainee";
    default:
      return "Trainee";
  }
}

const cardClass = PORTAL_CARD;

type Props = {
  callbackPath: string;
};

export async function DashboardView({ callbackPath }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackPath)}`);
  }

  const { user } = session;
  const role = user.role ?? "trainee";
  const canTrainer = role === "trainer" || role === "super_admin";
  const analytics = canTrainer
    ? await getDashboardAnalytics(
        role === "trainer" && user.id ? { trainerUserId: user.id } : undefined,
      )
    : null;

  let trainerTrainees: TraineeRow[] = [];
  let trainerTraineesError: string | null = null;
  let trainerHasClientForRoster = false;
  let trainerMappedClientName: string | null = null;

  if (role === "trainer" && user.id) {
    try {
      const roster = await getTraineesForTrainer(user.id);
      trainerTrainees = roster.trainees;
      trainerHasClientForRoster = roster.trainerHasClient;
      trainerMappedClientName = roster.mappedClientName;
    } catch (err) {
      console.error("[dashboard] getTraineesForTrainer failed:", err);
      trainerTraineesError =
        "Could not load trainees. Check the database connection and try again.";
    }
  }

  let traineeProgressRows: Awaited<ReturnType<typeof getTraineePlanProgressChartData>> = [];
  let traineeProgressError: string | null = null;
  if (role === "trainee" && user.id) {
    try {
      traineeProgressRows = await getTraineePlanProgressChartData(user.id);
    } catch (err) {
      console.error("[dashboard] getTraineePlanProgressChartData failed:", err);
      traineeProgressError = "Could not load training progress. Try again later.";
    }
  }

  return (
    <>
      <header className={`flex flex-col gap-4 ${cardClass}`}>
          <div>
            <p className="text-center text-sm font-semibold leading-snug text-[#F46036]">
              Welcome to Knowledge Platform - Unified Platform Group
              {trainerMappedClientName &&
              trainerMappedClientName.trim().toLowerCase() !== "avaya" ? (
                <> {trainerMappedClientName}</>
              ) : null}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-2 text-slate-600">
              Signed in as{" "}
              <span className="font-medium text-slate-900">{user.name ?? user.email}</span>
            </p>
            <p className="mt-1 text-sm text-slate-500">{user.email}</p>
            <span className="mt-3 inline-flex rounded-full bg-[#ECFBFA] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#177F78]">
              {roleLabel(role)}
            </span>
          </div>
        </header>

        {role === "trainer" ? (
          <section className={cardClass} aria-labelledby="dashboard-trainer-trainees-heading">
            <h2 id="dashboard-trainer-trainees-heading" className="text-lg font-semibold text-slate-900">
              Your trainees
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Trainee accounts linked to the same client master as your trainer profile.
            </p>
            {trainerTraineesError ? (
              <p className="mt-4 text-sm text-rose-700" role="alert">
                {trainerTraineesError}
              </p>
            ) : !trainerHasClientForRoster ? (
              <p className="mt-4 text-sm text-slate-600">
                No client is assigned to your trainer account, so trainees cannot be matched. Ask a
                platform owner to set your client mapping.
              </p>
            ) : trainerTrainees.length === 0 ? (
              <p className="mt-4 text-sm text-slate-600">
                No trainees are registered for your client yet.
              </p>
            ) : (
              <div className={`mt-4 ${PORTAL_TABLE_FRAME}`}>
                <table className="w-full max-w-2xl border-collapse text-left text-sm">
                  <thead>
                    <tr className={PORTAL_TABLE_HEAD_ROW}>
                      <th className="px-4 py-3 font-semibold text-slate-800">Name</th>
                      <th className="px-4 py-3 font-semibold text-slate-800">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D0D3E7]">
                    {trainerTrainees.map((t) => (
                      <tr key={t.id} className="text-slate-700">
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {t.name?.trim() || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <code className="rounded bg-[#F7F7FF] px-1.5 py-0.5 text-xs text-slate-800">
                            {t.email}
                          </code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : null}

        {role === "trainer" && user.id ? (
          <TrainerTrainingPlansBlock
            trainerUserId={user.id}
            headingId="dashboard-trainer-plans-heading"
          />
        ) : null}

        {role === "trainee" ? (
          <section
            className={cardClass}
            aria-labelledby="dashboard-trainee-progress-heading"
          >
            {traineeProgressError ? (
              <p className="text-sm text-rose-700" role="alert">
                {traineeProgressError}
              </p>
            ) : (
              <TraineeTrainingProgressChart rows={traineeProgressRows} />
            )}
          </section>
        ) : null}

        {canTrainer ? (
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
            {analytics ? (
              <DashboardAnalyticsCharts data={analytics} />
            ) : (
              <div className={cardClass}>
                <p className="text-sm text-slate-600">
                  Analytics could not be loaded. Check that the database is running and{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">DATABASE_URL</code> is
                  set correctly.
                </p>
              </div>
            )}
          </section>
        ) : null}
    </>
  );
}
