import { notFound, redirect } from "next/navigation";
import { EditorNav } from "@/components/editor-nav";
import { FormTitle } from "@/components/form-title";
import { currentUserId } from "@/lib/auth";
import { db } from "@/lib/db";

type FormRow = { id: string; name: string };

// Bare editor: the name lives in the nav, the canvas below is empty until fields exist.
export default async function FormPage({ params }: PageProps<"/edit/[id]">) {
  const userId = await currentUserId();
  if (!userId) redirect("/login");

  const { id } = await params;
  // Scoped by owner, so someone else's id simply 404s.
  const form = await (await db())
    .prepare("SELECT id, name FROM forms WHERE id = ?1 AND user_id = ?2")
    .bind(id, userId)
    .first<FormRow>();
  if (!form) notFound();

  return (
    <>
      <EditorNav left={<FormTitle id={form.id} initialName={form.name} />} />
      <main className="w-full flex-1 px-4 sm:px-6" />
    </>
  );
}
