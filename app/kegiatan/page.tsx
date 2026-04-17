import type { Metadata } from "next";
import HeroKegiatan from "@/components/shared/Kegiatan/Hero";
import Pendaftaran from "@/components/shared/Kegiatan/Pendaftaran";
import Artikel from "@/components/shared/Kegiatan/Artikel";

export const metadata: Metadata = {
    title: "Kegiatan HIMASI UNAS | Seminar, Pelatihan, dan Event Mahasiswa",
    description:
        "Lihat daftar kegiatan HIMASI UNAS mulai dari seminar, workshop, pelatihan, hingga program kolaborasi untuk mahasiswa Sistem Informasi.",
    alternates: {
        canonical: "/kegiatan",
    },
};

export default function KegiatanPage() {
    return(
        <div>
            <HeroKegiatan />
            <Pendaftaran />
            <Artikel />
        </div>
    )
}