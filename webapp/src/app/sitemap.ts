import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const lastContentUpdate = new Date("2025-09-04T00:00:00.000Z");

  return [
    {
      url: baseUrl,
      lastModified: lastContentUpdate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/transactions`,
      lastModified: lastContentUpdate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
