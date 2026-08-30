import type { Metadata } from "next";
import { permanentRedirect } from 'next/navigation';

// Metadata SEO untuk redirect galeri
export const metadata: Metadata = {
    title: "Galeri HIMASI UNAS",
    description: "Dokumentasi galeri kegiatan HIMASI UNAS dari berbagai tahun akademik.",
    robots: {
        index: false,
        follow: true,
    },
    alternates: {
        canonical: "/galeri/2025-2026",
    },
};

// Halaman indeks galeri: otomatis dialihkan ke tahun akademik terkini
export default function GaleriPage() {
    permanentRedirect('/galeri/2025-2026');
}