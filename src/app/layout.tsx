import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";

import "./globals.css";
import RouteChrome from "@/components/shared/RouteChrome";
import RouteFooter from "@/components/shared/RouteFooter";
import { ChromeVisibilityProvider } from "@/components/shared/ChromeVisibility";
import UserDatabaseSync from "@/components/shared/UserDatabaseSync";
import { ClerkProvider } from "@clerk/nextjs";
import { getMasterData } from "@/lib/master-data";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lacak.smktibazma.sch.id";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LACAK - Lapak Cari Barang Kembali | Sistem Lost & Found",
    template: "%s | LACAK",
  },
  description:
    "Sistem Informasi Pengelolaan Barang Hilang & Temuan Terintegrasi. Cari barang temuan, laporkan kehilangan, dan pantau status barang secara transparan dan aman.",
  keywords: [
    "barang hilang",
    "barang temuan",
    "lost and found",
    "lacak barang",
    "lapor barang hilang",
    "portal temuan",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "LACAK",
    title: "LACAK - Lapak Cari Barang Kembali | Sistem Lost & Found",
    description:
      "Sistem Informasi Pengelolaan Barang Hilang & Temuan Terintegrasi.",
    images: ["/images/about/hero.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "LACAK - Lapak Cari Barang Kembali | Sistem Lost & Found",
    description:
      "Sistem Informasi Pengelolaan Barang Hilang & Temuan Terintegrasi.",
    images: ["/images/about/hero.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { categories, colors, brands, locations } = await getMasterData();

  return (
    <ClerkProvider>
      <html lang="id" suppressHydrationWarning className={inter.variable}>
        <body
          className="font-sans min-h-screen flex flex-col bg-[#fafbfb] text-[#102824] antialiased"
          suppressHydrationWarning
        >
          <ChromeVisibilityProvider>
            <UserDatabaseSync />
            <Suspense
              fallback={
                <header className="bg-white border-b border-[#e2ece8] min-h-[64px]" />
              }
            >
              <RouteChrome publicData={{ categories, colors, brands, locations }} />
            </Suspense>

            <main className="flex-grow flex flex-col">
              {children}
            </main>

            <RouteFooter />
          </ChromeVisibilityProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
