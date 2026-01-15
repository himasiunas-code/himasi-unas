import Link from "next/link";
import Image from "next/image";
import { BANNER_DATA } from "@/constants/Home/Banner";

export default function Activity() {
    return(
        <main className="bg-[#4B061A] py-15 md:py-20">
            <div className="w-full max-w-6xl mx-auto px-4 flex justify-center items-center text-center">
                <h2 className="font-bold text-xl md:text-2xl lg:text-4xl xl:text-6xl uppercase text-white">Kegiatan</h2>
            </div>
            
            <div className="mt-8 md:mt-12">
                <div className="w-full">
                    <div className="overflow-x-auto scrollbar-custom px-4 lg:px-8">
                        <div className="flex gap-4 md:gap-6 pb-4" style={{ width: 'max-content' }}>
                            {[...BANNER_DATA].reverse().map((banner) => (
                                <div key={banner.id} className="group relative overflow-hidden rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 w-72 sm:w-80 lg:w-96 shrink-0">
                                    <div className="relative aspect-video overflow-hidden">
                                        <Image
                                            src={banner.image}
                                            alt={banner.alt}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 text-white">
                                        <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-2">{banner.title}</h3>
                                        <p className="text-xs sm:text-sm opacity-90 line-clamp-2 lg:line-clamp-3">{banner.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex justify-center mt-4">
                        <p className="text-white/70 text-xs sm:text-sm">← Geser untuk melihat kegiatan lainnya →</p>
                    </div>
                </div>

                <div className="w-full flex justify-center pt-4 md:pt-8 pb-10 relative">
                    <Link href="/kegiatan" className="bg-[#FFE8DB] text-xs md:text-sm lg:text-base xl:text-lg text-black font-bold px-4 md:px-8 py-3 rounded-xl hover:rotate-1 hover:bg-[#E4C6BE] transition relative z-10">
                      Info Lebih Lanjut
                    </Link>
                </div>
            </div>
        </main>
    )
}