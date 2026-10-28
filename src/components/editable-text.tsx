"use client";

import { useRef, useState } from "react";

type Props = {
  initialValue: string;
  // Persist the new value. Return the value actually stored (it may be normalized), or null to revert.
  onCommit: (value: string) => Promise<string | null>;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
  maxLength?: number;
};

// The bubble: plain text at rest, a soft wash on hover, a deeper one while editing.
// The wash snaps on (hover:transition-none) and fades off over 150ms.
const bubble =
  "rounded-md bg-transparent px-2 py-0.5 outline-none field-sizing-content " +
  "placeholder:text-foreground/20 hover:bg-foreground/8 focus:bg-foreground/12 " +
  "transition-[background-color] duration-150 hover:transition-none focus:select-text";

// Inline single-line edit, rebuilt from tapt's EditableText. Click selects all, Enter commits,
// Escape reverts, blur commits.
export function EditableText({ initialValue, onCommit, placeholder = "", className = "", ariaLabel, maxLength }: Props) {
  const [value, setValue] = useState(initialValue);
  const saved = useRef(initialValue);
  const input = useRef<HTMLInputElement>(null);

  const commit = async () => {
    if (value.trim() === saved.current) {
      setValue(saved.current);
      return;
    }
    const stored = await onCommit(value);
    const next = stored ?? saved.current;
    saved.current = next;
    setValue(next);
  };

  return (
    <input
      ref={input}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onFocus={(e) => e.currentTarget.select()}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          input.current?.blur();
        }
        if (e.key === "Escape") {
          setValue(saved.current);
          // Blur after the revert lands, so commit sees the original and skips the save.
          requestAnimationFrame(() => input.current?.blur());
        }
      }}
      placeholder={placeholder}
      maxLength={maxLength}
      spellCheck={false}
      aria-label={ariaLabel}
      // Height pinned to one line of the field's own font plus the py-0.5, so an empty field
      // (sized by its placeholder) sits in the same box as a filled one. Empty = unselectable.
      className={`${bubble} h-[calc(1lh+0.25rem)] ${value === "" ? "select-none" : ""} ${className}`}
    />
  );
}
