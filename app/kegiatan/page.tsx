import type { Metadata } from "next";
import {
  KegiatanHero,
  KegiatanPendaftaran,
  KegiatanArtikel,
} from "@/components/shared/Kegiatan";

// Metadata SEO untuk halaman kegiatan
export const metadata: Metadata = {
  title: "Kegiatan HIMASI UNAS | Seminar, Pelatihan, dan Event Mahasiswa",
  description:
    "Lihat daftar kegiatan HIMASI UNAS mulai dari seminar, workshop, pelatihan, hingga program kolaborasi untuk mahasiswa Sistem Informasi.",
  alternates: {
    canonical: "/kegiatan",
  },
};

export default function KegiatanPage() {
  return (
    <div>
      {/* Header judul halaman kegiatan */}
      <KegiatanHero />

      {/* Bagian pendaftaran kegiatan yang sedang aktif */}
      <KegiatanPendaftaran />

      {/* Bagian artikel dan arsip kegiatan */}
      <KegiatanArtikel />
    </div>
  );
}