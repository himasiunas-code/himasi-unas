import { Leader } from "@/lib/type/Struktur";
import Omar from "@/public/image/Struktur/BPH/Omar.png";
import Fahreza from "@/public/image/Struktur/BPH/Fahreza.png";
import Kyla from "@/public/image/Struktur/BPH/Kyla.png";
import Linda from "@/public/image/Struktur/BPH/Linda.png";

// Data profil pimpinan Badan Pengurus Harian (BPH) HIMASI
export const leaders: Leader[] = [
  {
    id: "ketua-1",
    name: "Omar Nur Rahmatsyah",
    image: Omar,
    role: "Ketua Himpunan",
    instagram: "https://instagram.com/omarnrh",
    description:
      "Sebagai Ketua Himpunan, bertanggung jawab dalam memimpin organisasi, mengarahkan strategi, serta menjaga koordinasi antar divisi.",
  },
  {
    id: "wakil-1",
    name: "Mohammad Fahreza Situmorang",
    image: Fahreza,
    role: "Wakil Himpunan",
    instagram: "https://instagram.com/rezzmore",
    description:
      "Sebagai Wakil Himpunan, mendampingi ketua dalam pengambilan keputusan, memastikan program berjalan, serta menjadi penghubung antar anggota.",
  },
  {
    id: "bendahara-1",
    name: "Kyla Nazwara Sofyan",
    image: Kyla,
    role: "Bendahara",
    instagram: "https://instagram.com/kylanzraa29",
    description:
      "Sebagai Bendahara, bertanggung jawab mengelola keuangan organisasi, membuat laporan keuangan, serta mengawasi alokasi dana untuk setiap kegiatan.",
  },
  {
    id: "sekretaris-1",
    name: "Linda Isnaeni",
    image: Linda,
    role: "Sekretaris",
    instagram: "https://instagram.com/lndisnaeni",
    description:
      "Sebagai Sekretaris, bertugas mencatat rapat, mengelola administrasi organisasi, serta memastikan komunikasi internal berjalan lancar.",
  },
];
