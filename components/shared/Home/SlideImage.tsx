import Image from "next/image";
import { slideImages } from "@/constants/Home/SlideImages";
import { HeartHandshake } from "lucide-react";

export default function SlideImage() {
    const tripleSlides = [...slideImages, ...slideImages, ...slideImages];

    return(
        <main className="bg-[#4B061A] py-16 overflow-hidden">
            <div className="relative max-w-7xl mx-auto slide-infinite-container">
                <div className="animate-slide-infinite">
                    {tripleSlides.map((slide, index) => (
                        <div 
                            key={`${slide.id}-${index}`}
                            className="shrink-0 w-96 mx-2 slide-container"
                        >
                            <div className="relative">
                                <div 
                                    className={`w-96 h-80 overflow-hidden relative shadow-2xl shape-parallelogram`}
                                    style={{ backgroundColor: slide.backgroundColor }}
                                >
                                    <Image
                                        src={slide.src}
                                        alt={slide.alt}
                                        fill
                                        className="object-cover slide-image"
                                    />
                                    
                                    <div 
                                        className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-black/20 slide-overlay"
                                        style={{ transform: 'skewX(10deg)' }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            
                <div className="himasi-overlay-text">
                    HIMASI 2025
                </div>
                
                <div className="absolute top-0 left-0 w-5 md:w-32 h-full bg-linear-to-r from-[#4B061A] to-transparent pointer-events-none z-10" />
                <div className="absolute top-0 right-0 w-5 md:w-32 h-full bg-linear-to-l from-[#4B061A] to-transparent pointer-events-none z-10" />
            </div>

            <div className="text-center mt-8">
                <p className="text-white/80 text-[10px] sm:text-sm flex items-center justify-center gap-2">
                    <HeartHandshake size={16} className="inline-block" />
                    HIMASI UNAS 2025 - Berbagai Momen & Kebersamaan
                </p>
            </div>
        </main>
    )
}