import { revalidatePath } from "next/cache";

/**
 * The public site is a single static page: any content change rebuilds it.
 * Outside a Next request (seed script, CLI) revalidatePath throws; nothing to revalidate then.
 */
export function revalidateSite() {
  try {
    revalidatePath("/");
    revalidatePath("/galerie");
  } catch {
    // Not running inside Next: ignore.
  }
}

export const revalidateHooks = {
  afterChange: [revalidateSite],
  afterDelete: [revalidateSite],
};
