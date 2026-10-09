"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import PublicNavbar from "../public/PublicNavbar";
import { isPetugasEmail } from "@/lib/petugas-access";
import { useChromeVisibility } from "./ChromeVisibility";

// Halaman yang tidak menampilkan navbar sama sekali (hanya tombol kembali)
const noNavbarPaths = new Set([
  "/tentang-kami",
  "/beri-saran",
  "/access-denied",
]);

// Halaman publik yang menampilkan PublicNavbar
const publicPaths = new Set(["/", "/pencarian"]);

export default function RouteChrome({
  publicData,
}: {
  publicData: {
    categories: { id: string; name: string }[];
    colors: { id: string; name: string }[];
    brands: { id: string; name: string }[];
    locations: { id: string; name: string }[];
  };
}) {
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useUser();
  const { isNotFound } = useChromeVisibility();

  if (isNotFound || pathname === "/test" || pathname.startsWith("/test/")) {
    return null;
  }

  if (noNavbarPaths.has(pathname)) {
    return null;
  }

  if (publicPaths.has(pathname)) {
    return <PublicNavbar {...publicData} />;
  }

  const isPetugas = user?.emailAddresses.some((email) =>
    isPetugasEmail(email.emailAddress)
  );

  if (!isLoaded || !isSignedIn || !isPetugas) {
    return null;
  }

  return <Navbar />;
}