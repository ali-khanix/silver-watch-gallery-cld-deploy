"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { X, Loader2, Upload } from "lucide-react";
import {
  productFormSchema,
  ProductFormInput,
  ProductFormValues,
} from "@/lib/admin-schema";

type Brand = { id: string; name: string; slug: string };
type Category = { id: string; name: string; slug: string };

type ExistingProduct = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  price: number;
  offer: number | null;
  gender: string | null;
  colors: string[];
  features: string[];
  images: Record<string, string[]>;
  categoryId: string;
  brandId: string | null;
  inStock: boolean;
};

const AdminProductForm = ({
  categories,
  brands,
  existingProduct,
}: {
  categories: Category[];
  brands: Brand[];
  existingProduct?: ExistingProduct;
}) => {
  const router = useRouter();
  const isEditMode = Boolean(existingProduct);

  const [variantImages, setVariantImages] = useState<string[][]>(
    existingProduct
      ? existingProduct.colors.map(
          (color) => existingProduct.images[color] || []
        )
      : [[]]
  );
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput, any, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: existingProduct
      ? {
          name: existingProduct.name,
          slug: existingProduct.slug,
          shortDescription: existingProduct.shortDescription ?? "",
          description: existingProduct.description ?? "",
          price: existingProduct.price,
          features: existingProduct?.features?.join("\n") ?? "",
          offer: existingProduct.offer ?? undefined,
          gender: (existingProduct.gender ?? undefined) as any,
          categoryId: existingProduct.categoryId,
          brandId: existingProduct.brandId ?? undefined,
          inStock: existingProduct.inStock,
          variants: existingProduct.colors.map((color) => ({ color })),
        }
      : { variants: [{ color: "#000000" }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const handleAppendVariant = () => {
    append({ color: "#000000" });
    setVariantImages((prev) => [...prev, []]);
  };

  const handleRemoveVariant = (index: number) => {
    remove(index);
    setVariantImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFilesSelected = async (
    index: number,
    fileList: FileList | null
  ) => {
    if (!fileList || fileList.length === 0) return;

    setUploadingIndex(index);
    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(fileList)) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const { error } = await res.json();
          toast.error(error || `خطا در آپلود ${file.name}`);
          continue;
        }

        const { url } = await res.json();
        uploadedUrls.push(url);
      }

      setVariantImages((prev) => {
        const next = [...prev];
        next[index] = [...(next[index] || []), ...uploadedUrls];
        return next;
      });
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleRemoveImage = (variantIndex: number, imageIndex: number) => {
    setVariantImages((prev) => {
      const next = [...prev];
      next[variantIndex] = next[variantIndex].filter(
        (_, i) => i !== imageIndex
      );
      return next;
    });
  };

  const onSubmit = async (values: ProductFormValues) => {
    const emptyVariantIndex = values.variants.findIndex(
      (_, i) => !variantImages[i] || variantImages[i].length === 0
    );
    if (emptyVariantIndex !== -1) {
      toast.error(
        `برای رنگ شماره ${emptyVariantIndex + 1} حداقل یک تصویر آپلود کنید`
      );
      return;
    }

    const images: Record<string, string[]> = {};
    const colors: string[] = [];
    const featuresArray = values.features
      ? values.features
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean)
      : [];

    values.variants.forEach((v, i) => {
      images[v.color] = variantImages[i];
      colors.push(v.color);
    });

    const payload = {
      name: values.name,
      slug: values.slug,
      shortDescription: values.shortDescription,
      description: values.description,
      features: featuresArray,
      price: values.price,
      offer: values.offer,
      gender: values.gender,
      categoryId: values.categoryId,
      brandId: values.brandId,
      inStock: values.inStock,
      colors,
      images,
    };

    const url = isEditMode
      ? `/api/products/${existingProduct!.id}`
      : "/api/products";
    const method = isEditMode ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const { error } = await res.json();
      toast.error(error || "خطا در ذخیره محصول");
      return;
    }

    toast.success(isEditMode ? "محصول ویرایش شد" : "محصول اضافه شد");

    if (isEditMode) {
      router.push("/admin");
      router.refresh();
    } else {
      reset({ variants: [{ color: "#000000" }] });
      setVariantImages([[]]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div>
        <input
          placeholder="نام محصول"
          className="border rounded-md p-2 w-full"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <input
          placeholder="اسلاگ (مثلا: rolex-classic-1)"
          className="border rounded-md p-2 w-full"
          {...register("slug")}
        />
        {errors.slug && (
          <p className="text-red-500 text-sm">{errors.slug.message}</p>
        )}
      </div>

      <input
        placeholder="توضیح کوتاه"
        className="border rounded-md p-2 w-full"
        {...register("shortDescription")}
      />

      <textarea
        placeholder="ویژگی‌های اصلی (هر خط یک ویژگی، مثلا: اسلازنجر اورجینال انگلیس)"
        className="border rounded-md p-2 w-full"
        rows={4}
        {...register("features")}
      />

      <textarea
        placeholder="توضیحات کامل"
        className="border rounded-md p-2 w-full"
        {...register("description")}
      />

      <div className="flex gap-3">
        <div className="flex-1">
          <input
            type="number"
            placeholder="قیمت (تومان)"
            className="border rounded-md p-2 w-full"
            {...register("price")}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>
        <div className="flex-1">
          <input
            type="number"
            placeholder="قیمت قبل از تخفیف (اختیاری)"
            className="border rounded-md p-2 w-full"
            {...register("offer")}
          />
        </div>
      </div>

      <select
        className="border rounded-md p-2 w-full"
        {...register("gender")}
        defaultValue={existingProduct?.gender ?? ""}
      >
        <option value="">بدون جنسیت (اختیاری)</option>
        <option value="men">مردانه</option>
        <option value="women">زنانه</option>
        <option value="kids">بچگانه</option>
      </select>

      <div>
        <select
          className="border rounded-md p-2 w-full"
          {...register("categoryId")}
          defaultValue={existingProduct?.categoryId ?? ""}
        >
          <option value="" disabled>
            انتخاب دسته بندی
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
        )}
      </div>

      <select
        className="border rounded-md p-2 w-full"
        {...register("brandId")}
        defaultValue={existingProduct?.brandId ?? ""}
      >
        <option value="">بدون برند (اختیاری)</option>
        {brands.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          {...register("inStock")}
          defaultChecked={existingProduct ? existingProduct.inStock : true}
        />
        موجود در انبار
      </label>

      <div className="flex flex-col gap-4">
        <p className="font-medium">رنگ ها و تصاویر</p>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col gap-3 border rounded-md p-3"
          >
            <div className="flex gap-2 items-center">
              <input
                type="color"
                className="w-12 h-10 border rounded-md shrink-0"
                {...register(`variants.${index}.color` as const)}
              />
              <label className="flex-1 border border-dashed rounded-md p-2 text-sm text-center cursor-pointer hover:bg-zinc-50 flex items-center justify-center gap-2">
                {uploadingIndex === index ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    در حال آپلود...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    انتخاب تصویر (چند فایل مجاز است)
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={uploadingIndex === index}
                  onChange={(e) => handleFilesSelected(index, e.target.files)}
                />
              </label>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(index)}
                  className="text-red-500 px-2 shrink-0"
                >
                  حذف رنگ
                </button>
              )}
            </div>

            {variantImages[index]?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {variantImages[index].map((url, imgIndex) => (
                  <div
                    key={url + imgIndex}
                    className="relative w-16 h-16 rounded-md overflow-hidden border shrink-0"
                  >
                    <Image src={url} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index, imgIndex)}
                      className="absolute top-0.5 left-0.5 bg-black/60 rounded-full p-0.5"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {errors.variants?.root && (
          <p className="text-red-500 text-sm">{errors.variants.root.message}</p>
        )}
        <button
          type="button"
          onClick={handleAppendVariant}
          className="text-sm underline w-fit"
        >
          + افزودن رنگ دیگر
        </button>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || uploadingIndex !== null}
        className="bg-zinc-950 text-white rounded-md p-2 disabled:opacity-50 mt-2"
      >
        {isEditMode ? "ذخیره تغییرات" : "افزودن محصول"}
      </button>
    </form>
  );
};

export default AdminProductForm;
