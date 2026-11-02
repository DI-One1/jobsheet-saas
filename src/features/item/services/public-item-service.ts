import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getMasterData } from "@/lib/master-data";
import type { MasterFilterData, PublicFoundItem } from "../utils/public-item-utils";

export const getPublicData = unstable_cache(
  async (): Promise<{
    items: PublicFoundItem[];
    masterData: MasterFilterData;
  }> => {
    const [rawItems, masterData] = await Promise.all([
      prisma.foundItem.findMany({
        where: { status: "FOUND" },
        select: {
          id: true,
          businessCode: true,
          jenis: { select: { name: true } },
          warna: { select: { name: true } },
          merek: { select: { name: true } },
          lokasi: { select: { name: true } },
          additionalDesc: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      getMasterData(),
    ]);

    return {
      items: rawItems.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      })),
      masterData,
    };
  },
  ["public-catalog-data"],
  { revalidate: 60, tags: ["public-items"] }
);
