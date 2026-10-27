import { TelegramLogin } from "@/components/telegram-login";

export default function LoginPage() {
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="flex w-full max-w-xs flex-col items-center gap-6">
        <p className="text-sm text-neutral-500">Sign in to continue</p>
        {botUsername ? (
          <TelegramLogin botUsername={botUsername} />
        ) : (
          // Dev hint only, the widget renders nothing without a bot username.
          <p className="text-center text-xs text-neutral-500">
            Set NEXT_PUBLIC_TELEGRAM_BOT_USERNAME to show the login button.
          </p>
        )}
      </div>
    </main>
  );
}
