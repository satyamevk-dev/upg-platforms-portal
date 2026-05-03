import ExerciseProgressChart from "@/app/components/exercise-progress-chart";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { getTrainerClientScope } from "@/lib/trainees-for-trainer";
import { listTrainingPlansForTrainerClient } from "@/lib/training-plans-list";
import { PORTAL_INTRO_HERO, PORTAL_INTRO_SHELL } from "@/lib/portal-ui-classes";
import { TrainingPlanBuilderSection } from "./training-plan-builder-section";

const exerciseProgressData = [
  { date: "Apr 01", score: 8 },
  { date: "Apr 05", score: 10 },
  { date: "Apr 09", score: 11 },
  { date: "Apr 13", score: 12 },
  { date: "Apr 17", score: 14 },
  { date: "Apr 21", score: 15 },
  { date: "Apr 25", score: 17 },
];

export const dynamic = "force-dynamic";

export default async function WorkoutBuilderPage({
  searchParams,
}: {
  searchParams?: Promise<{ client?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "trainer" || !session.user.id) {
    redirect("/dashboard");
  }

  const sp = searchParams ? await searchParams : {};
  const rawClient = typeof sp.client === "string" ? sp.client.trim() : "";
  const scope = await getTrainerClientScope(session.user.id);
  let defaultClientMasterId: string | null = null;
  if (scope.ok && rawClient && rawClient === scope.trainerMasterId) {
    defaultClientMasterId = rawClient;
  }

  const initialSavedPlans = await listTrainingPlansForTrainerClient(session.user.id);

  return (
    <>
      <header className={PORTAL_INTRO_SHELL}>
        <div className={PORTAL_INTRO_HERO}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#00786f]">Trainer tools</p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Training plan builder
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Pick a client and build a plan from any mix of modules. Open <span className="font-medium">LINUX</span>,{" "}
            <span className="font-medium">Networking</span>, <span className="font-medium">Avaya AOC</span>,{" "}
            <span className="font-medium">Avaya AOC Solution Lifecycle</span>, or{" "}
            <span className="font-medium">Avaya AOC Platform Tools & Automation</span>. Use section and row checkboxes to
            add whole topics to the plan. All blocks are optional.
          </p>
        </div>
      </header>

      <TrainingPlanBuilderSection
        key={`new-${defaultClientMasterId ?? ""}`}
        initialSavedPlans={initialSavedPlans}
        defaultClientMasterId={defaultClientMasterId}
        savedPlansScope="trainer-client"
      />

      <ExerciseProgressChart exerciseName="Linux basics — module progress" data={exerciseProgressData} />
    </>
  );
}
