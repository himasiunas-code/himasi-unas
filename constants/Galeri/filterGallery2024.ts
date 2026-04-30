import { GalleryFilter } from "@/lib/type/Galeri/Galeri";

// Filter categories
export const galleryFilters2024: GalleryFilter[] = [
  "All",
  "PLBA",
  "Mayora",
  "Goes to Malaysia",
  "Stuban ITK",
];

// Filter display names and descriptions
export const filterDescriptions2024: Record<
  GalleryFilter,
  { displayName: string; description: string }
> = {
  All: { displayName: "All", description: "Semua Foto Kegiatan 2024" },
  "PLBA": {
    displayName: "PLBA",
    description: "Pengenalan Lingkungan dan Budaya Akademik 2024",
  },
  Himpunan: {
    displayName: "Himpunan",
    description: "Kebersamaan HIMASI 2024",
  },
  Mayora: {
    displayName: "Mayora",
    description: "Company Visit Mayora 2024",
  },
  "Goes to Malaysia": {
    displayName: "Goes to Malaysia",
    description: "Goes to Malaysia 2024",
  },
  "Stuban ITK": {
    displayName: "Stuban ITK",
    description: "Stuban ITK Kalimantan 2024",
  },
  CERMASI: {
    displayName: "CERMASI",
    description: "CERMASI HIMASI 2024",
  },
  "Seminar Kolab": {
    displayName: "Seminar Kolab",
    description: "Seminar Kolaborasi AMD Ryzen AI 2024",
  },
};
