import { ContactCardItem, OfficeLocation } from "@/lib/type/Hubungi";

// Daftar kartu kontak resmi HIMASI UNAS
export const contactCards: ContactCardItem[] = [
  {
    id: "wa-leysa",
    type: "whatsapp",
    title: "WhatsApp",
    subtitle: "Leysa",
    description: "Chat dengan bersangkutan",
    actionText: "Chat Sekarang",
    href: "https://wa.me/6285780136617?text=Halo,%20saya%20ingin%20bertanya%20tentang%20HIMASI%20UNAS",
  },
  {
    id: "wa-evan",
    type: "whatsapp",
    title: "WhatsApp",
    subtitle: "Evan",
    description: "Chat dengan bersangkutan",
    actionText: "Chat Sekarang",
    href: "https://wa.me/6281333105219?text=Halo,%20saya%20ingin%20bertanya%20tentang%20HIMASI%20UNAS",
  },
  {
    id: "email-resmi",
    type: "email",
    title: "Email",
    subtitle: "Resmi",
    description: "Kirim pesan formal",
    actionText: "Kirim Email",
    href: "mailto:himasiunas@gmail.com",
  },
  {
    id: "ig-sosmed",
    type: "instagram",
    title: "Instagram",
    subtitle: "Sosmed",
    description: "Follow aktivitas kami",
    actionText: "Follow Kami",
    href: "https://www.instagram.com/himasi.unas1949/",
  },
];

// Informasi alamat dan lokasi sekretariat HIMASI UNAS
export const officeLocation: OfficeLocation = {
  name: "Sekre SI",
  room: "Blok D, Lantai 2",
  faculty: "Fakultas Teknologi Komunikasi dan Informatika",
  university: "Universitas Nasional",
  address: "Jl. Sawo Manila No.61, RT.14/RW.7",
  district: "Pejaten Bar., Ps. Minggu, Kota Jakarta Selatan",
  cityPostal: "Daerah Khusus Ibukota Jakarta 12520",
  mapsUrl: "https://www.google.com/maps/place/Universitas+Nasional/@-6.2804075,106.8359362,17z/data=!4m15!1m8!3m7!1s0x2e69f21500ac062f:0xd8ee8cebb3cad135!2sJl.+Sawo+Manila+No.61,+RT.9%2FRW.10,+Pejaten+Timur,+Jakarta+Selatan,+DKI+Jakarta,+Daerah+Khusus+Ibukota+Jakarta+12520!3b1!8m2!3d-6.2804075!4d106.8385111!16s%2Fg%2F11vspcmnbw!3m5!1s0x2e69f211176e9827:0xb4bc144c3140a2d9!8m2!3d-6.2807919!4d106.8394182!16s%2Fm%2F0hzqph9?entry=ttu&g_ep=EgoyMDI1MTAwNi4wIKXMDSoASAFQAw%3D%3D",
};
