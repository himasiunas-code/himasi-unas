import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { GaleriHero, GaleriFilter } from "@/components/shared/Galeri";
import { galleryEvent2024, galleryEvent2025 } from "@/constants/Galeri";
import { GalleryEvent } from "@/lib/type/Galeri";

interface GaleriSlugPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Pemetaan data tahun akademik kegiatan galeri
const yearMapping: Record<string, { event: GalleryEvent; displayYear: string; filterYear: "2024" | "2025" }> = {
    "2024-2025": {
        event: galleryEvent2024,
        displayYear: "2024/2025",
        filterYear: "2024"
    },
    "2025-2026": {
        event: galleryEvent2025,
        displayYear: "2025/2026",
        filterYear: "2025"
    }
};

export default async function GaleriSlugPage({ params }: GaleriSlugPageProps) {
    const { slug } = await params;
    
    // Validasi apakah slug tahun akademik tersedia
    const yearData = yearMapping[slug];
    
    if (!yearData) {
        notFound();
    }

    return (
        <div>
            {/* Header carousel galeri tahun terkait */}
            <GaleriHero event={yearData.event} year={yearData.displayYear} />

            {/* Filter kategori dan grid foto */}
            <GaleriFilter year={yearData.filterYear} />
        </div>
    );
}

// Generate parameter statis untuk halaman galeri saat build
export async function generateStaticParams() {
    return Object.keys(yearMapping).map((slug) => ({
        slug: slug,
    }));
}

// Metadata SEO dinamis sesuai tahun akademik galeri
export async function generateMetadata({ params }: GaleriSlugPageProps) {
    const { slug } = await params;
    const yearData = yearMapping[slug];
    
    if (!yearData) {
        return {
            title: 'Galeri Tidak Ditemukan',
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const canonicalPath = `/galeri/${slug}`;

    return {
        title: `Galeri ${yearData.displayYear} - HIMASI UNAS`,
        description: `Galeri kegiatan Himpunan Mahasiswa Sistem Informasi Universitas Nasional tahun akademik ${yearData.displayYear}`,
        alternates: {
            canonical: canonicalPath,
        },
    } satisfies Metadata;
}
