import type { Metadata } from "next";
import {
  KerjaSamaHero,
  KerjaSamaSlideLogo,
  KerjaSamaContact,
} from "@/components/shared/KerjaSama";

// Metadata SEO untuk halaman kerja sama dan kemitraan
export const metadata: Metadata = {
  title: "Kerja Sama HIMASI UNAS",
  description:
    "Bangun kolaborasi bersama HIMASI UNAS melalui program kemitraan, sponsorship, dan kegiatan pengembangan mahasiswa Sistem Informasi.",
  alternates: {
    canonical: "/kerja-sama",
  },
};

// Halaman utama Kerja Sama HIMASI UNAS
export default function KerjaSamaPage() {
  return (
    <div>
      {/* Header hero kerja sama */}
      <KerjaSamaHero />

      {/* Daftar logo kemitraan dan riwayat kerja sama */}
      <KerjaSamaSlideLogo />

      {/* Kontak narahubung kemitraan */}
      <KerjaSamaContact />
    </div>
  );
}
