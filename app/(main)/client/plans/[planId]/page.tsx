import { TraineePlanProgressPanel } from "@/components/trainee-plan-progress-panel";
import { getTraineePlanProgressPayload } from "@/lib/trainee-plan-progress";
import { getServerSession } from "next-auth/next";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/auth";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ planId: string }> };

export default async function TraineePlanDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/client");
  }
  if (session.user.role !== "trainee") {
    redirect("/dashboard");
  }

  const { planId } = await params;
  if (!planId?.trim()) {
    notFound();
  }

  const payload = await getTraineePlanProgressPayload(session.user.id, planId);
  if (!payload) {
    notFound();
  }

  return (
    <TraineePlanProgressPanel
      planId={payload.plan.id}
      initialPlan={payload.plan}
      initialProgress={payload.progress}
    />
  );
}
