"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { newId } from "@/lib/id";

// Not exported: a "use server" file may only export async functions.
const DEFAULT_FORM_NAME = "Untitled form";
const MAX_NAME = 80;

// Instant create: no prompt, the new form opens right away and gets named in place.
export async function createForm(): Promise<void> {
  const userId = await currentUserId();
  if (!userId) redirect("/login");

  const id = newId();
  await (await db())
    .prepare("INSERT INTO forms (id, user_id, name, created_at) VALUES (?1, ?2, ?3, ?4)")
    .bind(id, userId, DEFAULT_FORM_NAME, new Date().toISOString())
    .run();

  redirect(`/edit/${id}`);
}

// Returns the name actually stored, so the field can show it. Empty falls back to the default.
export async function renameForm(id: string, name: string): Promise<string | null> {
  const userId = await currentUserId();
  if (!userId) return null;

  const clean = name.trim().slice(0, MAX_NAME) || DEFAULT_FORM_NAME;
  // user_id in the WHERE means you can only rename your own forms.
  const { meta } = await (await db())
    .prepare("UPDATE forms SET name = ?1 WHERE id = ?2 AND user_id = ?3")
    .bind(clean, id, userId)
    .run();
  if (!meta.changes) return null;

  revalidatePath("/");
  return clean;
}

// Hard delete. Scoped by owner, so an id you don't own is a silent no-op.
export async function deleteForm(id: string): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;

  await (await db()).prepare("DELETE FROM forms WHERE id = ?1 AND user_id = ?2").bind(id, userId).run();
  revalidatePath("/");
}
