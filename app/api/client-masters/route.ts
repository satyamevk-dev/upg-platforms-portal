import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/require-super-admin";
import { sortMasterClients } from "@/lib/training-plan-clients";

const NAME_MAX = 120;

function normalizeMasterName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const t = raw.trim();
  if (!t || t.length > NAME_MAX) return null;
  return t;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = session.user.role;
  if (role !== "trainer" && role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const masters = sortMasterClients(
      await prisma.clientMaster.findMany({
        select: { id: true, name: true },
      }),
    );
    return NextResponse.json({ masters });
  } catch (err) {
    console.error("[client-masters]", err);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireSuperAdmin(req);
  if (error) return error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const name = normalizeMasterName((body as Record<string, unknown>).name);
  if (!name) {
    return NextResponse.json(
      { error: `Name is required (1–${NAME_MAX} characters).` },
      { status: 400 },
    );
  }

  try {
    const master = await prisma.clientMaster.create({
      data: { name },
      select: { id: true, name: true },
    });
    revalidatePath("/");
    revalidatePath("/dashboard");
    return NextResponse.json({ master });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json(
        { error: "A client with this name already exists." },
        { status: 409 },
      );
    }
    console.error("[client-masters POST]", e);
    return NextResponse.json({ error: "Could not create client." }, { status: 500 });
  }
}
