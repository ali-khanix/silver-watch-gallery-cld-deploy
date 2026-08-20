"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Pencil,
  Upload,
  X,
} from "lucide-react";

type Brand = { id: string; name: string; slug: string; logo: string | null };

const VISIBLE_COUNT = 5;

const AdminBrandsList = ({ brands }: { brands: Brand[] }) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const startEditing = (brand: Brand) => {
    setEditingId(brand.id);
    setName(brand.name);
    setSlug(brand.slug);
    setLogoUrl(brand.logo);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setLogoUrl(null);
  };

  const handleLogoUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error || "خطا در آپلود لوگو");
        return;
      }
      const { url } = await res.json();
      setLogoUrl(url);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (id: string) => {
    if (!name.trim() || !slug.trim()) {
      toast.error("نام و اسلاگ الزامی است");
      return;
    }
    setSaving(true);
    const res = await fetch(`/api/brands/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, logo: logoUrl }),
    });
    setSaving(false);

    if (!res.ok) {
      const { error } = await res.json();
      toast.error(error || "خطا در ویرایش برند");
      return;
    }
    toast.success("برند ویرایش شد");
    cancelEditing();
    router.refresh();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`حذف برند "${name}"؟`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });
    setDeletingId(null);

    if (!res.ok) {
      const { error } = await res.json();
      toast.error(error || "خطا در حذف برند");
      return;
    }
    toast.success("برند حذف شد");
    router.refresh();
  };

  const visibleBrands = expanded ? brands : brands.slice(0, VISIBLE_COUNT);
  const hiddenCount = brands.length - VISIBLE_COUNT;

  return (
    <>
      <ul className="mt-4 flex flex-col gap-2">
        {visibleBrands.map((b) => {
          const isEditing = editingId === b.id;

          if (isEditing) {
            return (
              <li
                key={b.id}
                className="flex flex-col gap-2 text-sm border rounded-md p-3 bg-zinc-50"
              >
                <div className="flex items-center gap-3">
                  {logoUrl ? (
                    <div className="relative w-16 h-16 rounded-md overflow-hidden border shrink-0">
                      <Image
                        src={logoUrl}
                        alt=""
                        fill
                        className="object-contain bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setLogoUrl(null)}
                        className="absolute top-0.5 left-0.5 bg-black/60 rounded-full p-0.5"
                      >
                        <X size={12} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex-1 border border-dashed rounded-md p-3 text-sm text-center cursor-pointer hover:bg-zinc-100 flex items-center justify-center gap-2">
                      {uploading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> در حال
                          آپلود...
                        </>
                      ) : (
                        <>
                          <Upload size={16} /> آپلود لوگو
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploading}
                        className="hidden"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          handleLogoUpload(e.target.files[0])
                        }
                      />
                    </label>
                  )}
                </div>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="نام برند"
                  className="border rounded-md p-2 w-full"
                />
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="اسلاگ"
                  className="border rounded-md p-2 w-full"
                />

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={cancelEditing}
                    disabled={saving}
                    className="px-3 py-1.5 rounded-md border disabled:opacity-50"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={() => handleSave(b.id)}
                    disabled={saving || uploading}
                    className="px-3 py-1.5 rounded-md bg-zinc-950 text-white disabled:opacity-50"
                  >
                    {saving ? "در حال ذخیره..." : "ذخیره"}
                  </button>
                </div>
              </li>
            );
          }

          return (
            <li
              key={b.id}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                {b.logo && (
                  <div className="relative w-8 h-8 rounded-md overflow-hidden border shrink-0">
                    <Image
                      src={b.logo}
                      alt=""
                      fill
                      className="object-contain bg-white"
                    />
                  </div>
                )}
                <span>
                  {b.name} ({b.slug})
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => startEditing(b)}
                  className="text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
                >
                  <Pencil size={14} /> ویرایش
                </button>
                <button
                  onClick={() => handleDelete(b.id, b.name)}
                  disabled={deletingId === b.id}
                  className="text-red-500 underline disabled:opacity-50"
                >
                  حذف
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {brands.length > VISIBLE_COUNT && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900"
        >
          {expanded ? (
            <>
              <ChevronUp size={16} /> نمایش کمتر
            </>
          ) : (
            <>
              <ChevronDown size={16} /> نمایش {hiddenCount} برند دیگر
            </>
          )}
        </button>
      )}
    </>
  );
};

export default AdminBrandsList;
