import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";

export const getMasterData = unstable_cache(
  async () => {
    try {
      const [categories, colors, brands, locations] = await Promise.all([
        prisma.categoryItem.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
        prisma.colorItem.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
        prisma.brandItem.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
        prisma.locationItem.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
      ]);

      return { categories, colors, brands, locations };
    } catch (error) {
      console.error("Gagal mengambil master data:", error);
      return { categories: [], colors: [], brands: [], locations: [] };
    }
  },
  ["master-data"],
  {
    revalidate: 3600, // Cache 1 jam di level server
    tags: ["master-data"],
  }
);
