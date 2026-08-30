import { StaticImageData } from "next/image";

// Tipe data item slide gambar momen beranda
export interface SlideImageData {
  id: number;
  src: StaticImageData;
  alt: string;
  backgroundColor: string;
  textColor: string;
}
