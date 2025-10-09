export interface KegiatanData {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  image: string;
  buttonText: string;
}

export const kegiatanData: KegiatanData[] = [
  {
    id: 1,
    title: "KEGIATAN 1",
    subtitle: "Seminar Teknologi Informasi & Workshop Programming",
    date: "01-01-2025",
    description: "Loremuah ipsum dolor sit amet, consectetur adipiscing elit. Quisque volutpat facilisis sem vel semper. Ut congue ante quis quam vestibulum, ac scelerisque elit semper. Nulla nec ex eget ante bibendum lobortis.",
    image: "/image/Home/Banner 1.png",
    buttonText: "Baca"
  },
  {
    id: 2,
    title: "KEGIATAN 2",
    subtitle: "Kompetisi Coding & Hackathon Mahasiswa",
    date: "01-01-2025",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque volutpat facilisis sem vel semper. Ut congue ante quis quam vestibulum, ac scelerisque elit semper. Nulla nec ex eget ante bibendum lobortis.",
    image: "/image/Kegiatan/kegiatan2.jpg",
    buttonText: "Baca"
  },
  {
    id: 3,
    title: "KEGIATAN 3",
    subtitle: "Study Excursion & Company Visit",
    date: "01-01-2025", 
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque volutpat facilisis sem vel semper. Ut congue ante quis quam vestibulum, ac scelerisque elit semper. Nulla nec ex eget ante bibendum lobortis.",
    image: "/image/Kegiatan/kegiatan3.jpg",
    buttonText: "Baca"
  },
  {
    id: 4,
    title: "KEGIATAN 4",
    subtitle: "Pelatihan Soft Skills & Leadership Training",
    date: "01-01-2025",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque volutpat facilisis sem vel semper. Ut congue ante quis quam vestibulum, ac scelerisque elit semper. Nulla nec ex eget ante bibendum lobortis.",
    image: "/image/Kegiatan/kegiatan4.jpg", 
    buttonText: "Baca"
  }
];