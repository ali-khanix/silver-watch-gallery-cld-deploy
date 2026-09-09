import Image from "next/image";
import SearchBar from "./SearchBar";
import MobileSearchButton from "./MobileSearchButton";
import Link from "next/link";
import { cookies } from "next/headers";

import Categories from "./Categories";
import ShoppingCartIcon from "./ShoppingCartIcon";
import MobileNav from "./MobileNav";
import AuthButtons from "./AuthButtons";
import { prisma } from "@/lib/prisma";

const Navbar = async () => {
  const [categories, brands, cookieStore] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    cookies(),
  ]);

  const isAdmin = cookieStore.get("admin_auth")?.value === "true";

  return (
    <nav className=" bg-zinc-950 text-white sticky top-0 right-0 z-50 w-full">
      <div className="px-4 sm:px-0 py-2 sm:py-4 flex justify-between items-center sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-6xl mx-auto sm:gap-24 flex-row-reverse sm:flex-row">
        {/* LOGO */}
        <Link href={"/"} className="sm:mx-auto sm:w-3/12 sm:translate-y-3">
          {/* Mobile logo */}
          <Image
            src={`/logo-mobile.png`}
            width={40}
            height={42}
            alt="لوگو گالری ساعت سیلور"
            className="sm:hidden w-10 h-auto"
          />
          {/* Desktop logo */}
          <Image
            src={`/logo.png`}
            width={100}
            height={105}
            alt="لوگو گالری ساعت سیلور"
            className="hidden sm:block max-w-none"
          />
        </Link>

        {/* SEARCH INPUT AND CATEGORIES */}
        <div className="hidden sm:flex sm:flex-col sm:w-5/12 sm:gap-4 sm:mx-4">
          <SearchBar display={"hidden"} isAdmin={isAdmin} />
        </div>

        {/* LOGIN AND CART BUTTONS */}
        <div className="hidden sm:flex items-center justify-end sm:w-4/12 gap-4">
          <ShoppingCartIcon />
          <AuthButtons />
        </div>

        {/* MOBILE NAV */}
        <div className="sm:hidden flex flex-row gap-5 justify-center items-center">
          <MobileNav categories={categories} brands={brands} />
          <MobileSearchButton isAdmin={isAdmin} />
          <ShoppingCartIcon size={26} className="text-gray-300" />
        </div>
      </div>

      <div className="hidden sm:flex justify-between items-center sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl mx-auto sm:gap-24 flex-row-reverse sm:flex-row ">
        <Categories categories={categories} brands={brands} />
      </div>
    </nav>
  );
};

export default Navbar;
