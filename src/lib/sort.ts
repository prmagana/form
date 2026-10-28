// Sort options for the forms list. The key lives in the URL (?sort=), so the list can read it server-side.
export const SORTS = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "name", label: "Name A–Z" },
  { key: "name-desc", label: "Name Z–A" },
] as const;

export type SortKey = (typeof SORTS)[number]["key"];

export const DEFAULT_SORT: SortKey = "newest";

// Anything unknown falls back to the default rather than erroring.
export function parseSort(value: string | string[] | undefined): SortKey {
  const v = Array.isArray(value) ? value[0] : value;
  return SORTS.some((s) => s.key === v) ? (v as SortKey) : DEFAULT_SORT;
}
