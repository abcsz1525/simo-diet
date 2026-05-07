import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/ui/bottom-nav";
import { PwaInit } from "@/components/pwa-init";
import { MilestoneCelebrator } from "@/components/milestone-celebrator";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const oswald = Oswald({
  variable: "--font-display-next",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SIMO · 30 дней",
  description:
    "30-дневный челлендж по диете SIMO (Фаза 1: Элиминация). Помогает чистить организм и держаться плана.",
  applicationName: "SIMO 30",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SIMO 30",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#F4C600",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${oswald.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col bg-[#F4C600] text-black">
        <PwaInit />
        <MilestoneCelebrator />
        <div className="simo-screen with-bottom-nav max-w-2xl mx-auto w-full px-5">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
