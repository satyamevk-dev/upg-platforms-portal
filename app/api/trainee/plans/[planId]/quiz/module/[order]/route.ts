import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authOptions } from "@/auth";
import { linuxSyllabusTopicIdForPlanModule } from "@/lib/linux-plan-topic-group";
import { submitTraineeModuleQuiz } from "@/lib/trainee-quiz-submit";
import { getAssignedTrainingPlanForTrainee } from "@/lib/training-plans-list";

type Ctx = { params: Promise<{ planId: string; order: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "trainee") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { planId, order: orderRaw } = await ctx.params;
  const pid = planId?.trim();
  const moduleOrder = Number.parseInt(orderRaw ?? "", 10);
  if (!pid || !Number.isFinite(moduleOrder) || !Number.isInteger(moduleOrder)) {
    return NextResponse.json({ error: "Invalid module" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const answersUnknown = body && typeof body === "object" ? (body as { answers?: unknown }).answers : undefined;
  if (!Array.isArray(answersUnknown)) {
    return NextResponse.json({ error: "answers array required" }, { status: 400 });
  }
  const answers: number[] = [];
  for (const a of answersUnknown) {
    if (typeof a !== "number" || !Number.isInteger(a)) {
      return NextResponse.json({ error: "Each answer must be an integer choice index" }, { status: 400 });
    }
    answers.push(a);
  }

  const plan = await getAssignedTrainingPlanForTrainee(session.user.id, pid);
  if (!plan) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const mod = plan.modules.find((m) => m.order === moduleOrder);
  if (!mod) {
    return NextResponse.json({ error: "Module not found" }, { status: 404 });
  }
  if (linuxSyllabusTopicIdForPlanModule(mod.entryId) !== null) {
    return NextResponse.json(
      {
        error: "Syllabus-cohort topics use the shared topic quiz page linked from your plan overview.",
      },
      { status: 400 },
    );
  }

  const result = await submitTraineeModuleQuiz({
    traineeUserId: session.user.id,
    planId: pid,
    moduleOrder,
    answers,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  revalidatePath("/dashboard");
  revalidatePath("/client");
  revalidatePath(`/client/plans/${pid}`);
  revalidatePath(`/client/plans/${pid}/quiz/module/${moduleOrder}`);
  revalidatePath(`/client/plans/${pid}/module/${moduleOrder}`);

  return NextResponse.json({
    ok: true,
    correctCount: result.correctCount,
    totalQuestions: result.totalQuestions,
    plan: result.plan,
    progress: result.progress,
  });
}
