import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authOptions } from "@/auth";

/**
 * @param req Optional `Request` / `NextRequest` from a Route Handler — used only if
 * `getServerSession()` does not see a session (fallback via `getToken`).
 */
export async function requireSuperAdmin(req?: NextRequest | Request) {
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
  if (!secret) {
    console.error("[requireSuperAdmin] NEXTAUTH_SECRET / AUTH_SECRET is not set");
    return {
      session: null,
      error: NextResponse.json({ error: "Server misconfiguration" }, { status: 500 }),
    };
  }

  const session = await getServerSession(authOptions);
  if (session?.user?.id && session.user.role === "super_admin") {
    return { session, error: null };
  }

  if (req) {
    try {
      const token = await getToken({ req: req as NextRequest, secret });
      if (token?.sub) {
        const role = (token as { role?: string }).role ?? "trainee";
        if (role === "super_admin") {
          return {
            session: {
              user: {
                id: token.sub,
                email: (token.email as string) ?? "",
                role: role as "super_admin" | "trainer" | "trainee",
              },
            },
            error: null,
          };
        }
      }
    } catch (e) {
      console.error("[requireSuperAdmin] getToken failed", e);
    }
  }

  if (session?.user?.id) {
    return { session: null, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
}
