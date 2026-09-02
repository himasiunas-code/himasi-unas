import type { Metadata } from "next";
import { StrukturBPH, StrukturDivision } from "@/components/shared/Struktur";

// Arsitektur Performa Kilat: Server Pre-rendering + Vercel Edge ISR
export const dynamic = "force-static";
export const revalidate = 86400; // ISR revalidation setiap 24 jam di Vercel Edge CDN

// Metadata SEO untuk halaman struktur organisasi
export const metadata: Metadata = {
  title: "Struktur Organisasi HIMASI UNAS",
  description:
    "Kenali struktur organisasi HIMASI UNAS, mulai dari BPH hingga divisi-divisi yang berperan dalam menjalankan program kerja himpunan.",
  alternates: {
    canonical: "/struktur",
  },
};

// Halaman utama struktur organisasi HIMASI UNAS
export default function StrukturPage() {
  return (
    <main>
      {/* Seksi Banner dan Header Judul */}
      <section className="relative bg-[#FFE8DB] pt-3 pb-1 md:pt-12 md:pb-8 lg:pt-16 lg:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto px-4 pt-20 md:pt-15">
          {/* Judul Halaman */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#4B061A] md:mb-2">
              Struktur Organisasi
            </h1>
            <p className="text-base sm:text-xl text-gray-700 max-w-3xl mx-auto">
              Anggota Himpunan Mahasiswa Sistem Informasi Universitas Nasional
            </p>
          </div>
        </div>

        {/* Dekorasi gelombang bawah */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" className="w-full h-auto">
            <path
              d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
              fill="rgba(75, 6, 26, 1)"
            />
          </svg>
        </div>
      </section>
     
      {/* Seksi Badan Pengurus Harian (BPH) */}
      <div className="bg-[#4B061A]">
        <StrukturBPH />
      </div>

      {/* Seksi Divisi Himpunan */}
      <StrukturDivision />
    </main>
  );
}
