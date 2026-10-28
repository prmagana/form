"use client";

import { useFormStatus } from "react-dom";
import { googleSansFlex } from "@/app/fonts";
import { createForm } from "@/app/actions/forms";

// A plain form posting to the server action, so it works before JS hydrates too.
export function NewFormButton() {
  return (
    <form action={createForm}>
      <Submit />
    </form>
  );
}

// Disabled while the create is in flight, so a double click can't make two forms.
function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${googleSansFlex.className} flex h-9 cursor-pointer select-none items-center rounded-lg bg-foreground px-3.5 text-[15px] leading-4.5 font-medium text-background transition-colors hover:bg-foreground/85 hover:transition-none disabled:cursor-default disabled:opacity-70`}
    >
      New Form
    </button>
  );
}
