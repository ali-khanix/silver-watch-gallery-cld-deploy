import Image from "next/image";
import SearchBar from "./SearchBar";
import Link from "next/link";
import { User } from "lucide-react";

import Categories from "./Categories";
import ShoppingCartIcon from "./ShoppingCartIcon";
import MobileNav from "./MobileNav";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import ProfileButton from "./ProfileButton";
import { prisma } from "@/lib/prisma";

const Navbar = async () => {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <nav className=" bg-zinc-950 text-white sticky top-0 right-0 z-50 w-full">
      <div className="px-4 sm:px-0 py-4 flex justify-between items-center sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-6xl mx-auto sm:gap-24 flex-row-reverse sm:flex-row">
        {/* LOGO */}
        <Link href={"/"} className="sm:mx-auto sm:w-3/12 sm:translate-y-3">
          <Image
            src={`/logo.svg`}
            width={100}
            height={100}
            alt="لوگو گالری ساعت سیلور"
            className="max-w-none"
          />
        </Link>

        {/* SEARCH INPUT AND CATEGORIES */}
        <div className="w-5/12 flex flex-col gap-4 mx-4">
          <SearchBar display={"hidden"} />
        </div>

        {/* LOGIN AND CART BUTTONS */}
        <div className="hidden sm:flex items-center justify-end sm:w-4/12 gap-4">
          <ShoppingCartIcon />

          <SignedOut>
            <SignUpButton>
              <Button className="bg-transparent text-[12px]">
                <User size={64} />
                ورود یا ثبت نام
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <ProfileButton />
          </SignedIn>
        </div>

        {/* MOBILE NAV */}
        <div className="sm:hidden flex flex-row gap-7.5 justify-center items-center">
          <MobileNav categories={categories} brands={brands} />
          <ShoppingCartIcon size={32} className="text-gray-300" />
        </div>
      </div>

      <div className="hidden sm:flex justify-between items-center sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl mx-auto sm:gap-24 flex-row-reverse sm:flex-row ">
        <Categories categories={categories} brands={brands} />
      </div>
    </nav>
  );
};

export default Navbar;
