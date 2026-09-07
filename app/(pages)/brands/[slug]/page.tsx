import { notFound } from "next/navigation";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import ProductsGrid from "@/components/ProductsGrid";
import ProductsSortDropdown from "@/components/ProductsSortDropdown";
import ProductsFilterSidebar from "@/components/ProductsFilterSidebar";
import Image from "next/image";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    category?: string;
    gender?: string;
    discounted?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
};

export default async function BrandPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { category, gender, discounted, minPrice, maxPrice, sort } =
    await searchParams;

  const brand = await prisma.brand.findUnique({ where: { slug } });
  if (!brand) {
    notFound();
  }

  return (
    <div dir="rtl" className="py-8 mx-3 sm:mx-0">
      <div className="flex items-center gap-3 mb-6">
        {brand.logo && (
          <div className="relative w-12 h-12 shrink-0">
            <Image
              src={brand.logo}
              alt={brand.name}
              fill
              className="object-contain"
            />
          </div>
        )}
        <h1 className="text-xl font-bold">محصولات {brand.name}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Suspense fallback={null}>
            <ProductsFilterSidebar />
          </Suspense>
        </div>

        <div className="flex-1">
          <ProductsGrid
            brandSlug={slug}
            categorySlug={category}
            gender={gender}
            discountedOnly={discounted === "true"}
            minPrice={minPrice ? Number(minPrice) : undefined}
            maxPrice={maxPrice ? Number(maxPrice) : undefined}
            sort={sort}
          />
        </div>
      </div>
    </div>
  );
}
