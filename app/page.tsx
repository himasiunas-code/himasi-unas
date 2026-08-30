import type { Metadata } from "next";
import {
  HomeHero,
  HomeIntroduction,
  HomeSlideImage,
  HomeActivity,
  HomeBerita,
} from "@/components/shared/Home";

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

      {/* Seksi berita instagram (opsional) */}
      {/* <HomeBerita /> */}
    </main>
  );
}