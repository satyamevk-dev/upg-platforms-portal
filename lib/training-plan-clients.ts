/**
 * Predefined training-plan clients (Avaya, Tawrid). `ClientMaster` rows use `name`; portal `User`
 * accounts use these emails — keep in sync with `prisma/seed.mjs`.
 */
export const PREDEFINED_TRAINING_PLAN_CLIENTS = [
  { email: "avaya@training.local", name: "Avaya" },
  { email: "tawrid@training.local", name: "Tawrid" },
] as const;

/** Built-in clients from seed; additional rows can be added by platform super admins. */
export const PREDEFINED_MASTER_CLIENT_NAMES = ["Avaya", "Tawrid"] as const;

export type MasterClientName = (typeof PREDEFINED_MASTER_CLIENT_NAMES)[number];

/** Predefined names first (seed order), then all other clients A–Z. */
export function sortMasterClients<T extends { name: string }>(rows: T[]): T[] {
  const order = new Map<string, number>(
    PREDEFINED_MASTER_CLIENT_NAMES.map((n, i) => [n, i]),
  );
  return [...rows].sort((a, b) => {
    const ao = order.get(a.name);
    const bo = order.get(b.name);
    if (ao !== undefined && bo !== undefined) return ao - bo;
    if (ao !== undefined) return -1;
    if (bo !== undefined) return 1;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}

export const PREDEFINED_TRAINING_PLAN_CLIENT_EMAILS = PREDEFINED_TRAINING_PLAN_CLIENTS.map(
  (c) => c.email
);

export function sortPredefinedClients<T extends { email: string }>(rows: T[]): T[] {
  const order = new Map<string, number>(
    PREDEFINED_TRAINING_PLAN_CLIENT_EMAILS.map((e, i) => [e, i]),
  );
  return [...rows].sort((a, b) => (order.get(a.email) ?? 99) - (order.get(b.email) ?? 99));
}

/** Label for the training plan and portal user Client dropdowns (name, or email if no name). */
export function trainingPlanClientSelectLabel(c: { name: string | null; email: string }): string {
  return c.name?.trim() || c.email;
}

/** Label for trainee assignment dropdowns (name + email when both help disambiguate). */
export function trainingPlanTraineeSelectLabel(t: { name: string | null; email: string }): string {
  const n = t.name?.trim();
  if (n) return `${n} (${t.email})`;
  return t.email;
}

export type PredefinedClientDropdownRow = {
  email: string;
  presetName: string;
  client: { id: string; name: string | null; email: string } | null;
};

/**
 * Avaya then Tawrid always — `client` is set when that user exists in `loadedFromApi` (e.g. from GET /api/training-plans/clients).
 */
export function predefinedClientsForDropdown<T extends { id: string; email: string; name: string | null }>(
  loadedFromApi: T[],
): PredefinedClientDropdownRow[] {
  const byEmail = new Map<string, T>();
  for (const row of loadedFromApi) {
    byEmail.set(row.email.trim().toLowerCase(), row);
  }
  return PREDEFINED_TRAINING_PLAN_CLIENTS.map((def) => ({
    email: def.email,
    presetName: def.name,
    client: byEmail.get(def.email.toLowerCase()) ?? null,
  }));
}
