import { PREDEFINED_TRAINING_PLAN_CLIENTS } from "@/lib/training-plan-clients";

/** API / server-rendered shape expected by the portal user panel. */
export function masterClientForPortalResponse(m: { id: string; name: string } | null): {
  id: string;
  name: string;
  email: string;
} | null {
  if (!m) return null;
  return {
    id: m.id,
    name: m.name,
    email: PREDEFINED_TRAINING_PLAN_CLIENTS.find((c) => c.name === m.name)?.email ?? "",
  };
}
