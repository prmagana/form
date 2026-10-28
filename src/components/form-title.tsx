"use client";

import { useRef, useState } from "react";
import { renameForm } from "@/app/actions/forms";

// The form's name as an editable heading. Saves on blur or Enter, Escape puts it back.
export function FormTitle({ id, initialName }: { id: string; initialName: string }) {
  const [value, setValue] = useState(initialName);
  const saved = useRef(initialName);
  const input = useRef<HTMLInputElement>(null);

  const commit = async () => {
    if (value.trim() === saved.current) {
      setValue(saved.current);
      return;
    }
    const stored = await renameForm(id, value);
    if (stored === null) {
      setValue(saved.current);
      return;
    }
    saved.current = stored;
    setValue(stored);
  };

  return (
    <input
      ref={input}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") input.current?.blur();
        if (e.key === "Escape") {
          setValue(saved.current);
          // Blur after the revert lands, so commit sees the original and skips the save.
          requestAnimationFrame(() => input.current?.blur());
        }
      }}
      maxLength={80}
      spellCheck={false}
      aria-label="Form name"
      className="w-full bg-transparent text-[28px] leading-9 font-semibold outline-none placeholder:text-foreground/30"
    />
  );
}
