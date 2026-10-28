export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="flex w-full max-w-xs flex-col items-center gap-6">
        <p className="text-sm text-neutral-500">Sign in to continue</p>
        <a
          href="/api/auth/login"
          className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background"
        >
          Continue with Telegram
        </a>
      </div>
    </main>
  );
}
