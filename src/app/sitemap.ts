import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const events = await prisma.event.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  const eventUrls: MetadataRoute.Sitemap = events.flatMap((event) => [
    {
      url: `${appUrl}/ru/e/${event.slug}`,
      lastModified: event.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${appUrl}/kk/e/${event.slug}`,
      lastModified: event.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ]);

  return [
    {
      url: `${appUrl}/ru`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${appUrl}/kk`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${appUrl}/ru/templates`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${appUrl}/kk/templates`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...eventUrls,
  ];
}
