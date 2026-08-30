import { Partnership } from "@/lib/type/KerjaSama";

// Daftar kemitraan / kerja sama yang sedang aktif berlangsung
export const activePartnerships: Partnership[] = [];

// Riwayat kemitraan / kerja sama yang telah selesai
export const pastPartnerships: Partnership[] = [
  {
    name: "Zenith Academy",
    logo: "/image/Kerja-sama/Sponsor/Zenith.png",
    category: "Sponsor",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
  },
];
