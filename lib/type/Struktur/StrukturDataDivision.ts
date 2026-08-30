import { StaticImageData } from "next/image";

// Tipe data anggota divisi
export type Member = {
  id: string;
  name: string;
  image: StaticImageData;
  role: string;
  instagram: string;
};

// Tipe data divisi himpunan
export type Division = {
  id: string;
  name: string;
  description: string;
  members: Member[];
};

// Tipe data panitia/pengurus slider galeri struktur
export interface CommitteeMember {
  src: string;
  caption: string;
  fullName: string;
  role: string;
}
