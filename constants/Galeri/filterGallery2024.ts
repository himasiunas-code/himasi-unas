import { GalleryFilter } from "@/lib/type/Galeri/Galeri";

// Filter categories
export const galleryFilters2024: GalleryFilter[] = [
  "All",
  "PLBA",
  "Himpunan",
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
  CERMASI: {
    displayName: "CERMASI",
    description: "CERMASI HIMASI 2024",
  },
};
