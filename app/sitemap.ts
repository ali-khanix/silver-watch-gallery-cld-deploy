import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://silverwatchgallery.com";

  const [products, brands, categories] = await Promise.all([
    prisma.product.findMany({ select: { slug: true, createdAt: true } }),
    prisma.brand.findMany({ select: { slug: true } }),
    prisma.category.findMany({ select: { slug: true } }),
  ]);

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/brands`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/offers`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/collections`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/call-us`, changeFrequency: "monthly", priority: 0.3 },
    ...products.map((p) => ({
      url: `${base}/products/${p.slug}`,
      lastModified: p.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...brands.map((b) => ({
      url: `${base}/brands/${b.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...categories.map((c) => ({
      url: `${base}/products?category=${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
