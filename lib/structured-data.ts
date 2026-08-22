import { ProductType } from "@/lib/schema";

export function buildProductJsonLd(product: ProductType, url: string) {
  const allImages = Array.from(new Set(Object.values(product.images).flat()));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: allImages,
    description:
      product.description || product.shortDescription || product.name,
    sku: product.slug,
    ...(product.brand && {
      brand: { "@type": "Brand", name: product.brand.name },
    }),
    ...(product.features &&
      product.features.length > 0 && {
        additionalProperty: product.features.map((feature) => ({
          "@type": "PropertyValue",
          name: "ویژگی",
          value: feature,
        })),
      }),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "IRR",
      price: product.price * 10,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}
