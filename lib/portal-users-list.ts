import type { AuthRole } from "@prisma/client";
import { masterClientForPortalResponse } from "@/lib/map-master-client-for-portal";
import { prisma } from "@/lib/prisma";

export type PortalUserMappedClient = {
  id: string;
  name: string | null;
  email: string;
};

export type PortalUserRow = {
  id: string;
  email: string;
  name: string | null;
  role: AuthRole;
  mappedClient: PortalUserMappedClient | null;
  /** Derived from `passwordHash`; plaintext is not stored or retrievable. */
  hasPassword: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const roleSort: Record<AuthRole, number> = {
  super_admin: 0,
  trainer: 1,
  trainee: 2,
};

/** All users registered in the portal (for admin overview). */
export async function listPortalUsers(): Promise<PortalUserRow[]> {
  const rows = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      mappedMasterClient: { select: { id: true, name: true } },
      passwordHash: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  rows.sort(
    (a, b) =>
      roleSort[a.role] - roleSort[b.role] || a.email.localeCompare(b.email, undefined, { sensitivity: "base" }),
  );
  return rows.map(({ passwordHash, mappedMasterClient, ...rest }) => ({
    ...rest,
    mappedClient: masterClientForPortalResponse(mappedMasterClient),
    hasPassword: Boolean(passwordHash && passwordHash.length > 0),
  }));
}
