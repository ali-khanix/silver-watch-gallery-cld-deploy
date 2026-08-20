"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { categoryFormSchema, CategoryFormValues } from "@/lib/admin-schema";

const AdminCategoryForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
  });

  const onSubmit = async (values: CategoryFormValues) => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const { error } = await res.json();
      toast.error(error || "خطا در ایجاد دسته بندی");
      return;
    }
    toast.success("دسته بندی اضافه شد");
    reset();
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div>
        <input
          placeholder="نام دسته بندی (مثلا: ساعت مچی مردانه)"
          className="border rounded-md p-2 w-full"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <select
        className="border rounded-md p-2 w-full"
        {...register("group")}
        defaultValue=""
      >
        <option value="">بدون گروه</option>
        <option value="men">مردانه</option>
        <option value="women">زنانه</option>
        <option value="kids">بچگانه</option>
        <option value="smart">ساعت هوشمند</option>
        <option value="couple">ست مردانه و زنانه</option>
      </select>
      <div>
        <input
          placeholder="اسلاگ (مثلا: mens-watch)"
          className="border rounded-md p-2 w-full"
          {...register("slug")}
        />
        {errors.slug && (
          <p className="text-red-500 text-sm">{errors.slug.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-zinc-950 text-white rounded-md p-2 disabled:opacity-50"
      >
        افزودن دسته بندی
      </button>
    </form>
  );
};

export default AdminCategoryForm;
