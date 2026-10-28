import Link from "next/link";

// Top bar for the form editor. Same frame as the main nav so the switch doesn't jump.
// The page fills `left` (the title), since only the page has the form's data.
export function EditorNav({ left }: { left?: React.ReactNode }) {
  return (
    <nav className="sticky top-0 z-50 w-full shrink-0 border-b border-foreground/5 bg-background px-4 sm:px-6">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between">
        <div className="flex min-w-0 items-center gap-1">
          {/* 32px, the title bubble's height (28px line + py-0.5), so the two read as a pair.
              -ml-1.5 pulls the glyph onto the frame's left edge. */}
          <Link
            href="/"
            aria-label="Back to forms"
            draggable={false}
            className="-ml-1.5 flex size-8 shrink-0 items-center justify-center rounded-md text-foreground/60 transition-colors duration-150 hover:bg-foreground/8 hover:text-foreground hover:transition-none"
          >
            <ChevronLeft className="size-5" />
          </Link>
          {left}
        </div>
      </div>
    </nav>
  );
}

// Drawn chevron. No icon library.
function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
