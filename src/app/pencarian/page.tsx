import type { Metadata } from "next";
import { getPublicData } from "@/features/item/services/public-item-service";
import PublicSearchPortal from "@/components/public/PublicSearchPortal";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lacak.smktibazma.sch.id";

export const metadata: Metadata = {
  title: "Pencarian Barang Temuan",
  description:
    "Cari dan filter daftar barang temuan berdasarkan nama barang, kategori, warna, merek, dan lokasi penemuan di LACAK.",
  alternates: {
    canonical: `${siteUrl}/pencarian`,
  },
  openGraph: {
    title: "Pencarian Barang Temuan | LACAK",
    description:
      "Cari dan filter daftar barang temuan berdasarkan nama barang, kategori, warna, merek, dan lokasi penemuan di LACAK.",
    url: `${siteUrl}/pencarian`,
    type: "website",
  },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { items, masterData } = await getPublicData();
  const value = (key: string) => {
    const item = params[key];
    return Array.isArray(item) ? item[0] || "" : item || "";
  };

  return (
    <PublicSearchPortal
      initialItems={items}
      masterData={masterData}
      initialQuery={value("q")}
      initialSort={(value("sort") as "newest" | "oldest" | "name") || "newest"}
      initialCategory={value("category") || "all"}
      initialColor={value("color") || "all"}
      initialBrand={value("brand") || "all"}
      initialLocation={value("location") || "all"}
      initialFrom={value("from")}
      initialTo={value("to")}
    />
  );
}
