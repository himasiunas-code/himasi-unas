import Hero from "@/components/shared/Galeri/Hero";
import Filter from "@/components/shared/Galeri/filterGaleri";
import { galleryEvent2025 } from "@/constants/Galeri/dataGallery2025";

export default function Galeri2025Page() {
    return (
        <div>
            <Hero event={galleryEvent2025} year="2025" />
            <Filter year="2025" />
        </div>
    );
}
