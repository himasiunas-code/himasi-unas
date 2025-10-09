import React from "react";
import Image from "next/image";
import Link from "next/link";
import Banner from "@/public/image/Home/BannerV1.png";

export default function Hero() {
  return (
    <main className="relative overflow-hidden bg-[#FFE8DB] !bg-[#FFE8DB]">
      {/* Banner Section with 16:9 aspect ratio */}
      <section className="relative w-full">
        <div className="aspect-square md:aspect-video w-full overflow-hidden">
          <Image
            src={Banner}
            alt="HIMASI UNAS - Himpunan Mahasiswa Sistem Informasi"
            fill
            className="object-cover"
            priority
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-[#4B061A]/60 flex justify-center p-2 sm:p-4">
            <div className="text-center text-white w-full max-w-6xl px-2">
              <h1 className="text-sm sm:text-lg md:text-xl lg:text-3xl xl:text-4xl font-bold mb-3 pt-5 pb-15 sm:mb-4 drop-shadow-lg leading-tight">
                Himpunan Mahasiswa Sistem Informasi <br /> Universitas Nasional
              </h1>
              
              {/* Call to Action Buttons */}
              <div className="flex flex-row gap-2 sm:gap-4 justify-center items-center">
                <Link
                  href="http://si.ftki.unas.ac.id"
                  className="inline-flex items-center justify-center px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#4B061A] to-[#8B1C3B] hover:from-[#5B0720] hover:to-[#9B2C4B] text-white font-bold text-xs sm:text-sm md:text-base rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl min-w-[120px] sm:min-w-[180px]"
                >
                  Jelajahi
                </Link>
                <Link
                  href="/hubungi-kami"
                  className="inline-flex items-center justify-center px-3 sm:px-6 py-2 sm:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold text-xs sm:text-sm md:text-base rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-white/20 hover:border-white/30 min-w-[120px] sm:min-w-[180px]"
                >
                  Hubungi Kami
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Gradient Transition */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-[linear-gradient(to_bottom,transparent_20%,#4B061A_70%)]"></div>
        </div>
      </section>
    </main>
  )
}