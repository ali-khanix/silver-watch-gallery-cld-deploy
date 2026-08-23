import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductType } from "@/lib/schema";
import ProductDetail from "@/components/ProductDetail";
import { normalizeImages } from "@/lib/normalize-images";
import { buildProductJsonLd } from "@/lib/structured-data";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id: slug } = await params;

  const row = await prisma.product.findUnique({
    where: { slug },
    select: {
      name: true,
      shortDescription: true,
      description: true,
      images: true,
    },
  });

  if (!row) {
    return {
      title: "محصول یافت نشد",
    };
  }

  const description =
    row?.shortDescription ||
    row?.description ||
    "مشاهده جزئیات این ساعت در گالری ساعت سیلور";

  const normalizedImage = normalizeImages(row.images as any);
  const firstImage =
    Object.values(normalizedImage).flat()[0] ||
    "https://silverwatchgallery.com/images/hero-1.webp";

  const url = `https://silverwatchgallery.com/products/${slug}`;
  const title = `${row.name} | گالری ساعت سیلور`;

  return {
    title,
    description,

    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "Silver Watch Gallery",
      locale: "fa_IR",
      images: [
        {
          url: firstImage,
          width: 1200,
          height: 630,
          alt: row.name,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      image: [firstImage],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id: slug } = await params;

  const row = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, brand: true },
  });

  if (!row) {
    notFound();
  }

  const product = {
    ...(row as unknown as ProductType),
    images: normalizeImages((row as any).images),
  };

  const productUrl = `https://silverwatchgallery.com/products/${product.slug}`;
  const jsonLd = buildProductJsonLd(product, productUrl);

  return (
    <div dir="rtl" className="py-8 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <ProductDetail product={product} />
    </div>
  );
}
