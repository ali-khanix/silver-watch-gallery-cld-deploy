import ProductsList from "@/components/ProductsList";
import HeroCarousel from "@/components/HeroCarousel";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const heroSlides = await prisma.heroSlide.findMany({
    orderBy: { order: "asc" },
  });

  const banners = await prisma.banner.findMany({
    orderBy: { order: "asc" },
  });
  const largeBanners = banners.filter((b) => b.size === "large");
  const smallBanners = banners.filter((b) => b.size === "small");
  const smallBannersGridClass =
    smallBanners.length >= 4 ? "sm:grid-cols-4" : "sm:grid-cols-3";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "گالری ساعت سیلور",
    url: "https://silverwatchgallery.com",
    logo: "https://silverwatchgallery.com/logo.svg",
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "گالری ساعت سیلور",
    url: "https://silverwatchgallery.com",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd),
        }}
      />
      <HeroCarousel slides={heroSlides} />

      <section id="products" className="mt-10">
        <div className="flex justify-between items-center mx-3 sm:mx-0 mb-4">
          <h2 className="font-bold text-[18px]">تازه های سیلور واچ</h2>
          <Link href={"/products"} className="underline">
            مشاهده همه
          </Link>
        </div>
        <ProductsList />
      </section>

      {/* BANNERS */}
      <section id="banners" className="mt-8 mx-2 sm:mx-0">
        {largeBanners.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            {largeBanners.map((banner) => (
              <Link
                key={banner.id}
                href={banner.link || "#"}
                className="relative h-62.5 sm:h-100 rounded-[20px] overflow-hidden block"
              >
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
              </Link>
            ))}
          </div>
        )}

        {smallBanners.length > 0 && (
          <div
            className={`grid grid-cols-1 ${smallBannersGridClass} gap-2 sm:gap-4 mt-2 sm:mt-4`}
          >
            {smallBanners.map((banner) => (
              <Link
                key={banner.id}
                href={banner.link || "#"}
                className="relative h-40 sm:h-64 rounded-[20px] overflow-hidden block"
              >
                <Image
                  src={banner.imageUrl}
                  fill
                  alt={banner.title}
                  className="object-cover"
                />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section id="products" className="mt-10">
        <div className="flex justify-between items-center mx-3 sm:mx-0 mb-4">
          <h2 className="font-bold text-[18px]">ساعت های دارای تخفیف</h2>
          <Link href={"/offers"} className="underline">
            مشاهده همه
          </Link>
        </div>
        <ProductsList discountedOnly />
      </section>
    </>
  );
}
