// types/gallery.ts
export interface GalleryImage {
  src: string;
  alt: string;
}

export interface GalleryEvent {
  path: string;
  title: string;
  desc: string;
  images: GalleryImage[];
}

export interface FilteredGalleryItem {
  id: string;
  category:
    // | "Proker 1"
    // | "Proker 2"
    // | "Proker 3"
    // | "Proker 4"
    | "PLBA"
    // | "Wawancara"
    | "Himpunan";
  title: string;
  tanggal: string;
  lokasi: string;
  alamatLengkap: string;
  image: string;
  alt: string;
}

export type GalleryFilter =
  | "All"
  // | "Proker 1"
  // | "Proker 2"
  // | "Proker 3"
  // | "Proker 4"
  | "PLBA"
  // | "Wawancara"
  | "Himpunan";
