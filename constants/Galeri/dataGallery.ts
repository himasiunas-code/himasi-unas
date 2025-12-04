import { GalleryImage, GalleryEvent } from "@/lib/type/Galeri/Galeri";

export const galleryImages: GalleryImage[] = [
  {
    src: "/Coming.jpg",
    alt: "HIMASI 1",
  },
  {
    src: "/Coming.jpg",
    alt: "HIMASI 2",
  },
  {
    src: "/Coming.jpg",
    alt: "HIMASI 3",
  },
  {
    src: "/Coming.jpg",
    alt: "HIMASI 4"
  },
  {
    src: "/Coming.jpg",
    alt: "HIMASI 5",
  },
  {
    src: "/Coming.jpg",
    alt: "HIMASI 6",
  },
];

export const galleryEvent: GalleryEvent = {
  path: "galeri",
  title: "Galeri HIMASI",
  desc: "Dokumentasi kegiatan HIMASI UNAS",
  images: galleryImages,
};
