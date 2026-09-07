"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  initialName: string | null;
  initialImage: string | null;
};

const EditProfileForm = ({ initialName, initialImage }: Props) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(initialName ?? "");
  const [image, setImage] = useState(initialImage);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const uploadData = await uploadRes.json();
    setUploadingPhoto(false);

    if (!uploadRes.ok) {
      toast.error(uploadData.error || "خطا در آپلود عکس");
      return;
    }

    const saveRes = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: uploadData.url }),
    });

    if (!saveRes.ok) {
      toast.error("خطا در ذخیره عکس");
      return;
    }

    setImage(uploadData.url);
    toast.success("عکس پروفایل بروزرسانی شد");
    router.refresh();
  };

  const handleSaveName = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setSaving(false);

    if (!res.ok) {
      toast.error("خطا در ذخیره نام");
      return;
    }
    toast.success("نام با موفقیت بروزرسانی شد");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-zinc-200 shrink-0">
          {image ? (
            <Image src={image} alt="عکس پروفایل" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs">
              بدون عکس
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingPhoto}
          className="flex items-center gap-2 text-sm text-zinc-600 border rounded-lg px-3 py-2 hover:bg-zinc-50 disabled:opacity-50"
        >
          <Camera size={16} />
          {uploadingPhoto ? "در حال آپلود..." : "تغییر عکس"}
        </button>
      </div>

      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="نام و نام خانوادگی"
          className="border rounded-lg px-3 py-2 flex-1 text-sm"
        />
        <Button onClick={handleSaveName} disabled={saving || !name.trim()}>
          {saving ? "در حال ذخیره..." : "تغییر نام"}
        </Button>
      </div>
    </div>
  );
};

export default EditProfileForm;
