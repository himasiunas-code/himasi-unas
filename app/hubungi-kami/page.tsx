import { Metadata } from 'next';
import BannerHubungi from "@/components/shared/Hubungi/HeroBanner"; 
import ContactCard from "@/components/shared/Hubungi/ContactCards";
import Location from "@/components/shared/Hubungi/LocationSection";
import ContactForm from "@/components/shared/Hubungi/ContactForm";

export const metadata: Metadata = {
  title: 'Hubungi Kami | HIMASI UNAS',
  description: 'Silakan hubungi Himpunan Mahasiswa Sistem Informasi (HIMASI) Universitas Nasional jika Anda memiliki pertanyaan atau ingin bekerja sama.'
};

export default function PageHubungi() {
  return (
    <>
      <BannerHubungi />
      <ContactCard />
      <Location />
      <ContactForm />
    </>
  )
}