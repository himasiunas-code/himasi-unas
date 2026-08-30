import { StaticImageData } from "next/image";
import { LucideIcon } from "lucide-react";

// Tipe data kartu divisi beranda
export interface Division {
  id: number;
  title: string;
  image: StaticImageData | LucideIcon;
}
