"use server";

import { currentUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { sanitizeFrames } from "@/lib/frames";

// Editor autosave: the whole frames array, replaced. A server action is a public POST, so the
// payload is sanitized and the write is scoped to the owner. Returns whether a row was updated.
export async function saveFrames(formId: string, frames: unknown): Promise<boolean> {
  const userId = await currentUserId();
  if (!userId) return false;

  const clean = sanitizeFrames(frames);
  const { meta } = await (await db())
    .prepare("UPDATE forms SET frames = ?1 WHERE id = ?2 AND user_id = ?3")
    .bind(JSON.stringify(clean), formId, userId)
    .run();
  return meta.changes > 0;
}
