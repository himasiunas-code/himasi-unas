import type { Metadata } from 'next';
import {
  HubungiHero,
  HubungiContactCards,
  HubungiLocation,
  HubungiContactForm,
} from "@/components/shared/Hubungi";

// Arsitektur Performa Kilat: Server Pre-rendering + Vercel Edge ISR
export const dynamic = "force-static";
export const revalidate = 86400; // ISR revalidation setiap 24 jam di Vercel Edge CDN

// Metadata SEO untuk halaman Hubungi Kami
export const metadata: Metadata = {
  title: 'Hubungi Kami | HIMASI UNAS',
  description: 'Silakan hubungi Himpunan Mahasiswa Sistem Informasi (HIMASI) Universitas Nasional jika Anda memiliki pertanyaan atau ingin bekerja sama.',
  alternates: {
    canonical: '/hubungi-kami',
  },
};

// Halaman utama Hubungi Kami HIMASI UNAS
export default function HubungiKamiPage() {
  return (
    <>
      {/* Header hero banner */}
      <HubungiHero />

      {/* Kartu kontak narahubung */}
      <HubungiContactCards />

      {/* Lokasi sekretariat dan jam operasional */}
      <HubungiLocation />

      {/* Formulir pengiriman pesan langsung dan peta */}
      <HubungiContactForm />
    </>
  );
}