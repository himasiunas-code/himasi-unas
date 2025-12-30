import BPH from "@/components/shared/Struktur/infoBPH";
import Divisi from "@/components/shared/Struktur/infoDivision";

export default function GaleriPage() {
  return (
    <main>
      {/* Banner Section */}
      <section className="relative bg-[#FFE8DB] pt-8 pb-1 md:pt-12 md:pb-8 lg:pt-16 lg:pb-12 px-4 sm:px-6 lg:px-8">
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
          {/* <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-xl">
              <Image
                src={Banner}
                alt="Struktur Organisasi HIMASI UNAS"
                fill
                className="object-cover rounded-2xl hover:scale-105 transition-transform duration-700"
                priority
              />
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
          </div> */}
        </div>

        {/* Bottom Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" className="w-full h-auto">
            <path
              d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
              fill="rgba(75, 6, 26, 1)"
            />
          </svg>
        </div>
      </section>
     
      <div className="bg-[#4B061A]">
        <BPH />
      </div>

      <Divisi />
    </main>
  );
}
