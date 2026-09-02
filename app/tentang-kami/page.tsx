import type { Metadata } from "next";
import {
  TentangKamiHero,
  TentangKamiVM,
  TentangKamiFilosofi,
  TentangKamiSejarah,
} from "@/components/shared/TentangKami";

// Arsitektur Performa Kilat: Server Pre-rendering + Vercel Edge ISR
export const dynamic = "force-static";
export const revalidate = 86400; // ISR revalidation setiap 24 jam di Vercel Edge CDN

// Metadata SEO untuk halaman Tentang Kami
export const metadata: Metadata = {
  title: "Tentang HIMASI UNAS",
  description:
    "Pelajari profil HIMASI UNAS, visi misi, filosofi, dan sejarah Himpunan Mahasiswa Sistem Informasi Universitas Nasional.",
  alternates: {
    canonical: "/tentang-kami",
  },
};

// Halaman utama Tentang Kami HIMASI UNAS
export default function TentangKamiPage() {
  return (
    <main>
      {/* Header hero tentang kami */}
      <TentangKamiHero />

      {/* Visi dan misi */}
      <TentangKamiVM />

      {/* Filosofi logo */}
      <TentangKamiFilosofi />

      {/* Sejarah dan riwayat kepemimpinan */}
      <TentangKamiSejarah />
    </main>
  );
}
