import type { Metadata } from "next";
import { permanentRedirect } from 'next/navigation';

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

export default function GaleriPage() {
    // Redirect ke tahun akademik terbaru
    permanentRedirect('/galeri/2025-2026');
}