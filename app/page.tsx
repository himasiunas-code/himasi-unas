import type { Metadata } from "next";
import {
  HomeHero,
  HomeIntroduction,
  HomeSlideImage,
  HomeActivity,
} from "@/components/shared/Home";

// Arsitektur Performa Kilat: Server Pre-rendering + Vercel Edge ISR
export const dynamic = "force-static";
export const revalidate = 3600; // ISR revalidation setiap 1 jam di Vercel Edge CDN

// Metadata SEO untuk halaman utama
export const metadata: Metadata = {
  title: "HIMASI UNAS | Himpunan Mahasiswa Sistem Informasi Universitas Nasional",
  description:
    "Website resmi HIMASI UNAS. Temukan informasi kegiatan, galeri, struktur organisasi, pendaftaran, dan kolaborasi Himpunan Mahasiswa Sistem Informasi Universitas Nasional.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* Seksi Hero utama */}
      <HomeHero />

      {/* Seksi pengenalan HIMASI dan divisi */}
      <HomeIntroduction />

      {/* Seksi slider momen & kebersamaan */}
      <HomeSlideImage />

      {/* Seksi daftar kegiatan */}
      <HomeActivity />
    </main>
  );
}