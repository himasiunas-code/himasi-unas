import type { Metadata } from "next";
import Hero from "@/components/shared/Partner/Hero";
import SlideLogo from "@/components/shared/Partner/slideLogo";
import Contact from "@/components/shared/Partner/contact";

export const metadata: Metadata = {
  title: "Kerja Sama HIMASI UNAS",
  description:
    "Bangun kolaborasi bersama HIMASI UNAS melalui program kemitraan, sponsorship, dan kegiatan pengembangan mahasiswa Sistem Informasi.",
  alternates: {
    canonical: "/kerja-sama",
  },
};

export default function KerjaSamaPage() {
  return (
    <div>
      <Hero />
      <SlideLogo />
      <Contact />
    </div>
  );
}
