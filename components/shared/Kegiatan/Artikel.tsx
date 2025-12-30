'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { kegiatanData, KegiatanData } from '@/constants/Kegiatan/dataKegiatan';
import { X, Calendar, FileText } from 'lucide-react';

export default function Artikel() {
    const [selectedKegiatan, setSelectedKegiatan] = useState<KegiatanData | null>(null);
    const [isClosing, setIsClosing] = useState(false);

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

    // Cleanup saat component unmount
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <main className="bg-[#4B061A] pt-8 pb-16">
            <div className="border-t-2 border-white max-w-2xs sm:max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-5xl mx-auto rounded-lg mb-12" />
            
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid gap-8">
                    {kegiatanData.slice().reverse().map((kegiatan, index) => (
                        <div 
                            key={kegiatan.id}
                            className={`flex flex-col md:flex-row items-center gap-8 ${
                                index % 2 === 1 ? 'md:flex-row-reverse' : ''
                            } md:bg-transparent bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-0 border border-white/10 md:border-none`}
                        >
                            <div className="hidden md:block flex-1 w-full">
                                <div className="relative w-full h-40 md:h-72 lg:h-80 rounded-xl shadow-2xl bg-white/10 p-4">
                                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                                        <Image
                                            src={kegiatan.image}
                                            alt={kegiatan.title}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 text-white">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/20">
                                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 tracking-wider">
                                        {kegiatan.title}
                                    </h2>
                                    
                                    <p className="text-white/80 text-sm md:text-base mb-4 font-medium">
                                        {kegiatan.date}
                                    </p>
                                    
                                    <div 
                                        className="text-white/90 text-sm md:text-base leading-relaxed mb-6 line-clamp-2 lg:line-clamp-4"
                                        dangerouslySetInnerHTML={{ __html: kegiatan.description }}
                                    />
                                    
                                    <button
                                        onClick={() => handleOpenModal(kegiatan)}
                                        className="inline-block bg-white text-[#4B061A] px-6 py-3 rounded-lg font-semibold text-sm md:text-base hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                                    >
                                        {kegiatan.buttonText}
                                    </button>
                                </div>
                            </div>
                        </div>
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

                            <div className="relative w-full h-64 md:h-80 lg:h-96 mb-6 rounded-xl overflow-hidden">
                                <Image
                                    src={selectedKegiatan.image}
                                    alt={selectedKegiatan.title}
                                    fill
                                    className="object-contain"
                                />
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