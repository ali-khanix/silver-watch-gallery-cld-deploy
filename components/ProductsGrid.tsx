import { prisma } from "@/lib/prisma";
import ProductCard from "./ProductCard";
import { ProductType } from "@/lib/schema";
import { Prisma } from "@/lib/generated/prisma/client";
import { normalizeImages } from "@/lib/normalize-images";

const ProductsGrid = async ({
  categorySlug,
  brandSlug,
  gender,
  discountedOnly,
  minPrice,
  maxPrice,
  sort,
}: {
  categorySlug?: string;
  brandSlug?: string;
  gender?: string;
  discountedOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}) => {
  const genders = gender ? gender.split(",").filter(Boolean) : [];

  const where: Prisma.ProductWhereInput = {
    inStock: true,
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    ...(brandSlug ? { brand: { slug: brandSlug } } : {}),
    ...(discountedOnly ? { offer: { not: null } } : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          price: {
            ...(minPrice !== undefined ? { gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
          },
        }
      : {}),
    ...(genders.length > 0
      ? {
          OR: genders.flatMap((g) => [
            { gender: g },
            { category: { group: g } },
          ]),
        }
      : {}),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "cheapest"
      ? { price: "asc" }
      : sort === "priciest"
        ? { price: "desc" }
        : { createdAt: "desc" };

  const rows = await prisma.product.findMany({
    where,
    include: { category: true, brand: true },
    orderBy,
  });

  const products = (rows as unknown as ProductType[]).map((p) => ({
    ...p,
    images: normalizeImages(p.images as any),
  }));

  if (products.length === 0) {
    return <p className="text-center text-zinc-500 py-10">محصولی یافت نشد</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsGrid;
