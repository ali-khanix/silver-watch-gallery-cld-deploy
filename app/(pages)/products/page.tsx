import { Suspense } from "react";
import ProductsGrid from "@/components/ProductsGrid";
import ProductsSortDropdown from "@/components/ProductsSortDropdown";
import ProductsFilterSidebar from "@/components/ProductsFilterSidebar";

type Props = {
  searchParams: Promise<{
    category?: string;
    gender?: string;
    discounted?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const { category, gender, discounted, minPrice, maxPrice, sort } =
    await searchParams;

  return (
    <div dir="rtl" className="py-8 mx-3 sm:mx-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">همه محصولات</h1>
        <Suspense fallback={null}>
          <ProductsSortDropdown />
        </Suspense>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Suspense fallback={null}>
            <ProductsFilterSidebar />
          </Suspense>
        </div>

        <div className="flex-1">
          <ProductsGrid
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
