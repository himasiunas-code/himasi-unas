import type { Metadata } from "next";
import Hero from "@/components/shared/Home/Hero";
import Introduction from "@/components/shared/Home/Introduction";
import Slide from "@/components/shared/Home/SlideImage";
import Kegiatan from "@/components/shared/Home/Activity";
import Feed from "@/components/shared/Home/Berita";

export const metadata: Metadata = {
    title: "HIMASI UNAS | Himpunan Mahasiswa Sistem Informasi Universitas Nasional",
    description:
        "Website resmi HIMASI UNAS. Temukan informasi kegiatan, galeri, struktur organisasi, pendaftaran, dan kolaborasi Himpunan Mahasiswa Sistem Informasi Universitas Nasional.",
    alternates: {
        canonical: "/",
    },
};

export default function Home() {
    return(
        <main className="overflow-hidden">
            <Hero />
            <Introduction />
            <Slide />
            <Kegiatan />
            {/* <Feed /> */}
        </main>
    )
}