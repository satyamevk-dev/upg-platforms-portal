import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

/** User list and session-backed content must reflect DB after admin edits (avoid stale RSC cache). */
export const dynamic = "force-dynamic";
import {
  listTrainingPlansForClientUser,
  listTrainingPlansForTrainer,
  listTrainingPlansForTrainerClient,
} from "@/lib/training-plans-list";
import type { SavedPlanSummary } from "@/lib/training-plan-summary";
import { ClientMastersPanel } from "@/components/client-masters-panel";
import { PortalUsersPanel } from "@/components/portal-users-panel";
import { listPortalUsers, type PortalUserRow } from "@/lib/portal-users-list";
import { getPlatformOwnerEmail } from "@/lib/platform-owner";
import { prisma } from "@/lib/prisma";
import { trainerTraineeCountByClientMasterId } from "@/lib/client-master-trainer-trainee-counts";
import { sortMasterClients } from "@/lib/training-plan-clients";
import { SavedPlanCollapsible } from "@/components/saved-plan-collapsible";
import { PORTAL_CARD } from "@/lib/portal-ui-classes";

const cardClass = PORTAL_CARD;

async function loadPlansForHome(): Promise<{
  plans: SavedPlanSummary[];
  loadError: string | null;
  role: string | null;
  isSignedIn: boolean;
}> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { plans: [], loadError: null, role: null, isSignedIn: false };
  }
  const role = session.user.role ?? null;
  try {
    if (role === "trainer") {
      const plans = await listTrainingPlansForTrainerClient(session.user.id);
      return { plans, loadError: null, role, isSignedIn: true };
    }
    if (role === "super_admin") {
      const plans = await listTrainingPlansForTrainer();
      return { plans, loadError: null, role, isSignedIn: true };
    }
    if (role === "trainee") {
      const plans = await listTrainingPlansForClientUser(session.user.id);
      return { plans, loadError: null, role, isSignedIn: true };
    }
  } catch {
    try {
      await prisma.trainingPlan.count();
      return { plans: [], loadError: null, role, isSignedIn: true };
    } catch {
      return {
        plans: [],
        loadError: "Could not load training plans. Check the database connection and try again.",
        role,
        isSignedIn: true,
      };
    }
  }
  return { plans: [], loadError: null, role, isSignedIn: true };
}

export default async function Home() {
  const { plans, loadError, role, isSignedIn } = await loadPlansForHome();

  let portalUsers: PortalUserRow[] = [];
  let usersLoadError: string | null = null;
  let clientMastersForAdmin: { id: string; name: string; linkedTrainerTraineeCount: number }[] = [];
  if (isSignedIn && role === "super_admin") {
    try {
      portalUsers = await listPortalUsers();
    } catch (err) {
      console.error("[home] listPortalUsers failed:", err);
      usersLoadError =
        "Could not load users from the database. Check the database connection and try again.";
    }
    try {
      const [masters, linkCounts] = await Promise.all([
        prisma.clientMaster.findMany({ select: { id: true, name: true } }),
        trainerTraineeCountByClientMasterId(),
      ]);
      clientMastersForAdmin = sortMasterClients(masters).map((m) => ({
        ...m,
        linkedTrainerTraineeCount: linkCounts.get(m.id) ?? 0,
      }));
    } catch (err) {
      console.error("[home] clientMaster list failed:", err);
    }
  }

  return (
    <div className="flex flex-1 flex-col p-6 sm:p-10">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        {role === "super_admin" ? (
          <section
            className={cardClass}
            aria-labelledby="home-welcome-heading manage-users-heading"
          >
            <h1
              id="home-welcome-heading"
              className="text-center text-2xl font-bold tracking-tight text-[#F46036] sm:text-3xl"
            >
              Welcome to Knowledge Platform - Unified Platform Group
            </h1>
            <h2 id="manage-users-heading" className="mt-6 text-lg font-semibold text-slate-900">
              Manage portal users
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Add users, edit roles, or remove accounts (platform owner account is protected).
            </p>
            {usersLoadError ? (
              <p className="mt-4 text-sm text-rose-700" role="alert">
                {usersLoadError}
              </p>
            ) : (
              <div className="mt-4">
                <PortalUsersPanel
                  platformOwnerEmail={getPlatformOwnerEmail()}
                  initialUsers={portalUsers.map((u) => ({
                    id: u.id,
                    email: u.email,
                    name: u.name,
                    role: u.role,
                    mappedClient: u.mappedClient,
                    hasPassword: u.hasPassword,
                    createdAt: u.createdAt.toISOString(),
                    updatedAt: u.updatedAt.toISOString(),
                  }))}
                />
              </div>
            )}
          </section>
        ) : null}

        {role === "super_admin" ? (
          <section className={cardClass} aria-labelledby="client-masters-heading">
            <h2 id="client-masters-heading" className="text-lg font-semibold text-slate-900">
              Client masters
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Add clients or rename them when no trainers or trainees are mapped to that client (reassign
              them in Manage portal users first). Each name must be unique.
            </p>
            <ClientMastersPanel initialMasters={clientMastersForAdmin} />
          </section>
        ) : null}

        <section className={cardClass} aria-labelledby="plans-list-heading">
          <h2 id="plans-list-heading" className="text-lg font-semibold text-slate-900">
            {isSignedIn ? "Plans in the system" : "Training plans"}
          </h2>

          {loadError && !(isSignedIn && plans.length === 0) ? (
            <p className="mt-4 text-sm text-rose-700" role="alert">
              {loadError}
            </p>
          ) : null}

          {!isSignedIn ? (
            <p className="mt-4 text-sm text-slate-600">
              Saved plans are available after you sign in.{" "}
              <Link href="/login" className="font-medium text-[#b23d1e] underline underline-offset-2">
                Go to login
              </Link>
              .
            </p>
          ) : null}

          {isSignedIn && plans.length === 0 ? (
            <p className="mt-4 text-sm font-medium text-slate-700">None</p>
          ) : null}

          {plans.length > 0 ? (
            <ul className="mt-6 space-y-4">
              {plans.map((plan) => {
                const clientLabel = plan.client.name?.trim() || plan.client.email;
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
                              <span className="text-slate-600">{plan.modules.length} module(s)</span>
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              Click to expand description and module list.
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-wrap items-center gap-2">
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
                          {plan.modules.slice(0, 8).map((m) => (
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
                        {plan.modules.length > 8 ? (
                          <p className="mt-2 text-xs text-slate-500">
                            +{plan.modules.length - 8} more module
                            {plan.modules.length - 8 === 1 ? "" : "s"}
                          </p>
                        ) : null}
                      </div>
                    </SavedPlanCollapsible>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </section>
      </main>
    </div>
  );
}
