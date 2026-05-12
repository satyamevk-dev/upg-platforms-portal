import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { TraineeQuizPageClient } from "@/components/trainee-quiz-page-client";
import { loadTraineeModuleQuizPage } from "@/lib/trainee-quiz-page-data";
import { PORTAL_CARD } from "@/lib/portal-ui-classes";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ planId: string; order: string }> };

export default async function TraineeModuleQuizPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/client");
  }
  if (session.user.role !== "trainee") {
    redirect("/dashboard");
  }

  const { planId, order: orderRaw } = await params;
  const moduleOrder = Number.parseInt(orderRaw ?? "", 10);
  if (!planId?.trim() || !Number.isFinite(moduleOrder) || !Number.isInteger(moduleOrder)) {
    notFound();
  }

  const data = await loadTraineeModuleQuizPage(session.user.id, planId, moduleOrder);
  if (!data) {
    notFound();
  }

  const back = `/client/plans/${encodeURIComponent(planId)}`;

  if (data.access === "start_plan_first") {
    return (
      <>
        <nav className="-mt-2 mb-6" aria-label="Breadcrumb">
          <Link
            href={back}
            className="inline-flex items-center gap-2 rounded-xl border border-[#D0D3E7]/90 bg-white/90 px-3 py-2 text-sm font-semibold text-[#b23d1e] shadow-sm ring-1 ring-black/[0.03] transition hover:border-[#F46036]/30 hover:bg-[#ECFBFA]"
          >
            <span aria-hidden className="text-base leading-none">
              ←
            </span>
            Plan overview
          </Link>
        </nav>
        <div className={PORTAL_CARD}>
          <h1 className="text-xl font-bold text-slate-900">Module quiz</h1>
          <p className="mt-3 text-sm text-slate-600">Start your plan from the overview before taking a quiz.</p>
          <Link href={back} className="mt-6 inline-flex rounded-xl bg-[#F46036] px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#d44a20]">
            Go to plan overview
          </Link>
        </div>
      </>
    );
  }

  if (data.access === "need_study") {
    return (
      <>
        <nav className="-mt-2 mb-6" aria-label="Breadcrumb">
          <Link
            href={back}
            className="inline-flex items-center gap-2 rounded-xl border border-[#D0D3E7]/90 bg-white/90 px-3 py-2 text-sm font-semibold text-[#b23d1e] shadow-sm ring-1 ring-black/[0.03] transition hover:border-[#F46036]/30 hover:bg-[#ECFBFA]"
          >
            <span aria-hidden className="text-base leading-none">
              ←
            </span>
            Plan overview
          </Link>
        </nav>
        <div className={PORTAL_CARD}>
          <h1 className="text-xl font-bold text-slate-900">{data.headline}</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Open this module&apos;s study page and choose <strong className="text-slate-800">Mark study complete</strong>{" "}
            before the quiz.
          </p>
          <Link
            href={`/client/plans/${encodeURIComponent(planId)}/module/${encodeURIComponent(String(moduleOrder))}`}
            className="mt-6 inline-flex rounded-xl bg-[#F46036] px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#d44a20]"
          >
            Open study
          </Link>
        </div>
      </>
    );
  }

  if (data.access === "already_passed") {
    return (
      <>
        <nav className="-mt-2 mb-6" aria-label="Breadcrumb">
          <Link
            href={back}
            className="inline-flex items-center gap-2 rounded-xl border border-[#D0D3E7]/90 bg-white/90 px-3 py-2 text-sm font-semibold text-[#b23d1e] shadow-sm ring-1 ring-black/[0.03] transition hover:border-[#F46036]/30 hover:bg-[#ECFBFA]"
          >
            <span aria-hidden className="text-base leading-none">
              ←
            </span>
            Plan overview
          </Link>
        </nav>
        <div className={PORTAL_CARD}>
          <h1 className="text-xl font-bold text-slate-900">{data.headline}</h1>
          <p className="mt-3 text-sm text-slate-600">You have already passed this quiz.</p>
          <Link href={back} className="mt-6 inline-flex rounded-xl border border-[#D0D3E7] bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-[#F7F7FF]">
            Back to plan
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <nav className="-mt-2 mb-6" aria-label="Breadcrumb">
        <Link
          href={back}
          className="inline-flex items-center gap-2 rounded-xl border border-[#D0D3E7]/90 bg-white/90 px-3 py-2 text-sm font-semibold text-[#b23d1e] shadow-sm ring-1 ring-black/[0.03] transition hover:border-[#F46036]/30 hover:bg-[#ECFBFA]"
        >
          <span aria-hidden className="text-base leading-none">
            ←
          </span>
          Plan overview
        </Link>
      </nav>
      <TraineeQuizPageClient
        planId={data.plan.id}
        headline={data.headline}
        quizQuestions={data.quizQuestions}
        submitPath={data.submitPath}
        moduleOrder={data.moduleOrder}
      />
    </>
  );
}
