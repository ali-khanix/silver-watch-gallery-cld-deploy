"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { MenuIcon, ChevronDown, Watch } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CategoryNav } from "@/lib/category-type";

type Brand = { id: string; name: string; slug: string };

const MobileNav = ({
  categories,
  brands,
}: {
  categories: CategoryNav[];
  brands: Brand[];
}) => {
  const [open, setOpen] = useState(false);

  const menGroup = categories.filter((c) => c.group === "men");
  const womenGroup = categories.filter((c) => c.group === "women");
  const kidsGroup = categories.filter((c) => c.group === "kids");
  const smartGroup = categories.filter((c) => c.group === "smart");
  const coupleGroup = categories.filter((c) => c.group === "couple");
  const ungrouped = categories.filter((c) => !c.group);

  const groups = [
    ...(menGroup.length ? [{ title: "ساعت مچی مردانه", items: menGroup }] : []),
    ...(womenGroup.length
      ? [{ title: "ساعت مچی زنانه", items: womenGroup }]
      : []),
    ...(kidsGroup.length ? [{ title: "ساعت بچگانه", items: kidsGroup }] : []),
    ...(smartGroup.length ? [{ title: "ساعت هوشمند", items: smartGroup }] : []),
    ...(coupleGroup.length
      ? [{ title: "ست مردانه و زنانه", items: coupleGroup }]
      : []),
    ...(ungrouped.length
      ? [{ title: "سایر دسته بندی ها", items: ungrouped }]
      : []),
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <MenuIcon size={32} />
      </SheetTrigger>
      <SheetContent className={"bg-zinc-200 px-4"}>
        <SheetHeader className={"hidden"}>
          <SheetTitle>منو</SheetTitle>
        </SheetHeader>

        <ul className="flex flex-col gap-4 mt-4 flex-1 min-h-0 overflow-y-auto pb-8">
          {/* CATEGORIES */}
          {groups.length > 0 && (
            <Collapsible>
              <CollapsibleTrigger
                className={"mt-14 flex justify-between w-full"}
              >
                <div className="flex flex-row gap-2">
                  <Watch className="text-zinc-700" />
                  دسته بندی ها
                </div>
                <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-4 p-4 ">
                  <Link
                    href="/products"
                    className="text-base font-medium text-zinc-900 hover:text-zinc-700"
                    onClick={() => setOpen(false)}
                  >
                    همه محصولات
                  </Link>
                  {groups.map((group) => (
                    <Collapsible key={group.title}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between text-right text-base font-medium text-zinc-900">
                        {group.title}
                        <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>

                      <CollapsibleContent className="mt-2 ml-4 flex flex-col gap-3 text-sm text-zinc-700">
                        {group.items.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/products?category=${cat.slug}`}
                            className="hover:text-zinc-900"
                            onClick={() => setOpen(false)}
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* BRANDS */}
          {brands.length > 0 && (
            <Collapsible>
              <CollapsibleTrigger className="flex justify-between w-full">
                <div className="flex flex-row gap-2">
                  <Watch className="text-zinc-700" />
                  برند ها
                </div>
                <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-3 p-4 text-sm text-zinc-700">
                  <Link
                    href="/brands"
                    className="font-medium text-zinc-900 hover:text-zinc-700"
                    onClick={() => setOpen(false)}
                  >
                    همه ی برند ها
                  </Link>
                  {brands.map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/brands/${brand.slug}`}
                      className="hover:text-zinc-900"
                      onClick={() => setOpen(false)}
                    >
                      {brand.name}
                    </Link>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          <Link onClick={() => setOpen(false)} href={"/offers"}>
            تخفیف ها
          </Link>
          <Link onClick={() => setOpen(false)} href={"/call-us"}>
            تماس با ما
          </Link>
        </ul>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
