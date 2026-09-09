"use client";

import { SearchIcon, Loader2, Pencil } from "lucide-react";
import { Input } from "./ui/input";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type SearchResult = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  price: number;
  images: Record<string, string[]>;
  colors: string[];
  inStock: boolean;
};

const SearchBar = ({
  display,
  isAdmin = false,
  autoFocus = false,
}: {
  display: string;
  isAdmin?: boolean;
  autoFocus?: boolean;
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/products/search?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(data);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${display} sm:flex sm:flex-col`}
    >
      <div className="relative w-full">
        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <Input
          placeholder={"جستجو..."}
          type={"search"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setOpen(true)}
          autoFocus={autoFocus}
          className="pr-10 border-zinc-500 border py-6 rounded-2xl"
        />
        {loading && (
          <Loader2
            className="absolute left-3 top-1/2 -translate-y-1/2 animate-spin text-zinc-400"
            size={18}
          />
        )}
      </div>

      {open && (
        <div
          dir="rtl"
          className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-lg border border-zinc-200 overflow-hidden z-20"
        >
          {results.length === 0 ? (
            <p className="text-center text-sm text-zinc-500 py-4">
              محصولی یافت نشد
            </p>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 hover:bg-zinc-50 transition-colors border-b last:border-b-0 border-zinc-100"
              >
                <Link
                  href={`/products/${product.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-zinc-100">
                    <Image
                      src={product.images?.[product.colors[0]]?.[0] || ""}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-zinc-900 line-clamp-1">
                      {product.name}
                    </span>
                    <span className="text-xs text-zinc-500 flex items-center gap-2">
                      {product.price.toLocaleString()} تومان
                      {isAdmin && !product.inStock && (
                        <span className="text-red-500">ناموجود</span>
                      )}
                    </span>
                  </div>
                </Link>

                {isAdmin && (
                  <Link
                    href={`/admin/products/${product.id}`}
                    onClick={() => setOpen(false)}
                    className="shrink-0 flex items-center gap-1 text-xs bg-zinc-100 text-zinc-700 rounded-lg px-2 py-2 hover:bg-zinc-200 transition-colors"
                  >
                    <Pencil size={14} />
                    ویرایش
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
