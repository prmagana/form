import { AccountChip } from "@/components/account-chip";
import { currentUserId } from "@/lib/auth";
import { db } from "@/lib/db";

type UserRow = { name: string | null; picture: string | null };

// Top bar for signed-in pages. Just the account chip on the right for now.
export async function Nav() {
  const userId = await currentUserId();
  const user = userId
    ? await (await db()).prepare("SELECT name, picture FROM users WHERE id = ?1").bind(userId).first<UserRow>()
    : null;

  return (
    <nav className="sticky top-0 z-50 w-full shrink-0 border-b border-foreground/5 bg-background px-4 sm:px-6">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-end">
        <AccountChip name={user?.name ?? "Account"} picture={user?.picture ?? null} />
      </div>
    </nav>
  );
}
