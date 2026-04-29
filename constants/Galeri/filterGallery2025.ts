import { GalleryFilter } from "@/lib/type/Galeri/Galeri";

// Filter categories
export const galleryFilters2025: GalleryFilter[] = [
  "All",
  "PLBA",
  "Himpunan",
  "CERMASI",
];

// Filter display names and descriptions
export const filterDescriptions2025: Record<
  GalleryFilter,
  { displayName: string; description: string }
> = {
  All: { displayName: "All", description: "Semua Foto Kegiatan 2025" },
  "PLBA": {
    displayName: "PLBA",
    description: "Pengenalan Lingkungan dan Budaya Akademik 2025",
  },
  Himpunan: {
    displayName: "Himpunan",
    description: "Kebersamaan HIMASI 2025",
  },
  Mayora: {
    displayName: "Mayora",
    description: "Company Visit Mayora 2025",
  },
  CERMASI: {
    displayName: "CERMASI",
    description: "CERMASI HIMASI 2025",
  },
};
