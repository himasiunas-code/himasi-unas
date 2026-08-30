// Tipe periode kegiatan kepengurusan
export type KegiatanPeriod = "2024/2025" | "2025/2026" | "2023/2024";

// Tipe data detail artikel kegiatan
export interface KegiatanData {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  image: string;
  buttonText: string;
  period: KegiatanPeriod;
}
