import localFont from "next/font/local";
import { Google_Sans_Flex } from "next/font/google";

// App face. Same two weights Fragment ships; the bold file maps to 600 like their stylesheet does.
export const productSans = localFont({
  src: [
    { path: "../fonts/ProductSansRegular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/ProductSansBold.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-product-sans",
  display: "swap",
});

// Trial face for the New Form button only. Variable, so 500 is a real weight.
export const googleSansFlex = Google_Sans_Flex({
  subsets: ["latin"],
  display: "swap",
});
