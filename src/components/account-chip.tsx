type Props = { name: string; picture: string | null };

// Fragment's wide header button: 36px tall, 8px radius, 15px/18px bold label,
// 28px photo bubble inset 6px from the left with a 9px gap to the name.
// Only 400 and 600 exist in the Product Sans files, so the label is 600, never 500.
export function AccountChip({ name, picture }: Props) {
  return (
    <button
      type="button"
      aria-label="account"
      className="flex h-9 cursor-pointer select-none items-center gap-[9px] rounded-lg bg-foreground/[0.06] pl-1.5 pr-3.5 text-[15px] leading-[18px] font-semibold transition-colors hover:bg-foreground/[0.1] hover:transition-none"
    >
      <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-foreground/10">
        {picture && (
          // eslint-disable-next-line @next/next/no-img-element -- remote Telegram CDN, no optimizer config
          <img src={picture} alt={name} draggable={false} className="size-full object-cover" />
        )}
      </span>
      <span className="max-w-40 truncate">{name}</span>
    </button>
  );
}
