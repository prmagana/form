import { Plus } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { googleSansFlex } from "@/app/fonts";
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
    // Fixed to the viewport height so the stage below has a definite height to size against.
    // Without it the body only has a min-height, the stage measures 0 tall, and the frame vanishes.
    <div className="flex h-dvh flex-col">
      <EditorNav left={<FormTitle id={form.id} initialName={form.name} />} />
      {/* White canvas under the nav, gray side bars, Typeform's contrast. Full window width on purpose: the nav centers its contents
          in max-w-6xl, the body doesn't, so the side columns hug the window edges. */}
      <main className="flex min-h-0 w-full flex-1 flex-col bg-background px-4 py-6 sm:px-6">
        <div className="flex min-h-0 w-full flex-1 gap-6">
          {/* Frames: the form's frames, in order. Empty until frames exist. */}
          <aside className="flex w-64 shrink-0 flex-col rounded-xl bg-foreground/3 p-3">
            {/* Full-width twin of the home page's New Form button. Does nothing yet. */}
            <button
              type="button"
              className={`${googleSansFlex.className} flex h-9 w-full cursor-pointer select-none items-center justify-center gap-1.5 rounded-lg bg-foreground px-3.5 text-[15px] leading-4.5 font-medium text-background transition-colors hover:bg-foreground/85 hover:transition-none`}
            >
              <Plus aria-hidden size={16} strokeWidth={2.25} />
              Add Frame
            </button>
          </aside>

          {/* The stage is a size container so the frame can fit both ways. */}
          <div className="grid min-h-0 flex-1 place-items-center [container-type:size]">
            {/* 16:10, as large as fits the stage in either direction. No cap, so it grows with the window. */}
            <div className="aspect-[16/10] w-[min(100cqw,calc(100cqh*1.6))] overflow-hidden border border-foreground/8 bg-background" />
          </div>

          {/* Right column, mirroring Frames. Empty and unlabeled until it has a job. */}
          <aside className="flex w-64 shrink-0 flex-col rounded-xl bg-foreground/3" />
        </div>
      </main>
    </div>
  );
}
