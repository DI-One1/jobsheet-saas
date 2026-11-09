import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";

import "./globals.css";
import RouteChrome from "@/components/shared/RouteChrome";
import RouteFooter from "@/components/shared/RouteFooter";
import MobileBottomNav from "@/components/shared/MobileBottomNav";
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
    "Sistem Informasi Pengelolaan Barang Hilang & Temuan Terintegrasi. Laporkan barang hilang atau temukan barang tercecer di lingkungan institusi dengan cepat dan transparan.",
  keywords: [
    "lost and found",
    "barang hilang",
    "barang temuan",
    "lacak barang",
    "sistem informasi",
    "sekolah",
    "institusi",
  ],
  authors: [{ name: "Tim Pengembang LACAK" }],
  creator: "SMK TI BAZMA",
  publisher: "SMK TI BAZMA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "LACAK - Lapak Cari Barang Kembali",
    description:
      "Sistem Informasi Pengelolaan Barang Hilang & Temuan Terintegrasi.",
    url: siteUrl,
    siteName: "LACAK",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/images/about/hero.jpg",
        width: 1200,
        height: 630,
        alt: "LACAK Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LACAK - Lapak Cari Barang Kembali",
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

            <main className="flex-grow flex flex-col pb-16 md:pb-0">
              {children}
            </main>

            <RouteFooter />
            <MobileBottomNav />
          </ChromeVisibilityProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
