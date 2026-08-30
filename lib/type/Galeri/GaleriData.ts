// Tipe data foto item galeri
export interface GalleryImage {
  src: string;
  alt: string;
  category?: "PLBA" | "Himpunan" | "CERMASI" | "Mayora" | "Goes to Malaysia" | "Stuban ITK" | "Seminar Kolab";
}

// Tipe data event kegiatan galeri tahunan
export interface GalleryEvent {
  path: string;
  title: string;
  desc: string;
  images: GalleryImage[];
}

// Tipe data item galeri terfilter
export interface FilteredGalleryItem {
  id: string;
  category:
    | "PLBA"
    | "CERMASI"
    | "Mayora"
    | "Goes to Malaysia"
    | "Stuban ITK"
    | "Seminar Kolab"
    | "Himpunan";
  title: string;
  tanggal: string;
  lokasi: string;
  alamatLengkap: string;
  image: string;
  alt: string;
}

// Kategori filter galeri
export type GalleryFilter =
  | "All"
  | "PLBA"
  | "CERMASI"
  | "Mayora"
  | "Goes to Malaysia"
  | "Stuban ITK"
  | "Seminar Kolab"
  | "Himpunan";
