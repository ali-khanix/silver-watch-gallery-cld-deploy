import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(1, "نام دسته بندی الزامی است"),
  slug: z
    .string()
    .min(1, "اسلاگ الزامی است")
    .regex(/^[a-z0-9-]+$/, "اسلاگ فقط حروف انگلیسی، عدد و خط تیره"),

  group: z.enum(["men", "women"]).optional(),
});

export type CategoryFormInput = z.input<typeof categoryFormSchema>;
export type CategoryFormValues = z.output<typeof categoryFormSchema>;

export const productFormSchema = z.object({
  name: z.string().min(1, "نام محصول الزامی است"),
  slug: z
    .string()
    .min(1, "اسلاگ الزامی است")
    .regex(/^[a-z0-9-]+$/, "اسلاگ فقط حروف انگلیسی، عدد و خط تیره"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  features: z.string().optional(),
  price: z.coerce.number().positive("قیمت باید مثبت باشد"),
  offer: z.coerce.number().optional(),
  gender: z.enum(["men", "women", "kids"]).optional(),
  categoryId: z.string().min(1, "دسته بندی را انتخاب کنید"),
  brandId: z.string().optional(),
  inStock: z.boolean().optional(),
  variants: z
    .array(
      z.object({
        color: z.string().min(1, "کد رنگ الزامی است"),
      })
    )
    .min(1, "حداقل یک رنگ و تصویر اضافه کنید"),
});

export type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormValues = z.output<typeof productFormSchema>;

export const brandFormSchema = z.object({
  name: z.string().min(1, "نام برند الزامی است"),
  slug: z
    .string()
    .min(1, "اسلاگ الزامی است")
    .regex(/^[a-z0-9-]+$/, "اسلاگ فقط حروف انگلیسی، عدد و خط تیره"),
});

export type BrandFormValues = z.infer<typeof brandFormSchema>;

export const heroSlideFormSchema = z.object({
  link: z.string().optional(),
});
export type HeroSlideFormValues = z.infer<typeof heroSlideFormSchema>;
