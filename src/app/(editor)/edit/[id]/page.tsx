import { notFound, redirect } from "next/navigation";
import { EditorNav } from "@/components/editor-nav";
import { FormEditor } from "@/components/form-editor";
import { FormTitle } from "@/components/form-title";
import { currentUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { sanitizeFrames } from "@/lib/frames";

type FormRow = { id: string; name: string; frames: string };

// The editor: name in the nav, frames and preview below.
export default async function FormPage({ params }: PageProps<"/edit/[id]">) {
  const userId = await currentUserId();
  if (!userId) redirect("/login");

  const { id } = await params;
  // Scoped by owner, so someone else's id simply 404s.
  const form = await (await db())
    .prepare("SELECT id, name, frames FROM forms WHERE id = ?1 AND user_id = ?2")
    .bind(id, userId)
    .first<FormRow>();
  if (!form) notFound();

  return (
    // Fixed to the viewport height so the stage below has a definite height to size against.
    // Without it the body only has a min-height, the stage measures 0 tall, and the frame vanishes.
    <div className="flex h-dvh flex-col">
      <EditorNav left={<FormTitle id={form.id} initialName={form.name} />} />
      {/* White canvas under the nav, gray side bars. Full window width on purpose: the nav centers
          its contents in max-w-6xl, the body doesn't, so the side columns hug the window edges. */}
      <main className="flex min-h-0 w-full flex-1 flex-col bg-background px-4 py-6 sm:px-6">
        {/* A stored blob that drifted is cleaned, never trusted. */}
        <FormEditor formId={form.id} initialFrames={sanitizeFrames(form.frames)} />
      </main>
    </div>
  );
}
