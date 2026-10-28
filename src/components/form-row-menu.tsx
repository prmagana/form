"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Ellipsis } from "lucide-react";
import { deleteForm } from "@/app/actions/forms";

// The row's "⋯": shows on row hover (always on touch), opens a menu with a two-step Delete.
export function FormRowMenu({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [armed, setArmed] = useState(false);
  const [pending, startTransition] = useTransition();
  const root = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
    setArmed(false);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // First click arms, second deletes. Cheap insurance against a stray click.
  const onDelete = () => {
    if (!armed) {
      setArmed(true);
      return;
    }
    startTransition(async () => {
      await deleteForm(id);
      close();
    });
  };

  return (
    // The translate makes this its own stacking context, so the menu's z only counts inside it.
    // Lift the whole wrapper while open, or the next row paints over the menu.
    <div ref={root} className={`absolute right-2 top-1/2 -translate-y-1/2 ${open ? "z-30" : "z-10"}`}>
      <button
        type="button"
        aria-label="Form options"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? close() : setOpen(true))}
        className={`flex size-8 cursor-pointer items-center justify-center rounded-md text-foreground/50 transition-[opacity,background-color,color] hover:bg-foreground/8 hover:text-foreground focus-visible:opacity-100 [@media(hover:none)]:opacity-100 ${
          open ? "bg-foreground/8 text-foreground opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <Ellipsis aria-hidden size={18} strokeWidth={2} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1.5 min-w-44 overflow-hidden rounded-lg border border-foreground/10 bg-background py-1.5 shadow-lg shadow-black/5"
        >
          <button
            type="button"
            role="menuitem"
            disabled={pending}
            onClick={onDelete}
            className="block w-full cursor-pointer select-none whitespace-nowrap py-2 pl-3.5 pr-3.5 text-left text-sm leading-5 text-red-500 hover:bg-red-500/8 disabled:cursor-default disabled:opacity-60"
          >
            {pending ? "Deleting…" : armed ? "Click again to delete" : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}
