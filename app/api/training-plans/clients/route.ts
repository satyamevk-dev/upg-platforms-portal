import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PREDEFINED_TRAINING_PLAN_CLIENTS, sortMasterClients } from "@/lib/training-plan-clients";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = session.user.role;
  if (role !== "trainer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const masters = sortMasterClients(
      await prisma.clientMaster.findMany({
        select: { id: true, name: true },
      }),
    );
    const clients = masters.map((m) => ({
      id: m.id,
      name: m.name,
      email:
        PREDEFINED_TRAINING_PLAN_CLIENTS.find((c) => c.name === m.name)?.email ?? "",
    }));
    return NextResponse.json({ clients });
  } catch (err) {
    console.error("[training-plans/clients]", err);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
