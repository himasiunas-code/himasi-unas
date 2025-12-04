import { FilteredGalleryItem, GalleryFilter } from "@/lib/type/Galeri/Galeri";

// Filter categories
export const galleryFilters: GalleryFilter[] = [
  "All",
  // "Proker 1",
  // "Proker 2",
  // "Proker 3",
  // "Proker 4",
  // "Wawancara",
  "PLBA",
  "Himpunan",
];

// Filter display names and descriptions
export const filterDescriptions: Record<
  GalleryFilter,
  { displayName: string; description: string }
> = {
  All: { displayName: "All", description: "Semua Foto Kegiatan" },
  // "Proker 1": {
  //   displayName: "PK 1",
  //   description: "Program Kerja 1",
  // },
  // "Proker 2": {
  //   displayName: "PK 2",
  //   description: "Program Kerja 2",
  // },
  // "Proker 3": {
  //   displayName: "PK 3",
  //   description: "Program Kerja 3",
  // },
  // "Proker 4": {
  //   displayName: "PK 4",
  //   description: "Program Kerja 4",
  // },
  // Wawancara: {
  //   displayName: "Wawancara",
  //   description: "Wawancara Calon Anggota",
  // },
  "PLBA": {
    displayName: "PLBA",
    description: "Pengenalan Lingkungan dan Budaya Akademik",
  },
  Himpunan: {
    displayName: "Himpunan",
    description: "Kebersamaan HIMASI",
  },
};

// Gallery items dengan filter categories
export const filteredGalleryItems: FilteredGalleryItem[] = [
  // Proker 1
  // {
  //   id: "p1-001",
  //   category: "Proker 1",
  //   title: "Workshop Pemrograman Web",
  //   tanggal: "15 Januari 2024",
  //   lokasi: "Lab Komputer A",
  //   alamatLengkap:
  //     "Lab Komputer A, Gedung Fakultas Teknik dan Komputer, Universitas Nasional, Jl. Sawo Manila No. 61, Pasar Minggu, Jakarta Selatan 12520",
  //   image: "/image/Struktur/Deadpool.png",
  //   alt: "Workshop Pemrograman Web",
  // },

  // Proker 2
  // {
  //   id: "p2-001",
  //   category: "Proker 2",
  //   title: "Kompetisi UI/UX Design",
  //   tanggal: "5 Februari 2024",
  //   lokasi: "Ruang Kreativitas",
  //   alamatLengkap:
  //     "Ruang Kreativitas, Gedung Fakultas Teknik dan Komputer, Universitas Nasional, Jl. Sawo Manila No. 61, Pasar Minggu, Jakarta Selatan 12520",
  //   image: "/image/Struktur/Deadpool.png",
  //   alt: "Kompetisi UI/UX Design",
  // },

  // Proker 3
  // {
  //   id: "p3-001",
  //   category: "Proker 3",
  //   title: "Seminar Cybersecurity",
  //   tanggal: "5 Maret 2024",
  //   lokasi: "Ruang Seminar",
  //   alamatLengkap:
  //     "Universitas Nasional, Jl. Sawo Manila No. 61, Pasar Minggu, Jakarta Selatan 12520",
  //   image: "/image/Struktur/Deadpool.png",
  //   alt: "Seminar Cybersecurity",
  // },

  // Proker 4
  // {
  //   id: "p4-001",
  //   category: "Proker 4",
  //   title: "Startup Pitch Competition",
  //   tanggal: "2 April 2024",
  //   lokasi: "Innovation Hub",
  //   alamatLengkap:
  //     "Universitas Nasional, Jl. Sawo Manila No. 61, Pasar Minggu, Jakarta Selatan 12520",
  //   image: "/image/Struktur/Deadpool.png",
  //   alt: "Startup Pitch Competition",
  // },

  // Proker 5
  // {
  //   id: "plba-001",
  //   category: "PLBA",
  //   title: "Tech Talk: AI & Machine Learning",
  //   tanggal: "7 Mei 2024",
  //   lokasi: "Auditorium Utama",
  //   alamatLengkap:
  //     "Universitas Nasional, Jl. Sawo Manila No. 61, Pasar Minggu, Jakarta Selatan 12520",
  //   image: "/image/Struktur/Deadpool.png",
  //   alt: "Tech Talk: AI & Machine Learning",
  // },
  // {
  //   id: "plba-002",
  //   category: "PLBA",
  //   title: "Workshop Data Science",
  //   tanggal: "14 Mei 2024",
  //   lokasi: "Lab Data Science",
  //   alamatLengkap:
  //     "Universitas Nasional, Jl. Sawo Manila No. 61, Pasar Minggu, Jakarta Selatan 12520",
  //   image: "/image/Struktur/Deadpool.png",
  //   alt: "Workshop Data Science",
  // },
  // {
  //   id: "plba-003",
  //   category: "PLBA",
  //   title: "Python for AI Bootcamp",
  //   tanggal: "21 Mei 2024",
  //   lokasi: "Lab Programming",
  //   alamatLengkap:
  //     "Universitas Nasional, Jl. Sawo Manila No. 61, Pasar Minggu, Jakarta Selatan 12520",
  //   image: "/image/Struktur/Deadpool.png",
  //   alt: "Python for AI Bootcamp",
  // },
  
  // Wawancara
  // {
  //   id: "w-001",
  //   category: "Wawancara",
  //   title: "Persiapan Wawancara Calon Anggota",
  //   tanggal: "20 September 2025",
  //   lokasi: "Blok C Lt. 8",
  //   alamatLengkap:
  //   "Blok C Lt. 8, Universitas Nasional, Jl. Sawo Manila No. 61, Pasar Minggu, Jakarta Selatan 12520",
  //   image: "/image/Galeri/Wawancara/w-1.jpg",
  //   alt: "Persiapan Wawancara Calon Anggota",
  // },
  // {
  //   id: "w-002",
  //   category: "Wawancara",
  //   title: "Calon Anggota: Muhammad Ali",
  //   tanggal: "20 September 2025",
  //   lokasi: "Blok C Lt. 8",
  //   alamatLengkap:
  //   "Blok C Lt. 8, Universitas Nasional, Jl. Sawo Manila No. 61, Pasar Minggu, Jakarta Selatan 12520",
  //   image: "/image/Galeri/Wawancara/w-2.jpg",
  //   alt: "Calon Anggota: Muhammad Ali",
  // },
  // {
  //   id: "w-003",
  //   category: "Wawancara",
  //   title: "Calon Anggota: Muhammad Ali",
  //   tanggal: "20 September 2025",
  //   lokasi: "Blok C Lt. 8",
  //   alamatLengkap:
  //   "Blok C Lt. 8, Universitas Nasional, Jl. Sawo Manila No. 61, Pasar Minggu, Jakarta Selatan 12520",
  //   image: "/image/Galeri/Wawancara/w-3.JPG",
  //   alt: "Calon Anggota: Muhammad Ali",
  // },
  // {
  //   id: "w-004",
  //   category: "Wawancara",
  //   title: "Pewawancara Calon Anggota",
  //   tanggal: "20 September 2025",
  //   lokasi: "Blok C Lt. 8",
  //   alamatLengkap:
  //   "Blok C Lt. 8, Universitas Nasional, Jl. Sawo Manila No. 61, Pasar Minggu, Jakarta Selatan 12520",
  //   image: "/image/Galeri/Wawancara/w-4.jpg",
  //   alt: "Pewawancara Calon Anggota",
  // },
  // {
  //   id: "w-005",
  //   category: "Wawancara",
  //   title: "Mengisi Administrasi Calon: Cakrawangsa",
  //   tanggal: "20 September 2025",
  //   lokasi: "Blok C Lt. 8",
  //   alamatLengkap:
  //   "Blok C Lt. 8, Universitas Nasional, Jl. Sawo Manila No. 61, Pasar Minggu, Jakarta Selatan 12520",
  //   image: "/image/Galeri/Wawancara/w-5.jpg",
  //   alt: "Mengisi Administrasi Calon: Cakrawangsa",
  // },
  // {
  //   id: "w-006",
  //   category: "Wawancara",
  //   title: "Calon Anggota: Cakrawangsa",
  //   tanggal: "20 September 2025",
  //   lokasi: "Blok C Lt. 8",
  //   alamatLengkap:
  //   "Blok C Lt. 8, Universitas Nasional, Jl. Sawo Manila No. 61, Pasar Minggu, Jakarta Selatan 12520",
  //   image: "/image/Galeri/Wawancara/w-6.JPG",
  //   alt: "Calon Anggota: Cakrawangsa",
  // },
  // {
  //   id: "w-007",
  //   category: "Wawancara",
  //   title: "Calon Anggota: Arkan",
  //   tanggal: "20 September 2025",
  //   lokasi: "Blok C Lt. 8",
  //   alamatLengkap:
  //   "Blok C Lt. 8, Universitas Nasional, Jl. Sawo Manila No. 61, Pasar Minggu, Jakarta Selatan 12520",
  //   image: "/image/Galeri/Wawancara/w-7.jpg",
  //   alt: "Calon Anggota: Arkan",
  // },
  // {
  //   id: "w-008",
  //   category: "Wawancara",
  //   title: "Suasana Ruangan Wawancara: Galang",
  //   tanggal: "20 September 2025",
  //   lokasi: "Blok C Lt. 8",
  //   alamatLengkap:
  //   "Blok C Lt. 8, Universitas Nasional, Jl. Sawo Manila No. 61, Pasar Minggu, Jakarta Selatan 12520",
  //   image: "/image/Galeri/Wawancara/w-8.jpg",
  //   alt: "Suasana Ruangan Wawancara: Galang",
  // },
  // {
  //   id: "w-009",
  //   category: "Wawancara",
  //   title: "Calon Anggota: Putra",
  //   tanggal: "20 September 2025",
  //   lokasi: "Blok C Lt. 8",
  //   alamatLengkap:
  //   "Blok C Lt. 8, Universitas Nasional, Jl. Sawo Manila No. 61, Pasar Minggu, Jakarta Selatan 12520",
  //   image: "/image/Galeri/Wawancara/w-9.jpg",
  //   alt: "Calon Anggota: Putra",
  // },
  // {
  //   id: "w-010",
  //   category: "Wawancara",
  //   title: "Calon Anggota: Putra",
  //   tanggal: "20 September 2025",
  //   lokasi: "Blok C Lt. 8",
  //   alamatLengkap:
  //   "Blok C Lt. 8, Universitas Nasional, Jl. Sawo Manila No. 61, Pasar Minggu, Jakarta Selatan 12520",
  //   image: "/image/Galeri/Wawancara/w-10.jpg",
  //   alt: "Calon Anggota: Putra",
  // },
  // {
  //   id: "w-011",
  //   category: "Wawancara",
  //   title: "Calon Anggota: Naufal",
  //   tanggal: "20 September 2025",
  //   lokasi: "Blok C Lt. 8",
  //   alamatLengkap:
  //   "Blok C Lt. 8, Universitas Nasional, Jl. Sawo Manila No. 61, Pasar Minggu, Jakarta Selatan 12520",
  //   image: "/image/Galeri/Wawancara/w-11.jpg",
  //   alt: "Calon Anggota: Naufal",
  // },

  // Himpunan
  // {
  //   id: "h-001",
  //   category: "Himpunan",
  //   title: "Wakahim Malu Malu Difoto: Wawancara Calon Anggota",
  //   tanggal: "20 September 2025",
  //   lokasi: "Blok C Lt. 8",
  //   alamatLengkap:
  //     "Blok C Lt. 8, Universitas Nasional, Jl. Sawo Manila No. 61, Pasar Minggu, Jakarta Selatan 12520",
  //   image: "/image/Galeri/Himpunan/h-1.jpg",
  //   alt: "Wakahim Malu Malu Difoto",
  // },
  // {
  //   id: "h-002",
  //   category: "Himpunan",
  //   title: "Foto Bersama: Wawancara Calon Anggota",
  //   tanggal: "20 September 2025",
  //   lokasi: "Blok C Lt. 8",
  //   alamatLengkap:
  //     "Blok C Lt. 8, Universitas Nasional, Jl. Sawo Manila No. 61, Pasar Minggu, Jakarta Selatan 12520",
  //   image: "/image/Galeri/Himpunan/h-2.JPG",
  //   alt: "Pelantikan Pengurus Baru",
  // },
  // {
  //   id: "h-003",
  //   category: "Himpunan",
  //   title: "Foto Bersama: Wawancara Calon Anggota",
  //   tanggal: "20 September 2025",
  //   lokasi: "Blok C Lt. 8",
  //   alamatLengkap:
  //     "Blok C Lt. 8, Universitas Nasional, Jl. Sawo Manila No. 61, Pasar Minggu, Jakarta Selatan 12520",
  //   image: "/image/Galeri/Himpunan/h-3.jpg",
  //   alt: "Gathering Mahasiswa SI",
  // },
  // {
  //   id: "h-004",
  //   category: "Himpunan",
  //   title: "Rapat pra-PLBA",
  //   tanggal: "25 September 2025",
  //   lokasi: "Hangout @Salihara",
  //   alamatLengkap:
  //     "Jl. Salihara No.38-39, Ps. Minggu, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12520",
  //   image: "/image/Galeri/Himpunan/h-4.jpg",
  //   alt: "Rapat pra-PLBA",
  // },
  // {
  //   id: "h-005",
  //   category: "Himpunan",
  //   title: "Rapat pra-PLBA",
  //  tanggal: "25 September 2025",
  //   lokasi: "Hangout @Salihara",
  //   alamatLengkap:
  //     "Jl. Salihara No.38-39, Ps. Minggu, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12520",
  //   image: "/image/Galeri/Himpunan/h-5.jpg",
  //   alt: "Rapat pra-PLBA",
  // },
];

// Helper function untuk filter items berdasarkan category
export const getFilteredItems = (
  filter: GalleryFilter
): FilteredGalleryItem[] => {
  if (filter === "All") {
    return filteredGalleryItems;
  }
  return filteredGalleryItems.filter((item) => item.category === filter);
};

// Helper function untuk mendapatkan jumlah items per category
export const getCategoryCount = (category: GalleryFilter): number => {
  if (category === "All") {
    return filteredGalleryItems.length;
  }
  return filteredGalleryItems.filter((item) => item.category === category)
    .length;
};
