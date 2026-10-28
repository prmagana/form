// Dropdown caret for the nav buttons, 11px wide like Fragment's. Flips while its menu is open.
export function Caret({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 11 18"
      className={`ml-1 h-[18px] w-[11px] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1.5 7.5 5.5 11.5 9.5 7.5" />
    </svg>
  );
}
