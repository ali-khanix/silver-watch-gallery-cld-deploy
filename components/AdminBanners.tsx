"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X } from "lucide-react";

type Banner = {
  id: string;
  title: string;
  imageUrl: string;
  link: string | null;
  size: string;
  order: number;
};

const MAX_BANNERS = 30;

const AdminBanners = ({ banners }: { banners: Banner[] }) => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [size, setSize] = useState<"large" | "small">("small");

  const handleUpload = async (file: File) => {
    if (banners.length >= MAX_BANNERS) {
      toast.error(`حداکثر ${MAX_BANNERS} بنر مجاز است. ابتدا یکی را حذف کنید`);
      return;
    }
    if (!title.trim()) {
      toast.error("عنوان بنر را وارد کنید");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) {
        const { error } = await uploadRes.json();
        toast.error(error || "خطا در آپلود تصویر");
        return;
      }
      const { url } = await uploadRes.json();

      const createRes = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, imageUrl: url, link, size }),
      });

      if (!createRes.ok) {
        const { error } = await createRes.json();
        toast.error(error || "خطا در ذخیره بنر");
        return;
      }

      toast.success("بنر اضافه شد");
      setTitle("");
      setLink("");
      setSize("small");
      router.refresh();
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("حذف این بنر؟")) return;
    const res = await fetch(`/api/banners/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("خطا در حذف بنر");
      return;
    }
    toast.success("بنر حذف شد");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="relative aspect-video rounded-lg overflow-hidden border"
          >
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              className="object-cover"
            />
            <span className="absolute bottom-1 right-1 left-1 bg-black/60 text-white text-xs rounded px-1.5 py-0.5 truncate">
              {banner.title} · {banner.size === "large" ? "بزرگ" : "کوچک"}
            </span>
            <button
              onClick={() => handleDelete(banner.id)}
              className="absolute top-1 left-1 bg-black/60 rounded-full p-1"
            >
              <X size={14} className="text-white" />
            </button>
          </div>
        ))}
      </div>

      {banners.length < MAX_BANNERS && (
        <div className="flex flex-col gap-2">
          <input
            placeholder="عنوان بنر (مثلا: ساعت دیواری)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-md p-2 w-full text-sm"
          />
          <input
            placeholder="لینک (اختیاری، مثلا: /products?gender=men)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="border rounded-md p-2 w-full text-sm"
          />
          <select
            value={size}
            onChange={(e) => setSize(e.target.value as "large" | "small")}
            className="border rounded-md p-2 w-full text-sm"
          >
            <option value="large">بزرگ (ردیف اول)</option>
            <option value="small">کوچک (ردیف دوم)</option>
          </select>
          <label className="border border-dashed rounded-md p-3 text-sm text-center cursor-pointer hover:bg-zinc-50 flex items-center justify-center gap-2">
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> در حال آپلود...
              </>
            ) : (
              <>
                <Upload size={16} /> افزودن بنر ({banners.length}/
                {MAX_BANNERS})
              </>
            )}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleUpload(e.target.files[0])
              }
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
