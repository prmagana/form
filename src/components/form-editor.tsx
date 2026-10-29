"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { googleSansFlex } from "@/app/fonts";
import { saveFrames } from "@/app/actions/frames";
import { FrameIcon } from "@/components/frame-icon";
import { FramePicker } from "@/components/frame-picker";
import type { Frame, FrameType } from "@/lib/frames";

const SAVE_DELAY = 400;

// The editor body: Frames bar, the preview, and the empty right bar. Owns the frames draft
// and autosaves it, debounced while typing, immediately on structural changes.
export function FormEditor({ formId, initialFrames }: { formId: string; initialFrames: Frame[] }) {
  const [frames, setFrames] = useState(initialFrames);
  const [selectedId, setSelectedId] = useState<string | null>(initialFrames[0]?.id ?? null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<Frame[] | null>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const focusTitle = useRef(false);

  const flush = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    const next = pending.current;
    pending.current = null;
    if (next) saveFrames(formId, next).catch((err) => console.error("save frames failed", err));
  }, [formId]);

  const schedule = (next: Frame[]) => {
    pending.current = next;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, SAVE_DELAY);
  };

  // Don't lose the last keystrokes when leaving the page or the tab.
  useEffect(() => {
    const onHide = () => document.visibilityState === "hidden" && flush();
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      flush();
    };
  }, [flush]);

  // A freshly added frame lands with its title focused, ready to type.
  useEffect(() => {
    if (!focusTitle.current) return;
    focusTitle.current = false;
    titleInput.current?.focus();
  }, [selectedId]);

  const addFrame = (type: FrameType) => {
    const frame: Frame = { id: crypto.randomUUID(), type, title: "" };
    const next = [...frames, frame];
    setFrames(next);
    setPickerOpen(false);
    focusTitle.current = true;
    setSelectedId(frame.id);
    pending.current = next;
    flush();
  };

  const setTitle = (id: string, title: string) => {
    const next = frames.map((f) => (f.id === id ? { ...f, title } : f));
    setFrames(next);
    schedule(next);
  };

  const selectedIndex = frames.findIndex((f) => f.id === selectedId);
  const selected = selectedIndex >= 0 ? frames[selectedIndex] : null;

  return (
    <div className="flex min-h-0 w-full flex-1 gap-6">
      {/* Frames: the form's frames, in order. */}
      <aside className="flex w-64 shrink-0 flex-col rounded-xl bg-foreground/3 p-3">
        {/* Full-width twin of the home page's New Form button. */}
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className={`${googleSansFlex.className} flex h-9 w-full cursor-pointer select-none items-center justify-center gap-1.5 rounded-lg bg-foreground px-3.5 text-[15px] leading-4.5 font-medium text-background transition-colors hover:bg-foreground/85 hover:transition-none`}
        >
          <Plus aria-hidden size={16} strokeWidth={2.25} />
          Add Frame
        </button>

        {frames.length > 0 && (
          <ul className="mt-3 flex min-h-0 flex-col gap-0.5 overflow-y-auto">
            {frames.map((f, i) => (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(f.id)}
                  className={`flex w-full cursor-pointer select-none items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:transition-none ${
                    f.id === selectedId ? "bg-foreground/8" : "hover:bg-foreground/5"
                  }`}
                >
                  {/* Type tint + position, like Typeform's page chips. */}
                  <span className="flex h-5 shrink-0 items-center gap-1 rounded-md bg-[#d6e8fc] px-1.5 text-xs font-semibold text-[#1d4f8c]">
                    <FrameIcon type={f.type} size={12} strokeWidth={2.5} />
                    {i + 1}
                  </span>
                  <span className={`truncate ${f.title ? "" : "text-foreground/40"}`}>{f.title || "Untitled"}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* The stage is a size container so the frame can fit both ways. */}
      <div className="grid min-h-0 flex-1 place-items-center [container-type:size]">
        {/* 16:10, as large as fits the stage in either direction. No cap, so it grows with the window. */}
        <div className="flex aspect-[16/10] w-[min(100cqw,calc(100cqh*1.6))] items-center justify-center overflow-hidden border border-foreground/8 bg-background">
          {selected && (
            <div className="w-[min(640px,78%)]">
              <div className="flex items-start gap-3">
                <span className="mt-2 flex size-5 shrink-0 select-none items-center justify-center rounded bg-foreground text-xs font-semibold text-background">
                  {selectedIndex + 1}
                </span>
                {/* The question, typed straight into the preview. Bubble on hover and focus. */}
                <input
                  ref={titleInput}
                  value={selected.title}
                  onChange={(e) => setTitle(selected.id, e.target.value)}
                  onBlur={flush}
                  onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                  placeholder="Your question here"
                  maxLength={500}
                  spellCheck={false}
                  aria-label="Question"
                  className="-mx-2 w-full rounded-md bg-transparent px-2 py-0.5 text-2xl leading-8 outline-none transition-[background-color] duration-150 placeholder:text-foreground/30 hover:bg-foreground/5 hover:transition-none focus:bg-foreground/8"
                />
              </div>
              {/* What a respondent will type into. Inert in the editor. */}
              <div className="mt-8 ml-8 select-none border-b border-foreground/25 pb-2 text-xl text-foreground/30">
                Type your answer here...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right column, mirroring Frames. Empty and unlabeled until it has a job. */}
      <aside className="flex w-64 shrink-0 flex-col rounded-xl bg-foreground/3" />

      <FramePicker open={pickerOpen} onClose={() => setPickerOpen(false)} onPick={addFrame} />
    </div>
  );
}
