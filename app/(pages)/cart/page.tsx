"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingFormSchema, ShippingFormInputs } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import useCartStore from "@/stores/cartStore";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

const colorTranslations: Record<string, string> = {
  blue: "آبی",
  black: "مشکی",
  white: "سفید",
  red: "قرمز",
  green: "سبز",
  brown: "قهوه‌ای",
  gray: "طوسی",
  gold: "طلایی",
  silver: "نقره‌ای",
};

const CartPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, removeFromCart, clearCart } = useCartStore();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormInputs>({
    resolver: zodResolver(shippingFormSchema),
  });

  const subtotal = cart.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
  const discount = Math.round(subtotal * 0.1);
  const shippingCost = 100000;
  const total = subtotal - discount + shippingCost;

  const onSubmit = async (values: ShippingFormInputs) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipping: values, items: cart }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error || "خطا در ثبت سفارش");
        return;
      }

      const { orderId } = await res.json();
      clearCart();
      router.push(`/orders/${orderId}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div dir="rtl" className="max-w-2xl mx-auto py-16 px-4 text-center">
        <p className="text-zinc-500 mb-4">سبد خرید شما خالی است</p>
        <Link href="/products" className="underline text-sm">
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div dir="rtl" className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-medium mb-8">سبد خرید شما</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT: ITEMS + SHIPPING FORM */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-4 bg-zinc-100 rounded-xl p-4">
            {cart.map((item) => (
              <div
                key={item.id + item.selectedColor}
                className="flex items-center justify-between border-b border-zinc-200 last:border-b-0 pb-4 last:pb-0"
              >
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 bg-zinc-200 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={item.images?.[item.selectedColor]?.[0] ?? ""}
                      fill
                      className="object-contain"
                      alt={item.name}
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <p className="font-medium text-sm">
                      {item.name} {item.shortDescription}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <span>
                        رنگ:{" "}
                        {colorTranslations[item.selectedColor] ||
                          item.selectedColor}
                      </span>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.selectedColor }}
                      />
                    </div>
                    <p className="text-sm text-zinc-500">
                      تعداد: {item.quantity}
                    </p>
                    <p className="font-medium text-sm">
                      {item.price.toLocaleString()} تومان
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={() => removeFromCart(item)}
                  className="w-8 h-8 bg-red-100 rounded-full hover:bg-red-200 transition-all duration-300 text-red-400"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>

          {/* SHIPPING FORM */}
          <div className="bg-zinc-100 rounded-xl p-4">
            <h2 className="font-medium mb-4">اطلاعات ارسال</h2>
            <form
              id="checkout-form"
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <div>
                <input
                  placeholder="نام و نام خانوادگی"
                  className="border rounded-md p-2 w-full"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name.message}</p>
                )}
              </div>
              <div>
                <input
                  placeholder="ایمیل"
                  className="border rounded-md p-2 w-full"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>
              <div>
                <input
                  placeholder="شماره تماس"
                  className="border rounded-md p-2 w-full"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <input
                  placeholder="شهر"
                  className="border rounded-md p-2 w-full"
                  {...register("city")}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs">{errors.city.message}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <input
                  placeholder="آدرس کامل"
                  className="border rounded-md p-2 w-full"
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-zinc-100 rounded-xl p-4 flex flex-col gap-4 sticky top-24">
            <h2 className="font-medium">جزئیات خرید</h2>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">جمع خرید</span>
                <span className="font-medium">
                  {subtotal.toLocaleString()} تومان
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">تخفیف ۱۰٪</span>
                <span className="font-medium">
                  {discount.toLocaleString()} تومان
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">هزینه ارسال</span>
                <span className="font-medium">
                  {shippingCost.toLocaleString()} تومان
                </span>
              </div>
              <hr className="border-zinc-300" />
              <div className="flex justify-between">
                <span className="font-semibold">جمع کل</span>
                <span className="font-medium">
                  {total.toLocaleString()} تومان
                </span>
              </div>
            </div>

            {user ? (
              <Button
                type="submit"
                form="checkout-form"
                disabled={submitting}
                className="w-full disabled:opacity-50"
              >
                {submitting ? "در حال ثبت..." : "ثبت سفارش و ادامه به پرداخت"}
              </Button>
            ) : (
              <Link href="/login">
                <Button type="button" className="w-full">
                  برای ادامه وارد حساب کاربری شوید
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
