/**
 * NextAuth requires a secret in production.
 * @see https://next-auth.js.org/configuration/options#nextauth_secret
 */
export function getNextAuthSecret(): string | undefined {
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
  const trimmed = secret?.trim();
  return trimmed || undefined;
}
