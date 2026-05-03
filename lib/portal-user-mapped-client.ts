import { prisma } from "@/lib/prisma";
import { PREDEFINED_TRAINING_PLAN_CLIENTS } from "@/lib/training-plan-clients";

export type ResolveMappedMasterClientResult =
  | { id: string | null; invalid: false }
  | { id: null; invalid: true; code: "bad_value" | "master_client_missing" };

/**
 * Resolves `mappedClientId` from the API body to a `ClientMaster` id.
 * Accepts any real master row id, or `__preset:email` / `__missing:email` (UI placeholders).
 */
export async function resolveMappedMasterClientId(
  raw: unknown,
): Promise<ResolveMappedMasterClientResult> {
  if (raw === undefined || raw === null || raw === "") {
    return { id: null, invalid: false };
  }
  if (typeof raw !== "string") {
    return { id: null, invalid: true, code: "bad_value" };
  }
  const id = raw.trim();
  if (!id) {
    return { id: null, invalid: false };
  }

  if (id.startsWith("__preset:") || id.startsWith("__missing:")) {
    const email = id.slice(id.indexOf(":") + 1).trim().toLowerCase();
    const preset = PREDEFINED_TRAINING_PLAN_CLIENTS.find(
      (c) => c.email.toLowerCase() === email,
    );
    if (!email || !preset) {
      return { id: null, invalid: true, code: "bad_value" };
    }
    const master = await prisma.clientMaster.findUnique({
      where: { name: preset.name },
      select: { id: true },
    });
    if (!master) {
      return { id: null, invalid: true, code: "master_client_missing" };
    }
    return { id: master.id, invalid: false };
  }

  const master = await prisma.clientMaster.findFirst({
    where: { id },
    select: { id: true },
  });

  if (!master) {
    return { id: null, invalid: true, code: "bad_value" };
  }
  return { id: master.id, invalid: false };
}

/** `omit` = PATCH field not sent. */
export type MappedClientBodyResult =
  | { kind: "omit" }
  | { kind: "set"; id: string | null }
  | { kind: "error"; message: string };

export async function mappedClientIdFromRequestBody(
  b: Record<string, unknown>,
  mode: "create" | "patch",
): Promise<MappedClientBodyResult> {
  if (mode === "patch" && !("mappedClientId" in b)) {
    return { kind: "omit" };
  }

  const raw = b.mappedClientId;
  if (mode === "patch" && (raw === null || raw === "" || raw === undefined)) {
    return { kind: "set", id: null };
  }
  if (mode === "create" && (raw === undefined || raw === null || raw === "")) {
    return { kind: "error", message: "Client is required." };
  }

  const resolved = await resolveMappedMasterClientId(raw);
  if (resolved.invalid) {
    return {
      kind: "error",
      message:
        resolved.code === "master_client_missing"
          ? "Matching client master row is missing. Run migrations and seed, or add the client in Client masters."
          : "Choose a valid client from the client master list.",
    };
  }
  return { kind: "set", id: resolved.id };
}
