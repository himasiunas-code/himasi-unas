import BPH from "@/components/shared/Struktur/infoBPH";
import Divisi from "@/components/shared/Struktur/infoDivision";
import Banner from "@/public/image/Struktur/BannerV1.png";
import Image from "next/image";

export default function GaleriPage() {
  return (
    <main>
      {/* Banner Section */}
      <section className="bg-[linear-gradient(to_bottom,#FFE8DB_70%,#E4C6BE_80%,#994555_85%,#732E39_90%,#4B061A_100%)] py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto px-4 pt-20 md:pt-15">
          {/* Title */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#4B061A] md:mb-2">
              Struktur Organisasi
            </h1>
            <p className="text-base sm:text-xl text-gray-700 max-w-3xl mx-auto">
              Anggota Himpunan Mahasiswa Sistem Informasi Universitas Nasional
            </p>
          </div>

          {/* Banner Card with Video Aspect Ratio */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-xl">
              <Image
                src={Banner}
                alt="Struktur Organisasi HIMASI UNAS"
                fill
                className="object-cover rounded-2xl hover:scale-105 transition-transform duration-700"
                priority
              />
              {/* Optional Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#4B061A]/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white text-xl sm:text-2xl font-bold drop-shadow-lg">
                    Pengurus HIMASI UNAS
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base mt-2 drop-shadow-md">
                    Periode 2025/2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient Transition */}
     
      <div className="bg-[#4B061A]">
        <BPH />
      </div>

      <Divisi />
    </main>
  );
}
