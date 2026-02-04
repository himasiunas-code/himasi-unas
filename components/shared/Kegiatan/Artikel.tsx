'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { kegiatanData, KegiatanData } from '@/constants/Kegiatan/dataKegiatan';
import { X, Calendar, FileText } from 'lucide-react';

export default function Artikel() {
    const [selectedKegiatan, setSelectedKegiatan] = useState<KegiatanData | null>(null);
    const [isClosing, setIsClosing] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [hasMoved, setHasMoved] = useState(false);

    const handleOpenModal = (kegiatan: KegiatanData) => {
        setSelectedKegiatan(kegiatan);
        setIsClosing(false);
        document.body.style.overflow = 'hidden';
    };

    const handleCloseModal = () => {
        setIsClosing(true);
        document.body.style.overflow = 'unset';
        setTimeout(() => {
            setSelectedKegiatan(null);
            setIsClosing(false);
        }, 300); 
    };

    // Handle scroll ke artikel berdasarkan hash URL
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            // Tunggu sebentar agar elemen sudah ter-render
            setTimeout(() => {
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
            }, 100);
        }
    }, []);

    // Cleanup saat component unmount
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Handle scroll untuk dots indicator
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        
        // Hitung index berdasarkan persentase scroll
        const totalScrollableWidth = scrollWidth - clientWidth;
        const scrollPercentage = scrollLeft / totalScrollableWidth;
        const totalItems = kegiatanData.length;
        const index = Math.round(scrollPercentage * (totalItems - 1));
        
        // Pastikan index dalam range yang valid
        const clampedIndex = Math.max(0, Math.min(index, totalItems - 1));
        setActiveIndex(clampedIndex);
    };

    // Handle click pada dots untuk scroll ke kegiatan
    const handleDotClick = (index: number) => {
        const container = document.querySelector('.overflow-x-auto') as HTMLDivElement;
        if (!container) return;

        const items = container.querySelectorAll('[id^="kegiatan-"]');
        const targetItem = items[index] as HTMLElement;
        
        if (targetItem) {
            targetItem.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest',
                inline: 'center'
            });
            setActiveIndex(index);
        }
    };

    // Handle mouse drag untuk scroll
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        setIsDragging(true);
        setHasMoved(false);
        setStartX(e.pageX - container.offsetLeft);
        setScrollLeft(container.scrollLeft);
        container.style.cursor = 'grabbing';
        container.style.userSelect = 'none';
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(false);
        setHasMoved(false);
        e.currentTarget.style.cursor = 'grab';
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(false);
        setHasMoved(false);
        e.currentTarget.style.cursor = 'grab';
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        
        const container = e.currentTarget;
        const x = e.pageX - container.offsetLeft;
        const distance = Math.abs(x - startX);
        
        // Threshold minimal 5px baru mulai scroll (untuk menghindari accidental drag)
        if (distance > 5) {
            setHasMoved(true);
        }
        
        if (hasMoved || distance > 5) {
            e.preventDefault();
            const walk = (x - startX) * 2; // Multiply by 2 untuk scroll lebih cepat
            container.scrollLeft = scrollLeft - walk;
        }
    };

    return (
        <main className="bg-[#4B061A] pt-8 pb-16">
            <div className="border-t-2 border-white max-w-2xs sm:max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-5xl mx-auto rounded-lg mb-12" />
            
            {/* Horizontal Scroll - All Devices */}
            <div className="mb-8">
                <div 
                    className="overflow-x-auto scrollbar-hide px-6 cursor-grab active:cursor-grabbing" 
                    onScroll={handleScroll}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    <div className="flex gap-4" style={{ width: 'max-content' }}>
                        {kegiatanData.slice().reverse().map((kegiatan, idx) => (
                            <div 
                                id={`kegiatan-${idx}`}
                                key={kegiatan.id}
                                className="flex flex-col w-75 md:w-96 lg:w-[450px] shrink-0 scroll-mt-2 backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-white/50"
                            >
                                <div className="block w-full mb-6">
                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                                        {kegiatan.image && (
                                            <Image
                                                src={kegiatan.image}
                                                alt={kegiatan.title}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="text-white">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/20">
                                        <h2 className="text-sm md:text-base lg:text-lg font-bold mb-2 tracking-wider">
                                            {kegiatan.title}
                                        </h2>
                                        
                                        <p className="text-white/80 text-sm md:text-base mb-4 font-medium">
                                            {kegiatan.date}
                                        </p>
                                        
                                        <div 
                                            className="text-white/90 text-sm md:text-base leading-relaxed mb-6 line-clamp-3"
                                            dangerouslySetInnerHTML={{ __html: kegiatan.description }}
                                        />
                                        
                                        <button
                                            onClick={() => handleOpenModal(kegiatan)}
                                            className="inline-block bg-white text-[#4B061A] px-6 py-3 rounded-lg font-semibold text-sm md:text-base hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl cursor-pointer w-full"
                                        >
                                            {kegiatan.buttonText}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-6">
                    {kegiatanData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer hover:bg-white/70 ${
                                index === activeIndex 
                                    ? 'w-8 bg-white' 
                                    : 'w-2 bg-white/30'
                            }`}
                            aria-label={`Scroll ke kegiatan ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {selectedKegiatan && (
                <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-26 overflow-y-auto ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
                    <div className={`bg-[#4B061A] rounded-2xl max-w-4xl w-full my-8 relative ${isClosing ? 'animate-slideOut' : 'animate-slideIn'}`}>
                        {/* Close Button */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 rounded-full p-2 transition-colors duration-200"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        <div className="p-6 md:p-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-[#FFFFFF] mb-4 pr-16">
                                {selectedKegiatan.title}
                            </h1>

                            <div className="relative w-full h-64 md:h-80 lg:h-96 mb-6 rounded-xl overflow-hidden bg-gray-200">
                                {selectedKegiatan.image && (
                                    <Image
                                        src={selectedKegiatan.image}
                                        alt={selectedKegiatan.title}
                                        fill
                                        className="object-contain"
                                    />
                                )}
                            </div>

                            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                                {selectedKegiatan.subtitle}
                            </h2>

                            <div className="mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-white" />
                                <p className="text-white font-medium">
                                    {selectedKegiatan.date}
                                </p>
                            </div>

                            <div className="prose prose-lg max-w-none">
                                <div className="flex items-start gap-2 mb-3">
                                    <FileText className="w-5 h-5 text-white mt-1 shrink-0" />
                                    <h3 className="text-lg font-semibold text-white">Deskripsi Lengkap</h3>
                                </div>
                                <div 
                                    className="text-white leading-relaxed text-justify"
                                    dangerouslySetInnerHTML={{ __html: selectedKegiatan.description }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                /* Fade Animations */
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                
                .animate-fadeOut {
                    animation: fadeOut 0.3s ease-out forwards;
                }
                
                /* Slide Animations */
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                @keyframes slideOut {
                    from {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.95);
                    }
                }
                
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out forwards;
                }
                
                .animate-slideOut {
                    animation: slideOut 0.3s ease-out forwards;
                }
            `}</style>
        </main>
    );
}