import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lacak.smktibazma.sch.id";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/pencarian", "/tentang-kami", "/beri-saran", "/images/"],
        disallow: [
          "/dashboard",
          "/taruh",
          "/lapor",
          "/ambil",
          "/data-warga",
          "/riwayat/",
          "/sign-in",
          "/access-denied",
          "/api/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

