import { notFound } from 'next/navigation';
import Hero from "@/components/shared/Galeri/Hero";
import Filter from "@/components/shared/Galeri/filterGaleri";
import { galleryEvent2024 } from "@/constants/Galeri/dataGallery2024";
import { galleryEvent2025 } from "@/constants/Galeri/dataGallery2025";
import { GalleryEvent } from "@/lib/type/Galeri/Galeri";

interface GaleriSlugPageProps {
    params: Promise<{
        slug: string;
    }>;
}

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
    
    // Cek apakah slug valid
    const yearData = yearMapping[slug];
    
    if (!yearData) {
        notFound();
    }

    return (
        <div>
            <Hero event={yearData.event} year={yearData.displayYear} />
            <Filter year={yearData.filterYear} />
        </div>
    );
}

// Generate static params untuk build time
export async function generateStaticParams() {
    return Object.keys(yearMapping).map((slug) => ({
        slug: slug,
    }));
}

// Metadata untuk SEO
export async function generateMetadata({ params }: GaleriSlugPageProps) {
    const { slug } = await params;
    const yearData = yearMapping[slug];
    
    if (!yearData) {
        return {
            title: 'Galeri Tidak Ditemukan',
        };
    }

    return {
        title: `Galeri ${yearData.displayYear} - HIMASI UNAS`,
        description: `Galeri kegiatan Himpunan Mahasiswa Sistem Informasi Universitas Nasional tahun akademik ${yearData.displayYear}`,
    };
}
