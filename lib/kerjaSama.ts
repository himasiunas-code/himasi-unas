import { Partnership } from "@/lib/type/KerjaSama";

// Menentukan warna badge kategori kerja sama
export const getCategoryColor = (category: Partnership["category"]) => {
  switch (category) {
    case "Sponsor":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Media Partner":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "Collaboration":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

// Format tanggal kerja sama ke format lokal Indonesia
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", { 
    month: "short", 
    year: "numeric" 
  });
};

// Mengambil tahun dari string tanggal
export const getYear = (dateString: string) => {
  return new Date(dateString).getFullYear();
};
