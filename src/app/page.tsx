import PublicPortal from "@/components/public/PublicPortal";
import { getPublicData } from "@/features/item/services/public-item-service";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const { items, masterData } = await getPublicData();


  return (
    <div className="min-h-screen bg-[#fafbfb]">
      <PublicPortal initialItems={items} masterData={masterData} />
    </div>
  );
}
