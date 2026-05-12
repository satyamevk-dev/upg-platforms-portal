import { TraineeModuleStudy } from "@/components/trainee-module-study";
import { loadTraineeModulePageData } from "@/lib/trainee-module-page-data";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/auth";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ planId: string; order: string }> };

export default async function TraineeModulePage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/client");
  }
  if (session.user.role !== "trainee") {
    redirect("/dashboard");
  }

  const { planId, order: orderRaw } = await params;
  const order = Number.parseInt(orderRaw ?? "", 10);
  if (!planId?.trim() || !Number.isFinite(order) || !Number.isInteger(order)) {
    notFound();
  }

  const data = await loadTraineeModulePageData(session.user.id, planId, order);
  if (!data) {
    notFound();
  }

  return (
    <>
      <nav className="-mt-2 mb-6" aria-label="Breadcrumb">
        <Link
          href={`/client/plans/${encodeURIComponent(planId)}`}
          className="inline-flex items-center gap-2 rounded-xl border border-[#D0D3E7]/90 bg-white/90 px-3 py-2 text-sm font-semibold text-[#b23d1e] shadow-sm ring-1 ring-black/[0.03] transition hover:border-[#F46036]/30 hover:bg-[#ECFBFA]"
        >
          <span aria-hidden className="text-base leading-none">
            ←
          </span>
          Plan overview
        </Link>
      </nav>
      <TraineeModuleStudy
        planId={data.plan.id}
        moduleOrder={data.moduleOrder}
        moduleTitle={data.moduleTitle}
        learningMarkdown={data.learningMarkdown}
        access={data.access}
        studyMarked={data.studyMarked}
        quizDone={data.quizDone}
        quizHref={data.quizHref}
        syllabusCohortTopicId={data.syllabusCohortTopicId}
      />
    </>
  );
}
