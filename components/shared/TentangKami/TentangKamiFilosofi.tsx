import Image from "next/image";
import Logo from "@/public/icon/LOGO HIMASI UNAS.png";

// Komponen filosofi makna dan elemen logo HIMASI UNAS
export default function TentangKamiFilosofi() {
  return (
    <main className="bg-[#FFE8DB] py-10 md:py-16">
      <div className="w-full max-w-6xl mx-auto px-4">
        <h2 className="font-bold text-[#4B061A] text-2xl md:text-3xl lg:text-5xl uppercase text-center mb-8 md:mb-12">
          Logo HIMASI UNAS
        </h2>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Logo HIMASI */}
          <div className="flex justify-center lg:justify-start order-1">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 rounded-full shadow-2xl overflow-hidden">
                <Image
                  src={Logo}
                  alt="Logo HIMASI UNAS"
                  fill
                  sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px"
                  className="object-contain p-8"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Penjelasan filosofi logo */}
          <div className="order-2 text-[#4B061A] space-y-4">
            <p className="text-sm md:text-base lg:text-lg leading-relaxed text-justify">
              Logo HIMASI UNAS merepresentasikan identitas dan nilai-nilai
              organisasi kami. Setiap elemen dalam logo memiliki makna filosofis
              yang mendalam, mencerminkan visi dan misi himpunan dalam
              mengembangkan mahasiswa Sistem Informasi yang kompeten, inovatif,
              dan berintegritas.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#4B061A] rounded-full mt-2 shrink-0"></div>
                <p className="text-sm md:text-base text-justify">
                  <span className="font-semibold">Warna Maroon:</span>{" "}
                  Melambangkan keberanian, kekuatan, dan dedikasi dalam
                  menghadapi tantangan.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#4B061A] rounded-full mt-2 shrink-0"></div>
                <p className="text-sm md:text-base text-justify">
                  <span className="font-semibold">Bentuk Geometris:</span>{" "}
                  Merepresentasikan struktur dan sistematis dalam teknologi
                  informasi.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#4B061A] rounded-full mt-2 shrink-0"></div>
                <p className="text-sm md:text-base text-justify">
                  <span className="font-semibold">Elemen Modern:</span>{" "}
                  Mencerminkan semangat inovasi dan adaptasi terhadap
                  perkembangan teknologi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
