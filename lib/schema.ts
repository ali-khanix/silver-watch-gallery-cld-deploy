import { z } from "zod";

export type CategoryType = {
  id: string;
  name: string;
  slug: string;
};

export type BrandType = {
  id: string;
  name: string;
  slug: string;
};

export type ProductType = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: number;
  offer: number | null;
  gender: string | null;
  colors: string[];
  features: string[];
  images: Record<string, string[]>;
  inStock: boolean;
  category: CategoryType;
  brand: BrandType | null;
};

export type ProductsType = ProductType[];

export type CartItemType = ProductType & {
  quantity: number;
  selectedColor: string;
};

export type CartItemsType = CartItemType[];

export const shippingFormSchema = z.object({
  name: z.string().min(1, "اسم الزامیست!"),
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .min(1, "ایمیل اشتباه است"),
  phone: z
    .string()
    .min(7, "شماره باید بین 7 تا 10 رقم باشد")
    .regex(/^\d+$/, "شماره باید عدد باشد"),

  address: z.string().min(1, "آدرس الزامیست"),
  city: z.string().min(1, "اسم شهر الزامیست"),
});

export type ShippingFormInputs = z.infer<typeof shippingFormSchema>;

export const paymentFormSchema = z.object({
  cardHolder: z.string().min(1, "اسم روی کارت الزامیست"),
  cardNumber: z.string().regex(/^\d{16}$/, "شماره کارت باید ۱۶ رقم باشد"),
  expirationDate: z
    .string()
    .regex(
      /^(0[1-9]|1[0-2])\/\d{2}$/,
      "تاریخ انقضاء باید به فرمت ماه/سال باشد (مثلاً 05/27)"
    ),

  cvv: z.string().regex(/^\d{3,4}$/, "CVV باید ۳ یا ۴ رقم باشد"),
});

export type PaymentFormInputs = z.infer<typeof paymentFormSchema>;

export type CartStoreStateType = {
  cart: CartItemsType;
  hasHydrated: boolean;
};

export type CartStoreActionsType = {
  addToCart: (product: CartItemType) => void;
  removeFromCart: (product: CartItemType) => void;
  clearCart: () => void;
};
