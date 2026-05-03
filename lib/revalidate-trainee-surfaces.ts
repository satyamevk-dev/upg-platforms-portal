import { revalidatePath } from "next/cache";

/** Best-effort cache revalidation; never throws (so route handlers still return JSON). */
export function revalidateTraineeSurfaces(paths: string[]): void {
  for (const p of paths) {
    try {
      revalidatePath(p);
    } catch (e) {
      console.error("[revalidatePath]", p, e);
    }
  }
}
