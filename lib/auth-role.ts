import type { AuthRole } from "@prisma/client";

const ROLES: AuthRole[] = ["super_admin", "trainer", "trainee"];

export function parseAuthRole(value: unknown): AuthRole | undefined {
  if (typeof value !== "string") return undefined;
  return ROLES.includes(value as AuthRole) ? (value as AuthRole) : undefined;
}
