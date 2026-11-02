import { getPublicData } from "@/features/item/services/public-item-service";
import PublicSearchPortal from "@/components/public/PublicSearchPortal";

// Pencarian Publik LACAK
// Mengakses searchParams secara dinamis, sementara data katalog di-cache via unstable_cache

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
