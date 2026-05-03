/**
 * Must match `prisma/seed.mjs` / `.env` `SUPER_ADMIN_EMAIL` (default satyamevk@infinite.com).
 * Used to treat the seeded platform owner (e.g. Satyam EVK) as having a fixed role.
 */
export function getPlatformOwnerEmail(): string {
  return (process.env.SUPER_ADMIN_EMAIL ?? "satyamevk@infinite.com").trim().toLowerCase();
}

export function isPlatformOwnerEmail(email: string): boolean {
  return email.trim().toLowerCase() === getPlatformOwnerEmail();
}
