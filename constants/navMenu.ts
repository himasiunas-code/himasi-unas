import path from "path";

export const navMenu = [
  {
    path: "/",
    title: "Beranda",
  },
  {
    path: "/kegiatan",
    title: "Kegiatan",
  },
  {
    path: "/galeri",
    title: "Galeri",
    dropdown: [
      {
        path: "/galeri/2025-2026",
        title: "2025/2026",
      },
      {
        path: "/galeri/2024-2025",
        title: "2024/2025",
      },
    ],
  },
  {
    path: "/struktur",
    title: "Struktur",
  },
  {
    path: "/kerja-sama",
    title: "Kerja Sama",
  },
  {
    path: "/tentang-kami",
    title: "Tentang Kami",
  },
  {
    path: "/hubungi-kami",
    title: "Hubungi Kami",
  },
];