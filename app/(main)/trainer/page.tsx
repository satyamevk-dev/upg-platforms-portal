import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { SuperAdminTrainingPlansSection } from "@/components/super-admin-training-plans-section";
import { TrainerTrainingPlansBlock } from "@/components/trainer-training-plans-block";
import { TrainersByClientSection } from "@/components/trainers-by-client-section";
import type { TrainersByClientList } from "@/lib/trainers-by-client";
import { listTrainersAssignedByClient } from "@/lib/trainers-by-client";
import { PORTAL_INTRO_HERO, PORTAL_INTRO_SHELL } from "@/lib/portal-ui-classes";

export const dynamic = "force-dynamic";

export default async function TrainerHomePage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const isTrainer = role === "trainer";
  const isSuperAdmin = role === "super_admin";
  const userId = session?.user?.id;

  let trainersByClient: TrainersByClientList | null = null;
  let trainersByClientError: string | null = null;
  if (isSuperAdmin) {
    try {
      trainersByClient = await listTrainersAssignedByClient();
    } catch (err) {
      console.error("[trainer page] listTrainersAssignedByClient failed:", err);
      trainersByClientError =
        "Could not load trainers by client. Check the database connection and try again.";
    }
  }

  return (
    <>
      <div className={PORTAL_INTRO_SHELL}>
        <div className={PORTAL_INTRO_HERO}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b23d1e]">Trainer area</p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Trainer workspace</h1>
          {isTrainer ? (
            <>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                View plans for your assigned client, or open the builder to create a new one.
              </p>
              <Link
                href="/trainer/training-plans/new"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F46036] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#F46036]/25 transition hover:bg-[#d44a20]"
              >
                Open plan builder
                <span aria-hidden className="text-base leading-none">
                  →
                </span>
              </Link>
            </>
          ) : isSuperAdmin ? (
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Review trainer accounts mapped to each client below. Training plans are created by users with the Trainer
              role from their own workspace.
            </p>
          ) : (
            <p className="mt-2 text-sm text-slate-600">
              New training plans can only be created by accounts with the Trainer role.
            </p>
          )}
        </div>
      </div>

      {isSuperAdmin ? (
        <>
          <TrainersByClientSection
            data={trainersByClient}
            error={trainersByClientError}
            headingId="trainer-page-trainers-by-client-heading"
          />
          <SuperAdminTrainingPlansSection headingId="trainer-page-all-plans-heading" />
        </>
      ) : null}

      {isTrainer && userId ? (
        <TrainerTrainingPlansBlock trainerUserId={userId} headingId="trainer-home-plans-heading" />
      ) : null}
    </>
  );
}
