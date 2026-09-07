"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import useCartStore from "@/stores/cartStore";
import { ProductType } from "@/lib/schema";
import { ShoppingCart, Pencil } from "lucide-react";

const ProductDetail = ({
  product,
  isAdmin = false,
}: {
  product: ProductType;
  isAdmin?: boolean;
}) => {
  const [color, setColor] = useState(product.colors[0]);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCartStore();

  const images = product.images[color] || [];

  const handleColorChange = (c: string) => {
    setColor(c);
    setActiveImage(0);
  };

  const handleAdd = () => {
    addToCart({ ...product, quantity: 1, selectedColor: color });
    toast.success("محصول به کارت اضافه شد");
  };

  // Splits "مناسب برای: کاربری عمومی" into { label: "مناسب برای", value: "کاربری عمومی" }
  // Falls back to a single plain value if there's no ":" in the string.
  const parseFeature = (feature: string) => {
    const idx = feature.indexOf(":");
    if (idx === -1) {
      return { label: null, value: feature.trim() };
    }
    return {
      label: feature.slice(0, idx).trim(),
      value: feature.slice(idx + 1).trim(),
    };
  };

  const topFeatures = product.features?.slice(0, 3) || [];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mx-3 sm:mx-0">
        {/* GALLERY */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-50">
            <Image
              src={images[activeImage] || ""}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, index) => (
                <button
                  key={img + index}
                  onClick={() => setActiveImage(index)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 ${
                    activeImage === index
                      ? "border-zinc-950"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs tracking-wide text-zinc-500">
              {product.category.name}
            </p>
            {isAdmin && (
              <Link
                href={`/admin/products/${product.id}`}
                className="flex items-center gap-1 text-xs bg-zinc-950 text-zinc-100 rounded-lg px-3 py-2 hover:bg-zinc-700 transition-colors"
              >
                <Pencil size={14} />
                ویرایش محصول
              </Link>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2 leading-tight">
            {product.name}
          </h1>

          {product.shortDescription && (
            <p className="text-zinc-500 mb-6">{product.shortDescription}</p>
          )}

          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-2xl sm:text-3xl font-bold text-zinc-900">
              {product.price.toLocaleString("fa-IR")} تومان
            </span>
            {product.offer && (
              <span className="text-base line-through text-zinc-400">
                {product.offer.toLocaleString("fa-IR")} تومان
              </span>
            )}
          </div>

          {product.description && (
            <>
              <div className="h-px bg-zinc-200 mb-6" />
              <div className="mb-8">
                <h2 className="text-sm font-medium text-zinc-900 mb-2">
                  توضیحات محصول
                </h2>
                <p className="text-zinc-600 leading-8 text-sm">
                  {product.description}
                </p>
              </div>
            </>
          )}

          {/* COLOR SWATCHES */}
          <div className="flex items-center gap-2 mb-4">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => handleColorChange(c)}
                className={`w-6 h-6 rounded-full border-2 ${
                  color === c ? "border-zinc-950" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* TOP 3 FEATURES */}
          {topFeatures.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-6 bg-zinc-100 rounded-2xl p-4">
              {topFeatures.map((feature, i) => {
                const { label, value } = parseFeature(feature);
                return (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs shadow-sm"
                  >
                    {label && <span className="text-zinc-500">{label}:</span>}
                    <span className="text-zinc-800 font-medium">{value}</span>
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={handleAdd}
            className="bg-zinc-950 text-white rounded-full p-3 flex items-center justify-center gap-2 w-full sm:w-fit sm:px-8 cursor-pointer"
          >
            <span>افزودن به سبد</span>
            <ShoppingCart />
          </button>
        </div>
      </div>

      {/* SPECS / FEATURES TABLE */}
      {product.features && product.features.length > 0 && (
        <div className="mx-3 sm:mx-0 mt-12 lg:mt-16">
          <div className="max-w-xl mx-auto border border-zinc-200 rounded-2xl p-4 sm:p-6">
            <h2 className="text-lg font-bold text-zinc-900 mb-4">
              مشخصات محصول
            </h2>
            <div className="flex flex-col">
              {product.features.map((feature, i) => {
                const { label, value } = parseFeature(feature);
                return (
                  <div
                    key={i}
                    className="flex items-center gap-25 py-3 border-b border-zinc-100 last:border-none"
                  >
                    {label ? (
                      <>
                        <span className="text-sm text-zinc-400 w-28 shrink-0">
                          {label}
                        </span>
                        <span className="text-sm font-medium text-zinc-900">
                          {value}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-medium text-zinc-900">
                        {value}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
