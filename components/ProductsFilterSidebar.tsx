"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const ProductsFilterSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentGenders = (searchParams.get("gender") ?? "")
    .split(",")
    .filter(Boolean);
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const toggleGender = (g: string) => {
    const next = currentGenders.includes(g)
      ? currentGenders.filter((x) => x !== g)
      : [...currentGenders, g];
    updateParam("gender", next.length > 0 ? next.join(",") : null);
  };

  const toggleBoolean = (key: string) => {
    updateParam(key, searchParams.get(key) === "true" ? null : "true");
  };

  const applyPriceRange = () => {
    const params = new URLSearchParams(searchParams.toString());
    minPrice ? params.set("minPrice", minPrice) : params.delete("minPrice");
    maxPrice ? params.set("maxPrice", maxPrice) : params.delete("maxPrice");
    router.push(`/products?${params.toString()}`);
  };

  return (
    <aside dir="rtl" className="flex flex-col gap-8 w-full lg:w-72 shrink-0">
      <h2 className="font-bold text-2xl">فیلترها</h2>

      <div className="flex flex-col gap-4 pb-6 border-b border-zinc-200">
        <label className="flex items-center gap-3 text-base cursor-pointer">
          <input
            type="checkbox"
            checked={searchParams.get("discounted") === "true"}
            onChange={() => toggleBoolean("discounted")}
            className="w-5 h-5 accent-zinc-950 cursor-pointer"
          />
          محصولات تخفیف دار
        </label>
      </div>

      <div className="flex flex-col gap-4 pb-6 border-b border-zinc-200">
        <p className="text-lg font-semibold">جنسیت ها</p>
        <div className="flex flex-col gap-3">
          {[
            { value: "men", label: "مردانه" },
            { value: "women", label: "زنانه" },
            { value: "kids", label: "بچگانه" },
          ].map((g) => (
            <label
              key={g.value}
              className="flex items-center gap-3 text-base cursor-pointer"
            >
              <input
                type="checkbox"
                checked={currentGenders.includes(g.value)}
                onChange={() => toggleGender(g.value)}
                className="w-5 h-5 accent-zinc-950 cursor-pointer"
              />
              {g.label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-lg font-semibold">قیمت (تومان)</p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="از"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border border-zinc-300 rounded-xl p-3 text-base w-full focus:outline-none focus:ring-2 focus:ring-zinc-950"
          />
          <span className="text-zinc-400 text-sm shrink-0">تا</span>
          <input
            type="number"
            placeholder="۵۰۰,۰۰۰,۰۰۰"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border border-zinc-300 rounded-xl p-3 text-base w-full focus:outline-none focus:ring-2 focus:ring-zinc-950"
          />
        </div>
        <button
          onClick={applyPriceRange}
          className="bg-zinc-950 text-white rounded-xl py-3 text-base font-medium hover:bg-zinc-800 transition-colors"
        >
          اعمال فیلتر قیمت
        </button>
      </div>
    </aside>
  );
};

export default ProductsFilterSidebar;
