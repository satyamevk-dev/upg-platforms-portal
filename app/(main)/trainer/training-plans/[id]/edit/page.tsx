import ExerciseProgressChart from "@/app/components/exercise-progress-chart";
import { getServerSession } from "next-auth/next";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { getTrainingPlanForTrainerEdit, listTrainingPlansForTrainerClient } from "@/lib/training-plans-list";
import { PORTAL_INTRO_HERO, PORTAL_INTRO_SHELL } from "@/lib/portal-ui-classes";
import { TrainingPlanBuilderSection } from "../../new/training-plan-builder-section";

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

type Props = { params: Promise<{ id: string }> };

export default async function EditTrainingPlanPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "trainer" || !session.user.id) {
    redirect("/dashboard");
  }

  const { id } = await params;
  if (!id?.trim()) {
    notFound();
  }

  const plan = await getTrainingPlanForTrainerEdit(id, session.user.id);
  if (!plan) {
    notFound();
  }

  const initialSavedPlans = await listTrainingPlansForTrainerClient(session.user.id);

  return (
    <>
      <header className={PORTAL_INTRO_SHELL}>
        <div className={PORTAL_INTRO_HERO}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b23d1e]">Trainer tools</p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Edit training plan</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Update the title, notes, or module order for this plan. The client cannot be changed here.
          </p>
        </div>
      </header>

      <TrainingPlanBuilderSection
        key={plan.id}
        initialSavedPlans={initialSavedPlans}
        editingPlan={plan}
        savedPlansScope="trainer-client"
      />

      <ExerciseProgressChart exerciseName="Linux basics — module progress" data={exerciseProgressData} />
    </>
  );
}
