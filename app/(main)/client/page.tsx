import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { TraineeAssignedPlansSection } from "@/components/trainee-assigned-plans-section";
import { PORTAL_INTRO_HERO, PORTAL_INTRO_SHELL } from "@/lib/portal-ui-classes";

export const dynamic = "force-dynamic";

export default async function ClientHomePage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const userId = session?.user?.id;
  if (role === "super_admin") {
    redirect("/");
  }
  if (role === "trainer") {
    redirect("/trainer");
  }

  return (
    <>
      <div className={PORTAL_INTRO_SHELL}>
        <div className={PORTAL_INTRO_HERO}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b23d1e]">Trainee portal</p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Trainee area</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            You are signed in with the Trainee role. Trainer-only pages are restricted by role.
          </p>
        </div>
      </div>

      {role === "trainee" && userId ? (
        <TraineeAssignedPlansSection
          traineeUserId={userId}
          headingId="client-page-trainee-assigned-plans-heading"
        />
      ) : null}
    </>
  );
}
