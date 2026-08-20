import { Suspense } from "react";

import Navbar from "@/components/Navbar";
import { iranYekan } from "@/public/font/iran-yekan-web/fonts";
import Footer from "@/components/Footer";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { ClerkProvider } from "@clerk/nextjs";
import { faIR } from "@clerk/localizations";

export const metadata = {
  title: "گالری ساعت سیلور",
  description: "فروشگاه ساعت های مردانه و زنانه",
  verification: {
    google: "lS2HhrlkBDWK3cRaFEEAJ1Uf0wydhjOTzTRCus1R3YI",
  },
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={faIR}>
      <html lang="fa" dir="rtl">
        <body className={`${iranYekan.className} antialiased bg-zinc-100`}>
          <Navbar />
          <div className="mx-auto p-4 pt-0.5 px-0 sm:max-w-xl  md:max-w-2xl lg:max-w-3xl xl:max-w-6xl">
            <Suspense>{children}</Suspense>
          </div>
          <Footer />

          <ToastContainer position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
