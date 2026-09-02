import type { Metadata } from "next";
import {
  KerjaSamaHero,
  KerjaSamaSlideLogo,
  KerjaSamaContact,
} from "@/components/shared/KerjaSama";

// Arsitektur Performa Kilat: Server Pre-rendering + Vercel Edge ISR
export const dynamic = "force-static";
export const revalidate = 86400; // ISR revalidation setiap 24 jam di Vercel Edge CDN

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
