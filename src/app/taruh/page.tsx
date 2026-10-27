export const dynamic = "force-dynamic";

import { getMasterData } from "@/lib/master-data";
import TaruhBarangForm from "./TaruhBarangForm";

export default async function TaruhBarangPage() {
  const { categories, colors, brands, locations } = await getMasterData();

  return (
    <TaruhBarangForm
      categories={categories}
      colors={colors}
      brands={brands}
      locations={locations}
    />
  );
}