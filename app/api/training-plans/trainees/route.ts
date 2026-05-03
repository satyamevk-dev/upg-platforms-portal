import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/auth";
import { getTraineesForTrainer } from "@/lib/trainees-for-trainer";

/** Trainee users on the signed-in trainer’s client (for plan assignment). */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "trainer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { trainees, trainerHasClient } = await getTraineesForTrainer(session.user.id);
    return NextResponse.json({
      trainerHasClient,
      trainees: trainees.map((t) => ({
        id: t.id,
        email: t.email,
        name: t.name,
      })),
    });
  } catch (err) {
    console.error("[training-plans/trainees GET]", err);
    return NextResponse.json({ error: "Could not load trainees" }, { status: 500 });
  }
}
