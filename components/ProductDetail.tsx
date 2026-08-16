"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import useCartStore from "@/stores/cartStore";
import { ProductType } from "@/lib/schema";
import { ShoppingCart, Check } from "lucide-react";

const ProductDetail = ({ product }: { product: ProductType }) => {
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

  return (
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
        <p className="text-xs tracking-wide text-zinc-500 mb-3">
          {product.category.name}
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2 leading-tight">
          {product.name}
        </h1>

        {product.features && product.features.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-zinc-900 mb-3">
              ویژگی‌های اصلی
            </h2>
            <ul className="flex flex-col gap-2">
              {product.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-zinc-700"
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600 shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

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

        {/* COLOR SWATCHES + ADD TO CART */}
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

        <button
          onClick={handleAdd}
          className="bg-zinc-950 text-white rounded-full p-3 flex items-center justify-center gap-2 w-full sm:w-fit sm:px-8 cursor-pointer"
        >
          <span>افزودن به سبد</span>
          <ShoppingCart />
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
