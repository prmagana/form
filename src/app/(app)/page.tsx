import Link from "next/link";
import { redirect } from "next/navigation";
import { FormRowMenu } from "@/components/form-row-menu";
import { NewFormButton } from "@/components/new-form-button";
import { SortMenu } from "@/components/sort-menu";
import { currentUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { parseSort, type SortKey } from "@/lib/sort";

type FormRow = { id: string; name: string };

// Whitelisted ORDER BY per sort key. Never interpolate user input into SQL.
const ORDER: Record<SortKey, string> = {
  newest: "created_at DESC",
  oldest: "created_at ASC",
  name: "name COLLATE NOCASE ASC, created_at DESC",
  "name-desc": "name COLLATE NOCASE DESC, created_at DESC",
};

// Same horizontal frame as the nav, so the bar and rows line up with the nav's edges.
export default async function Home({ searchParams }: PageProps<"/">) {
  const userId = await currentUserId();
  if (!userId) redirect("/login");

  const sort = parseSort((await searchParams).sort);
  const { results: forms } = await (await db())
    .prepare(`SELECT id, name FROM forms WHERE user_id = ?1 ORDER BY ${ORDER[sort]}`)
    .bind(userId)
    .all<FormRow>();

  return (
    <main className="w-full flex-1 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-6xl pt-6">
        <div className="flex items-center justify-end gap-3.5">
          <SortMenu value={sort} />
          <NewFormButton />
        </div>

        {forms.length === 0 ? (
          <p className="select-none py-16 text-center text-[15px] text-foreground/40">No forms yet</p>
        ) : (
          // Each row is its own filled block, flush with the bar's edges.
          <ul className="mt-6 flex flex-col gap-1.5">
            {forms.map((f) => (
              // group on the li, so hovering the ⋯ button keeps the row lit. The menu sits
              // beside the link, not inside it: a button inside an <a> is invalid HTML.
              <li key={f.id} className="group relative">
                <Link
                  href={`/edit/${f.id}`}
                  draggable={false}
                  className="flex select-none items-center gap-6 rounded-lg border border-foreground/4 bg-foreground/4 py-3.5 pl-4 pr-13 transition-colors group-hover:bg-foreground/7 group-hover:transition-none"
                >
                  <span className="truncate text-[15px]">{f.name}</span>
                </Link>
                <FormRowMenu id={f.id} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
