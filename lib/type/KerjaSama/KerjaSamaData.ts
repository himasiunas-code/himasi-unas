// Tipe data kemitraan/partnership kerja sama
export interface Partnership {
  name: string;
  logo: string;
  category: "Sponsor" | "Media Partner" | "Collaboration";
  startDate?: string;
  endDate?: string;
}
