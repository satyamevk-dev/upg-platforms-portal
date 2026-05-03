import { getServerSession } from "next-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authOptions } from "@/auth";
import { markTraineeModuleStudyComplete } from "@/lib/trainee-plan-progress";
import { revalidateTraineeSurfaces } from "@/lib/revalidate-trainee-surfaces";

type Ctx = { params: Promise<{ planId: string; order: string }> };

export async function POST(_req: NextRequest, ctx: Ctx) {
  try {
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

    const result = await markTraineeModuleStudyComplete(session.user.id, pid, moduleOrder);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    revalidateTraineeSurfaces([
      "/dashboard",
      "/client",
      `/client/plans/${pid}`,
      `/client/plans/${pid}/module/${moduleOrder}`,
    ]);

    /** Minimal payload avoids rare serialization issues; client navigates to the plan page for fresh data. */
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[study-complete]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 },
    );
  }
}
