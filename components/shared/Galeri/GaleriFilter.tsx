"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import FilterIcon from "@/public/image/Galeri/Filter Support.png";
import { 
  galleryFilters2024,
  filterDescriptions2024,
  galleryFilters2025,
  filterDescriptions2025,
  galleryImages2024,
  galleryImages2025,
} from "@/constants/Galeri";
import { GalleryFilter, GalleryImage } from "@/lib/type/Galeri";

interface GaleriFilterProps {
  year?: "2024" | "2025";
}

// Komponen filter dan grid album foto galeri dengan lightbox modal
export default function GaleriFilter({ year }: GaleriFilterProps) {
  // Pilih data berdasarkan tahun
  const filters = year === "2024" ? galleryFilters2024 : galleryFilters2025;
  const descriptions = year === "2024" ? filterDescriptions2024 : filterDescriptions2025;
  const allImages = year === "2024" ? galleryImages2024 : galleryImages2025;

  const [activeFilter, setActiveFilter] = useState<GalleryFilter>("All");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Filter images berdasarkan kategori dan balik urutan (terbaru dulu)
  const filteredImages = (activeFilter === "All" 
    ? allImages 
    : allImages.filter(img => img.category === activeFilter)).slice().reverse();

  const handleFilterChange = (filter: GalleryFilter) => {
    setActiveFilter(filter);
  };

  const openModal = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = "unset";
  };

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  const goToNext = () => {
    const newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImage, currentIndex]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <main className="bg-[#4B061A] py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-row items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <Image
            src={FilterIcon}
            alt="Filter Icon"
            width={20}
            height={20}
            className="md:w-7 md:h-7"
          />
          <div className="flex flex-row items-center gap-2 md:gap-3">
            <p className="font-bold text-xl md:text-2xl tracking-widest text-white">
              Filter
            </p>
          </div>
        </div>

        <div className="mb-6 md:mb-8">
          <p className="text-white/70 text-xs md:text-sm">
            <span className="text-[#A14CF3] font-semibold">PK</span> = Program
            Kerja
          </p>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-3 py-2 md:px-6 md:py-3 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 cursor-pointer relative group ${
                activeFilter === filter
                  ? "bg-linear-to-r from-[#A14CF3] to-[#345CEB] text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              title={descriptions[filter].description}
            >
              {descriptions[filter].displayName}
              <div className="hidden md:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-10 max-w-xs text-center">
                {descriptions[filter].description}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black/90"></div>
              </div>
            </button>
          ))}
        </div>

        <div className="mb-6 md:mb-8 text-center">
          <div
            key={activeFilter}
            className="inline-flex flex-col items-center gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-3 bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl border border-white/10 animate-fade-in"
          >
            <h2 className="text-white text-lg md:text-xl font-semibold text-center">
              {descriptions[activeFilter].description}
            </h2>
            <div className="text-white/60 text-xs md:text-sm font-medium">
              ({filteredImages.length} Foto)
            </div>
          </div>
        </div>

        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                onClick={() => openModal(image, index)}
                className="relative rounded-xl md:rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group cursor-pointer"
              >
                <div className="relative w-full h-32 sm:h-40 md:h-64">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    quality={75}
                    loading="lazy"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-300" />

                  <div className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4">
                    <p className="text-white text-xs md:text-sm font-semibold truncate">
                      {image.alt}
                    </p>
                  </div>

                  <div className="absolute inset-0 bg-linear-to-t from-[#A14CF3]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/80 text-lg mb-2">
              Belum ada foto untuk tahun {year}
            </p>
          </div>
        )}
      </div>

      {/* Modal untuk melihat gambar full */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200"
            aria-label="Close"
          >
            <X size={24} className="text-white" />
          </button>

          {/* Previous button */}
          {filteredImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200"
              aria-label="Previous"
            >
              <ChevronLeft size={32} className="text-white" />
            </button>
          )}

          {/* Next button */}
          {filteredImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200"
              aria-label="Next"
            >
              <ChevronRight size={32} className="text-white" />
            </button>
          )}

          {/* Image container */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                sizes="90vw"
                quality={85}
                className="object-contain"
                priority
              />
            </div>

            {/* Image info */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6">
              <p className="text-white text-lg md:text-xl font-semibold mb-1">
                {selectedImage.alt}
              </p>
              <p className="text-white/60 text-sm mt-2">
                {currentIndex + 1} / {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}