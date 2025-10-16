import BannerHubungi from "@/components/shared/Hubungi/HeroBanner"; 
import ContactCard from "@/components/shared/Hubungi/ContactCards";
import Location from "@/components/shared/Hubungi/LocationSection";
import ContactForm from "@/components/shared/Hubungi/ContactForm";

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