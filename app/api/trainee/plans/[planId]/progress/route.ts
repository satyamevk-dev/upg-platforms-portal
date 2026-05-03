import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authOptions } from "@/auth";
import { revalidateTraineeSurfaces } from "@/lib/revalidate-trainee-surfaces";
import {
  applyTraineePlanAction,
  getTraineePlanProgressPayload,
  type TraineePlanAction,
} from "@/lib/trainee-plan-progress";

type Ctx = { params: Promise<{ planId: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "trainee") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { planId } = await ctx.params;
  if (!planId?.trim()) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const payload = await getTraineePlanProgressPayload(session.user.id, planId);
  if (!payload) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(payload);
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "trainee") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { planId } = await ctx.params;
  if (!planId?.trim()) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const b = body as Record<string, unknown>;
  const action = b.action;
  const validActions: TraineePlanAction[] = [
    "start",
    "pause",
    "resume",
    "cancel_pause",
    "complete_module",
  ];
  if (typeof action !== "string" || !validActions.includes(action as TraineePlanAction)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
  const moduleOrder =
    typeof b.moduleOrder === "number" && Number.isInteger(b.moduleOrder) ? b.moduleOrder : undefined;

  const result = await applyTraineePlanAction(session.user.id, planId, action as TraineePlanAction, moduleOrder);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  revalidateTraineeSurfaces(["/dashboard", "/client", `/client/plans/${planId.trim()}`]);

  return NextResponse.json({ plan: result.plan, progress: result.progress });
}
