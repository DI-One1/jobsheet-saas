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

export const metadata: Metadata = {
  title: "LACAK - Lapak Cari barang Kembali",
  description:
    "Sistem Informasi Pengelolaan Barang Hilang & Temuan Terintegrasi",
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
        <head>
          <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://images.unsplash.com" />
          <link rel="preconnect" href="https://img.clerk.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://img.clerk.com" />
        </head>
        <body
          className="font-sans min-h-screen flex flex-col bg-[#fafbfb] text-[#102824] antialiased"
          suppressHydrationWarning
        >
          <ChromeVisibilityProvider>
            <UserDatabaseSync />
            <Suspense
              fallback={
                <header className="bg-[#0d3b2e] min-h-[120px]" />
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
