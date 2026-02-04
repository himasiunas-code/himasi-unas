import Hero from "@/components/shared/Home/Hero";
import Introduction from "@/components/shared/Home/Introduction";
import Slide from "@/components/shared/Home/SlideImage";
import Kegiatan from "@/components/shared/Home/Activity";
import Feed from "@/components/shared/Home/Berita";

export default function Home() {
    return(
        <main className="overflow-hidden">
            <Hero />
            <Introduction />
            <Slide />
            <Kegiatan />
            <Feed />
        </main>
    )
}