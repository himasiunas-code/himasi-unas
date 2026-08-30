import { StaticImageData } from "next/image";

// Tipe data pimpinan Badan Pengurus Harian (BPH)
export type Leader = {
  id: string;
  name: string;
  image: StaticImageData;
  role: "Ketua Himpunan" | "Wakil Himpunan" | "Bendahara" | "Sekretaris";
  instagram: string;
  description: string;
};
