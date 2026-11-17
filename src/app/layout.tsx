import type { Metadata, Viewport } from "next";
import { Archivo, DM_Sans } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/utils";
import "./globals.css";

const display = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const body = DM_Sans({
  variable: "--font-dmsans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Creative Marketing & Video Production`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Traffix Media is a creative marketing and video production company. Brand films, ad films, reels, event coverage and campaigns for real estate, hospitality, lifestyle, F&B, tech and more. Be seen. Be known.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#6a1a23",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
