// Top bar for the form editor. Same frame as the main nav so the switch doesn't jump. Empty for now.
export function EditorNav() {
  return (
    <nav className="sticky top-0 z-50 w-full shrink-0 border-b border-foreground/5 bg-background px-4 sm:px-6">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between" />
    </nav>
  );
}
