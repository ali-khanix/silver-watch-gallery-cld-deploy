import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { CategoryNav } from "@/lib/category-type";

type Brand = { id: string; name: string; slug: string; logo: string | null };

const staticMenuItems = [
  { name: "کالکشن ها", slug: "collections" },
  { name: "تخفیف ها", slug: "offers" },
  { name: "تماس با ما", slug: "call-us" },
];

const triggerClassName =
  "bg-transparent hover:bg-transparent focus:bg-transparent " +
  "data-[state=open]:bg-transparent data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent " +
  "text-white hover:text-gray-300 focus:text-gray-300 data-[state=open]:text-gray-300 " +
  "cursor-pointer text-base";

const linkClassName = "bg-transparent hover:bg-transparent whitespace-nowrap";

const Categories = ({
  categories,
  brands,
}: {
  categories: CategoryNav[];
  brands: Brand[];
}) => {
  const menGroup = categories.filter((c) => c.group === "men");
  const womenGroup = categories.filter((c) => c.group === "women");
  const ungrouped = categories.filter((c) => !c.group);

  const groups = [
    ...(menGroup.length ? [{ title: "مردانه", items: menGroup }] : []),
    ...(womenGroup.length ? [{ title: "زنانه", items: womenGroup }] : []),
    ...(ungrouped.length ? [{ title: "سایر", items: ungrouped }] : []),
  ];

  return (
    <NavigationMenu dir="rtl" className="py-2 z-50" viewport={false}>
      <NavigationMenuList>
        {/* DYNAMIC CATEGORIES DROPDOWN */}
        {groups.length > 0 && (
          <NavigationMenuItem>
            <NavigationMenuTrigger className={triggerClassName}>
              دسته بندی
            </NavigationMenuTrigger>
            <NavigationMenuContent className="right-0 min-w-max p-4">
              <div className="flex flex-col gap-8">
                <NavigationMenuLink
                  asChild
                  className={cn(linkClassName, "font-bold")}
                >
                  <Link href="/products">همه محصولات</Link>
                </NavigationMenuLink>
                {groups.map((group) => (
                  <div key={group.title} className="flex flex-col gap-1">
                    <p className="text-xs text-zinc-500 mb-1">{group.title}</p>
                    {group.items.map((category, index) => (
                      <NavigationMenuLink
                        asChild
                        key={category.id}
                        className={cn(
                          linkClassName,
                          index === 0 && "font-bold"
                        )}
                      >
                        <Link href={`/products?category=${category.slug}`}>
                          {category.name}
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}

        {/* DYNAMIC BRANDS DROPDOWN */}
        {brands.length > 0 && (
          <NavigationMenuItem>
            <NavigationMenuTrigger className={triggerClassName}>
              برند ها
            </NavigationMenuTrigger>
            <NavigationMenuContent className="right-0 min-w-max p-4">
              <div className="flex flex-col gap-1">
                <NavigationMenuLink
                  asChild
                  className={cn(linkClassName, "font-bold")}
                >
                  <Link href="/brands">همه ی برند ها</Link>
                </NavigationMenuLink>
                {brands.map((brand) => (
                  <NavigationMenuLink
                    asChild
                    key={brand.id}
                    className={linkClassName}
                  >
                    <Link
                      href={`/brands/${brand.slug}`}
                      className="flex items-center gap-2"
                    >
                      {/* {brand.logo && (
                        <div className="relative w-5 h-5 shrink-0">
                          <Image
                            src={brand.logo}
                            alt=""
                            fill
                            className="object-contain"
                          />
                        </div>
                      )} */}
                      {brand.name}
                    </Link>
                  </NavigationMenuLink>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}

        {/* STATIC NAV ITEMS */}
        {staticMenuItems.map((item) => (
          <NavigationMenuItem key={item.slug}>
            <NavigationMenuLink
              asChild
              className="bg-transparent text-white hover:bg-transparent hover:text-gray-300"
            >
              <Link href={`/${item.slug}`}>{item.name}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Categories;
