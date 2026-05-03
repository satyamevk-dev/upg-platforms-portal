import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { TraineeQuizPageClient } from "@/components/trainee-quiz-page-client";
import { loadTraineeSyllabusCohortTopicQuizPage } from "@/lib/trainee-quiz-page-data";
import { PORTAL_CARD } from "@/lib/portal-ui-classes";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ planId: string; courseSlug: string; topicId: string }> };

export default async function TraineeSyllabusCohortTopicQuizPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/client");
  }
  if (session.user.role !== "trainee") {
    redirect("/dashboard");
  }

  const { planId, courseSlug: courseSlugRaw, topicId: topicRaw } = await params;
  const courseSlug = decodeURIComponent(courseSlugRaw ?? "").trim();
  const topicId = decodeURIComponent(topicRaw ?? "").trim();
  if (!planId?.trim() || !courseSlug || !topicId) {
    notFound();
  }

  const data = await loadTraineeSyllabusCohortTopicQuizPage(session.user.id, planId, courseSlug, topicId);
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
            className="inline-flex items-center gap-2 rounded-xl border border-[#d8d0c4]/90 bg-white/90 px-3 py-2 text-sm font-semibold text-[#00786f] shadow-sm ring-1 ring-black/[0.03] transition hover:border-[#00A89E]/30 hover:bg-[#f0faf8]"
          >
            <span aria-hidden className="text-base leading-none">
              ←
            </span>
            Plan overview
          </Link>
        </nav>
        <div className={PORTAL_CARD}>
          <h1 className="text-xl font-bold text-slate-900">Topic quiz</h1>
          <p className="mt-3 text-sm text-slate-600">Start your plan from the overview before taking a quiz.</p>
          <Link href={back} className="mt-6 inline-flex rounded-xl bg-[#00A89E] px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#008f86]">
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
            className="inline-flex items-center gap-2 rounded-xl border border-[#d8d0c4]/90 bg-white/90 px-3 py-2 text-sm font-semibold text-[#00786f] shadow-sm ring-1 ring-black/[0.03] transition hover:border-[#00A89E]/30 hover:bg-[#f0faf8]"
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
            Mark study complete on <strong className="text-slate-800">every</strong> plan step that shares this syllabus
            topic. The quiz unlocks after all of them.
          </p>
          <Link href={back} className="mt-6 inline-flex rounded-xl bg-[#00A89E] px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#008f86]">
            Back to plan
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
            className="inline-flex items-center gap-2 rounded-xl border border-[#d8d0c4]/90 bg-white/90 px-3 py-2 text-sm font-semibold text-[#00786f] shadow-sm ring-1 ring-black/[0.03] transition hover:border-[#00A89E]/30 hover:bg-[#f0faf8]"
          >
            <span aria-hidden className="text-base leading-none">
              ←
            </span>
            Plan overview
          </Link>
        </nav>
        <div className={PORTAL_CARD}>
          <h1 className="text-xl font-bold text-slate-900">{data.headline}</h1>
          <p className="mt-3 text-sm text-slate-600">You have already passed this topic quiz.</p>
          <Link href={back} className="mt-6 inline-flex rounded-xl border border-[#d6cfc4] bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-[#faf9f7]">
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
          className="inline-flex items-center gap-2 rounded-xl border border-[#d8d0c4]/90 bg-white/90 px-3 py-2 text-sm font-semibold text-[#00786f] shadow-sm ring-1 ring-black/[0.03] transition hover:border-[#00A89E]/30 hover:bg-[#f0faf8]"
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
