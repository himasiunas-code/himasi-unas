import React from "react";
import Image from "next/image";
import Banner from "@/public/image/Hubungi/BannerV1.png";

// Komponen hero banner halaman Hubungi Kami
export default function HubungiHero() {
  return (
    <section className="relative w-full">
      <div className="aspect-square md:aspect-video w-full overflow-hidden">
        <Image
          src={Banner}
          alt="HIMASI UNAS"
          fill
          className="object-cover"
          priority
        />
        {/* Lapisan overlay gelap */}
        <div className="absolute inset-0 bg-[#4B061A]/60 flex items-center justify-center p-2 sm:p-4">
          <div className="text-center text-white w-full max-w-4xl px-2">
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-4 drop-shadow-lg leading-tight">
              Hubungi Kami
            </h1>
            <p className="text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-8 drop-shadow-md leading-relaxed">
              Jangan ragu untuk menghubungi HIMASI UNAS. Kami siap membantu
              dan mendengar dari Anda!
            </p>
          </div>
        </div>

        {/* Transisi gradien bawah */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[linear-gradient(to_bottom,transparent_20%,#FFE8DB_70%)]"></div>
      </div>
    </section>
  );
}
