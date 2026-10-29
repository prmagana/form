import { TextCursorInput, type LucideProps } from "lucide-react";
import type { FrameType } from "@/lib/frames";

// One glyph per frame type, shared by the picker and the Frames list.
const ICONS: Record<FrameType, React.ComponentType<LucideProps>> = { short_text: TextCursorInput };

export function FrameIcon({ type, ...props }: { type: FrameType } & LucideProps) {
  const Icon = ICONS[type];
  return <Icon aria-hidden strokeWidth={2} {...props} />;
}
