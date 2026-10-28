"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Caret } from "@/components/caret";
import { DEFAULT_SORT, SORTS, type SortKey } from "@/lib/sort";

// Same grammar as the nav dropdowns, minus the blue: open state is just a deeper wash.
export function SortMenu({ value }: { value: SortKey }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const current = SORTS.find((s) => s.key === value) ?? SORTS[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (key: SortKey) => {
    setOpen(false);
    // Default sort keeps the URL clean.
    router.replace(key === DEFAULT_SORT ? "/" : `/?sort=${key}`, { scroll: false });
  };

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-9 cursor-pointer select-none items-center rounded-lg pl-3.5 pr-3 text-[15px] leading-4.5 font-semibold transition-colors hover:transition-none ${
          open ? "bg-foreground/10" : "bg-foreground/6 hover:bg-foreground/10"
        }`}
      >
        {current.label}
        <Caret open={open} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1.5 min-w-40 overflow-hidden rounded-lg border border-foreground/10 bg-background py-1.5 shadow-lg shadow-black/5"
        >
          {SORTS.map((s) => (
            <button
              key={s.key}
              type="button"
              role="menuitemradio"
              aria-checked={s.key === value}
              onClick={() => choose(s.key)}
              className="flex w-full cursor-pointer select-none items-center justify-between gap-6 whitespace-nowrap py-2 pl-3.5 pr-3.5 text-left text-sm leading-5 hover:bg-foreground/6"
            >
              {s.label}
              {s.key === value && <Check className="size-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12.5 10 17.5 19 7" />
    </svg>
  );
}
