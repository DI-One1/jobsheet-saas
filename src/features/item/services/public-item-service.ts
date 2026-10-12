import { prisma } from "@/lib/prisma";
import type { MasterFilterData, PublicFoundItem } from "../utils/public-item-utils";

export async function getPublicData(): Promise<{
  items: PublicFoundItem[];
  masterData: MasterFilterData;
}> {
  const [rawItems, categories, colors, brands, locations] = await Promise.all([
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
    prisma.categoryItem.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.colorItem.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.brandItem.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.locationItem.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return {
    items: rawItems.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() })),
    masterData: { categories, colors, brands, locations },
  };
}
