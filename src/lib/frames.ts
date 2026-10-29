// A form is an ordered list of frames, one screen each. Only Short Text exists so far.
export type FrameType = "short_text";

export type Frame = { id: string; type: FrameType; title: string };

export const FRAME_LABELS: Record<FrameType, string> = { short_text: "Short Text" };

// How the picker groups types. More groups and types slot in here as they're built.
export const FRAME_GROUPS: { label: string; types: FrameType[] }[] = [{ label: "Text", types: ["short_text"] }];

const MAX_FRAMES = 200;
const MAX_TITLE = 500;
const ID = /^[A-Za-z0-9-]{8,64}$/;

const isFrameType = (v: unknown): v is FrameType => typeof v === "string" && v in FRAME_LABELS;

// Trust nothing from the client or a stored blob: keep only well-formed frames, known keys, bounded sizes.
export function sanitizeFrames(raw: unknown): Frame[] {
  let value = raw;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(value)) return [];

  const out: Frame[] = [];
  for (const item of value.slice(0, MAX_FRAMES)) {
    if (!item || typeof item !== "object") continue;
    const { id, type, title } = item as Record<string, unknown>;
    if (typeof id !== "string" || !ID.test(id) || !isFrameType(type)) continue;
    out.push({ id, type, title: typeof title === "string" ? title.slice(0, MAX_TITLE) : "" });
  }
  return out;
}
