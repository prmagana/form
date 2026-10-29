"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { FRAME_GROUPS, FRAME_LABELS, type FrameType } from "@/lib/frames";
import { FrameIcon } from "@/components/frame-icon";

type Props = { open: boolean; onClose: () => void; onPick: (type: FrameType) => void };

// Centered picker of frame types, grouped by category. One type for now, built to hold many.
export function FramePicker({ open, onClose, onPick }: Props) {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- portal needs document, mount guard avoids hydration mismatch
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div onClick={onClose} className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add frame"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-160 rounded-2xl bg-background p-6 shadow-2xl shadow-black/30"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="select-none text-[17px] font-semibold">Add frame</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-foreground/60 hover:bg-foreground/8 hover:text-foreground"
          >
            <X aria-hidden size={18} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-x-6 gap-y-5">
          {FRAME_GROUPS.map((group) => (
            <section key={group.label}>
              <h3 className="mb-2 select-none px-2 text-sm font-semibold text-foreground/60">{group.label}</h3>
              <ul className="flex flex-col gap-0.5">
                {group.types.map((type) => (
                  <li key={type}>
                    <button
                      type="button"
                      onClick={() => onPick(type)}
                      className="flex w-full cursor-pointer select-none items-center gap-3 rounded-lg px-2 py-1.5 text-left text-[15px] hover:bg-foreground/6"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#d6e8fc] text-[#1d4f8c]">
                        <FrameIcon type={type} size={16} />
                      </span>
                      {FRAME_LABELS[type]}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
