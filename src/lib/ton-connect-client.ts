import TonConnect, { type WalletInfo } from "@tonconnect/sdk";

// Fetched by the wallet app, so it must be the public prod URL even in dev.
const MANIFEST_URL = "https://form.magana.marketing/tonconnect-manifest.json";

// Curated routes by registry app_name, in display order. Everything else goes through the generic QR.
export const WALLET_APP_NAMES = ["gramwallet", "tonkeeper"] as const;

// Display names where the registry's are too long. Falls back to the registry name.
const WALLET_LABELS: Record<string, string> = { gramwallet: "Gram" };

export const walletLabel = (w: WalletInfo) => WALLET_LABELS[w.appName] ?? w.name;

// Where "Get <wallet>" sends people. Falls back to the registry's about page.
const WALLET_INSTALL_URLS: Record<string, string> = {
  gramwallet: "https://gramwallet.io/?utm_source=tc",
  tonkeeper: "https://keeperwallet.com/",
};

export const walletInstallUrl = (w: WalletInfo) => WALLET_INSTALL_URLS[w.appName] ?? w.aboutUrl;

// Pathways a wallet offers besides scanning. Read off the registry's platform list.
export const hasExtension = (w: WalletInfo) =>
  w.platforms.some((p) => p === "chrome" || p === "firefox" || p === "safari");
export const hasDesktopApp = (w: WalletInfo) =>
  w.platforms.some((p) => p === "macos" || p === "windows" || p === "linux");

// One connector per browser so every surface shares the same pairing.
let connector: TonConnect | null = null;

export function getTonConnector(): TonConnect {
  return (connector ??= new TonConnect({ manifestUrl: MANIFEST_URL }));
}

// Registry entries for the curated wallets: live universal links, bridges and icons.
export async function getCuratedWallets(): Promise<WalletInfo[]> {
  const all = await getTonConnector().getWallets();
  return WALLET_APP_NAMES.map((n) => all.find((w) => w.appName === n)).filter(
    (w): w is WalletInfo => w !== undefined,
  );
}

// UQBC…PFT8, Fragment's truncation.
export const shortAddress = (addr: string) => `${addr.slice(0, 4)}…${addr.slice(-4)}`;

// Phones deep-link into the wallet app; everything else gets a QR.
export const isMobile = () =>
  typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
