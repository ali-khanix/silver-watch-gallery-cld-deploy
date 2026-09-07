import { prisma } from "@/lib/prisma";
import { ProductType } from "@/lib/schema";
import ProductsCarousel from "./ProductsCarousel";
import { normalizeImages } from "@/lib/normalize-images";

const ProductsList = async ({
  discountedOnly,
}: {
  discountedOnly?: boolean;
}) => {
  const rows = await prisma.product.findMany({
    where: {
      inStock: true,
      ...(discountedOnly ? { offer: { not: null } } : {}),
    },
    include: { category: true, brand: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const products = (rows as unknown as ProductType[]).map((p) => ({
    ...p,
    images: normalizeImages(p.images as any),
  }));

  if (products.length === 0) {
    return (
      <p className="text-center text-zinc-500 py-6 mx-3 sm:mx-0">
        محصولی یافت نشد
      </p>
    );
  }

  return <ProductsCarousel products={products} />;
};

export default ProductsList;
