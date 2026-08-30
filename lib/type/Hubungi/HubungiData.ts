// Tipe data kartu kontak narahubung
export interface ContactCardItem {
  id: string;
  type: "whatsapp" | "email" | "instagram";
  title: string;
  subtitle: string;
  description: string;
  actionText: string;
  href: string;
}

// Tipe data alamat dan lokasi sekretariat
export interface OfficeLocation {
  name: string;
  room: string;
  faculty: string;
  university: string;
  address: string;
  district: string;
  cityPostal: string;
  mapsUrl: string;
}

// Tipe data form input pesan kontak
export interface ContactFormData {
  namaLengkap: string;
  email: string;
  nomorTelepon: string;
  subjek: string;
  isiPesan: string;
}
