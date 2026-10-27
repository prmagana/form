"use client";

import { useEffect, useRef } from "react";

type Props = { botUsername: string };

// Telegram's widget reads data-* attrs off its own script tag, so we inject it at runtime.
export function TelegramLogin({ botUsername }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.dataset.telegramLogin = botUsername;
    script.dataset.size = "large";
    script.dataset.radius = "8";
    // Widget wants an absolute URL for the callback.
    script.dataset.authUrl = `${window.location.origin}/api/auth/telegram`;
    el.appendChild(script);

    return () => {
      el.innerHTML = "";
    };
  }, [botUsername]);

  return <div ref={ref} className="min-h-10" />;
}
