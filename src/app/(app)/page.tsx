import { googleSansFlex } from "@/app/fonts";

// Same horizontal frame as the nav, so the button's right edge lines up with the nav buttons.
export default function Home() {
  return (
    <main className="w-full flex-1 px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl justify-end pt-6">
        {/* Does nothing yet. */}
        <button
          type="button"
          className={`${googleSansFlex.className} flex h-9 cursor-pointer select-none items-center rounded-lg bg-foreground px-3.5 text-[15px] leading-4.5 font-medium text-background transition-colors hover:bg-foreground/85 hover:transition-none`}
        >
          New Form
        </button>
      </div>
    </main>
  );
}
