import Hero from "@/components/shared/Galeri/Hero";
import Filter from "@/components/shared/Galeri/filterGaleri";
import { galleryEvent2024 } from "@/constants/Galeri/dataGallery2024";

export default function Galeri2024Page() {
    return (
        <div>
            <Hero event={galleryEvent2024} year="2024" />
            <Filter year="2024" />
        </div>
    );
}
