"use client";

import { renameForm } from "@/app/actions/forms";
import { EditableText } from "@/components/editable-text";

// The form's name in the editor nav, right of the back button. Wordmark's size but regular weight,
// so it reads as content, not the brand. -mr-2 cancels the bubble's right padding.
export function FormTitle({ id, initialName }: { id: string; initialName: string }) {
  return (
    <EditableText
      initialValue={initialName}
      onCommit={(v) => renameForm(id, v)}
      placeholder="Untitled form"
      ariaLabel="Form name"
      maxLength={80}
      className="-mr-2 min-w-[2ch] max-w-[60vw] truncate text-[22px] leading-7 font-normal"
    />
  );
}
