import { prisma } from "@/lib/prisma";
import AdminProductForm from "@/components/AdminProductForm";
import AdminProductsTable from "@/components/AdminProductsTable";
import AdminCategoriesList from "@/components/AdminCategoriesList";
import AdminCategoryForm from "@/components/AdminCategoryForm";
import AdminBrandForm from "@/components/AdminBrandForm";
import AdminBrandsList from "@/components/AdminBrandsList";
import AdminHeroSlides from "@/components/AdminHeroSlides";
import AdminBanners from "@/components/AdminBanners";

export default async function AdminPage() {
  const [categories, brands, products, heroSlides, banners] = await Promise.all(
    [
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.brand.findMany({ orderBy: { name: "asc" } }),
      prisma.product.findMany({
        include: { category: true, brand: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.heroSlide.findMany({ orderBy: { order: "asc" } }),
      prisma.banner.findMany({ orderBy: { order: "asc" } }),
    ]
  );

  return (
    <div
      dir="rtl"
      className="max-w-2xl mx-auto py-10 px-4 flex flex-col gap-12"
    >
      <section>
        <h2 className="text-xl font-bold mb-4">اسلایدهای صفحه اصلی</h2>
        <AdminHeroSlides slides={heroSlides} />
      </section>

      <hr />

      <section>
        <h2 className="text-xl font-bold mb-4">بنرهای صفحه اصلی</h2>
        <AdminBanners banners={banners} />
      </section>

      <hr />

      <section>
        <h2 className="text-xl font-bold mb-4">افزودن دسته بندی</h2>
        <AdminCategoryForm />
        <AdminCategoriesList categories={categories} />
      </section>

      <hr />

      <section>
        <h2 className="text-xl font-bold mb-4">افزودن برند</h2>
        <AdminBrandForm />
        <AdminBrandsList brands={brands} />
      </section>

      <hr />

      <section>
        <h2 className="text-xl font-bold mb-4">افزودن محصول</h2>
        <AdminProductForm categories={categories} brands={brands} />
      </section>

      <hr />

      <section>
        <h2 className="text-xl font-bold mb-4">محصولات ({products.length})</h2>
        <AdminProductsTable products={products} />
      </section>
    </div>
  );
}
