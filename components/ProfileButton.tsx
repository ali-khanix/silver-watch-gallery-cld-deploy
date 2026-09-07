"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User as UserIcon, ShoppingBag, LogOut } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";

type Props = {
  user: { phone: string; name: string | null; image?: string | null };
};

const ProfileButton = ({ user }: Props) => {
  const router = useRouter();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-white text-sm"
      >
        {user.image ? (
          <div className="relative w-6 h-6 rounded-full overflow-hidden">
            <Image src={user.image} alt="" fill className="object-cover" />
          </div>
        ) : (
          <UserIcon size={20} />
        )}
        <span>{user.name || user.phone}</span>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-48 bg-white text-zinc-800 rounded-lg shadow-lg border border-zinc-100 overflow-hidden z-50">
          <button
            onClick={() => {
              setOpen(false);
              router.push("/user");
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-zinc-50 text-right"
          >
            <UserIcon size={16} />
            پروفایل من
          </button>
          <button
            onClick={() => {
              setOpen(false);
              router.push("/orders");
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-zinc-50 text-right"
          >
            <ShoppingBag size={16} />
            مشاهده سفارش‌ها
          </button>
          <button
            onClick={async () => {
              setOpen(false);
              await logout();
              router.push("/");
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-zinc-50 text-right text-red-600"
          >
            <LogOut size={16} />
            خروج از حساب
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
