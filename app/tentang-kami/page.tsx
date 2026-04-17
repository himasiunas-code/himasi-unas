import type { Metadata } from "next";
import Hero from "@/components/shared/TentangKami/Hero";
import VM from "@/components/shared/TentangKami/VM";
import Filosofi from "@/components/shared/TentangKami/Filosofi";
import Sejarah from "@/components/shared/TentangKami/Sejarah";

export const metadata: Metadata = {
  title: "Tentang HIMASI UNAS",
  description:
    "Pelajari profil HIMASI UNAS, visi misi, filosofi, dan sejarah Himpunan Mahasiswa Sistem Informasi Universitas Nasional.",
  alternates: {
    canonical: "/tentang-kami",
  },
};

export default function AboutPage() {
  return (
    <main>
      <Hero />
      <VM />
      <Filosofi />
      <Sejarah />
    </main>
  );
}
