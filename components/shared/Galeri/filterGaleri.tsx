"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, MapPin, Map, Folder } from "lucide-react";
import FilterIcon from "@/public/image/Galeri/Filter Support.png";
import {
  galleryFilters,
  getFilteredItems,
  getCategoryCount,
  filterDescriptions,
} from "@/constants/Galeri/filterGallery";
import { GalleryFilter, FilteredGalleryItem } from "@/lib/type/Galeri/Galeri";

export default function FilterGaleri() {
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>("Himpunan");
  const [filteredItems, setFilteredItems] = useState<FilteredGalleryItem[]>(
    getFilteredItems("Himpunan")
  );
  const [selectedItem, setSelectedItem] = useState<FilteredGalleryItem | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilterChange = (filter: GalleryFilter) => {
    setActiveFilter(filter);
    setFilteredItems(getFilteredItems(filter));
  };

  const openModal = (item: FilteredGalleryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
    document.body.style.overflow = "unset";
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscKey);
      return () => {
        document.removeEventListener("keydown", handleEscKey);
      };
    }
  }, [isModalOpen]);

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
          {galleryFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-3 py-2 md:px-6 md:py-3 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 cursor-pointer relative group ${
                activeFilter === filter
                  ? "bg-linear-to-r from-[#A14CF3] to-[#345CEB] text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              title={filterDescriptions[filter].description}
            >
              {filterDescriptions[filter].displayName} (
              {getCategoryCount(filter)})
              <div className="hidden md:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-10 max-w-xs text-center">
                {filterDescriptions[filter].description}
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
              {filterDescriptions[activeFilter].description}
            </h2>
            <div className="text-white/60 text-xs md:text-sm font-medium">
              ({filteredItems.length} Foto)
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="relative rounded-xl md:rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group"
            >
              <div className="relative w-full h-32 sm:h-40 md:h-64">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-300" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none group-hover:pointer-events-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Button clicked for:", item.title);
                      openModal(item);
                    }}
                    className="detail-button bg-linear-to-r from-[#A14CF3] to-[#345CEB] text-white px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold text-sm md:text-base transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-lg pointer-events-auto cursor-pointer"
                  >
                    Lihat Detail
                  </button>
                </div>

                <div className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4">
                  <div className="space-y-0.5 md:space-y-1 text-white text-xs md:text-sm text-shadow-lg">
                    <p className="flex items-center gap-1 md:gap-2">
                      <Calendar className="text-[#FFE8DB] w-3 h-3 md:w-4 md:h-4 shrink-0" />
                      <span className="font-medium truncate text-xs md:text-sm">
                        {item.tanggal}
                      </span>
                    </p>
                    <p className="flex items-center gap-1 md:gap-2">
                      <MapPin className="text-[#FFE8DB] w-3 h-3 md:w-4 md:h-4 shrink-0" />
                      <span className="font-medium truncate text-xs md:text-sm">
                        {item.lokasi}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="absolute top-2 left-2 md:hidden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Fallback button clicked for:", item.title);
                      openModal(item);
                    }}
                    className="bg-linear-to-r from-[#A14CF3] to-[#345CEB] text-white px-2 py-1 rounded-full font-semibold text-xs shadow-lg cursor-pointer"
                  >
                    Detail
                  </button>
                </div>

                <div className="absolute inset-0 bg-linear-to-t from-[#A14CF3]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">
              Tidak ada kegiatan untuk filter &quot;{activeFilter}&quot;
            </p>
          </div>
        )}
      </div>

      {isModalOpen && selectedItem && (
        <div
          key={selectedItem.id}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-start justify-center pt-32 pb-4 px-4 modal-backdrop"
          onClick={closeModal}
        >
          <div
            className="bg-[#4B061A] rounded-2xl max-w-4xl w-full max-h-[75vh] overflow-y-auto modal-enter modal-enter-active scrollbar-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h3 className="text-white text-xl md:text-2xl font-bold">
                Detail Foto
              </h3>
              <button
                onClick={closeModal}
                className="text-white/60 hover:text-white text-2xl font-bold transition-colors duration-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="relative">
                  <div className="relative w-full h-64 md:h-80 lg:h-96 bg-white/5 rounded-xl overflow-hidden">
                    <Image
                      src={selectedItem.image}
                      alt={selectedItem.alt}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-white text-xl md:text-2xl font-bold mb-2">
                      {selectedItem.title}
                    </h4>
                    <p className="text-white/70 text-sm">
                      {
                        filterDescriptions[
                          selectedItem.category as GalleryFilter
                        ].description
                      }
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-linear-to-r from-[#A14CF3] to-[#345CEB] rounded-full flex items-center justify-center">
                        <Calendar className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Tanggal</p>
                        <p className="text-white font-medium">
                          {selectedItem.tanggal}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-linear-to-r from-[#A14CF3] to-[#345CEB] rounded-full flex items-center justify-center">
                        <MapPin className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Lokasi</p>
                        <p className="text-white font-medium">
                          {selectedItem.lokasi}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-linear-to-r from-[#A14CF3] to-[#345CEB] rounded-full flex items-center justify-center shrink-0 mt-1">
                        <Map className="text-white w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white/60 text-sm">Alamat Lengkap</p>
                        <p className="text-white font-medium leading-relaxed">
                          {selectedItem.alamatLengkap}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-linear-to-r from-[#A14CF3] to-[#345CEB] rounded-full flex items-center justify-center">
                        <Folder className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Kategori</p>
                        <p className="text-white font-medium">
                          {selectedItem.category}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={closeModal}
                      className="w-full bg-linear-to-r from-[#A14CF3] to-[#345CEB] text-white py-3 px-6 rounded-full font-semibold hover:shadow-lg transition-shadow duration-300"
                    >
                      Tutup Detail
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
