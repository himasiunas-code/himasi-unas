'use client';

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { ketuaData } from "@/constants/TentangKami";

// Komponen sejarah berdirinya HIMASI dan riwayat kepemimpinan Ketua/Wakil dari masa ke masa
export default function TentangKamiSejarah() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        
        // Jika sudah di ujung kanan
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          setActiveIndex(ketuaData.length - 1);
        } 
        // Jika di awal
        else if (scrollLeft <= 10) {
          setActiveIndex(0);
        }
        // Perhitungan normal
        else {
          const cards = container.querySelectorAll('.card-item');
          if (cards.length > 0) {
            const centerPosition = scrollLeft + clientWidth / 2;
            let closestIndex = 0;
            let closestDistance = Infinity;
            
            cards.forEach((card, index) => {
              const cardElement = card as HTMLElement;
              const cardCenter = cardElement.offsetLeft + cardElement.offsetWidth / 2;
              const distance = Math.abs(centerPosition - cardCenter);
              
              if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
              }
            });
            
            setActiveIndex(closestIndex);
          }
        }
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToCard = (index: number) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cards = container.querySelectorAll('.card-item');
      if (cards[index]) {
        const cardElement = cards[index] as HTMLElement;
        const containerWidth = container.clientWidth;
        const cardWidth = cardElement.offsetWidth;
        const scrollPosition = cardElement.offsetLeft - (containerWidth / 2) + (cardWidth / 2);
        
        container.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <main className="relative py-16 lg:py-20">
      {/* Dekorasi gelombang atas */}
      <div className="absolute top-0 left-0 w-full z-20 transform -translate-y-px">
        <svg viewBox="0 0 1200 120" className="w-full h-auto" preserveAspectRatio="none">
          <path
            d="M0,60 C300,120 900,0 1200,60 L1200,0 L0,0 Z"
            fill="#FFE8DB"
          />
        </svg>
      </div>
      
      {/* Gambar latar seksi sejarah */}
      <div className="absolute bg-[#4B061A] inset-0 z-0">
        <Image
          src="/image/Tentang-kami/background-support.png"
          alt="Background Sejarah HIMASI"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Konten narasi sejarah */}
      <div className="relative z-10 container mx-auto px-4 max-w-5xl mb-16 lg:mb-24">
        <div className="text-center pt-8 mb-8 lg:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white uppercase tracking-wider inline-block">
            SEJARAH
          </h2>
          <div className="h-1 bg-white w-32 md:w-40 mx-auto mt-3"></div>
        </div>

        <div className="space-y-6 text-white">
          <p className="text-sm md:text-base lg:text-lg leading-relaxed text-justify">
            <span className="font-bold">HIMASI</span> didirikan di Jakarta pada tahun 2008 dengan tujuan utama untuk 
            menindaklanjuti kerja sama dan rasa kebersamaan, baik di antara mahasiswa 
            Sistem Informasi sendiri maupun dengan mahasiswa lain di Fakultas Teknologi 
            Komunikasi dan Informatika serta Universitas Nasional secara keseluruhan.
          </p>

          <p className="text-sm md:text-base lg:text-lg leading-relaxed text-justify">
            <span className="font-bold">HIMASI</span> menjadi wadah untuk menyalurkan aspirasi, pemikiran, serta karya cipta 
            mahasiswa sebagai bentuk kontribusi nyata dalam pengabdian kepada 
            masyarakat, demi mendukung kemajuan bangsa dan negara.
          </p>
        </div>
      </div>

      {/* Konten riwayat kepemimpinan Ketua & Wakil */}
      <div className="relative z-10 container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white uppercase leading-tight">
            KETUA HIMPUNAN &<br />WAKIL KETUA HIMPUNAN
          </h2>
        </div>

        {/* Slider kartu kepemimpinan */}
        <div ref={scrollRef} className="overflow-x-auto scrollbar-hide pb-4">
          <div className="flex gap-6 md:gap-8 lg:gap-10 px-4" style={{ width: 'max-content' }}>
            {ketuaData.map((data, index) => (
              <div key={index} className="card-item flex flex-col items-center shrink-0 w-72">
                {/* Periode */}
                <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
                  {data.periode}
                </h3>
                
                {/* Kartu foto dan nama */}
                <div className="w-full bg-[#3A0414]/80 rounded-3xl p-6 border border-white/10 hover:scale-105 transition-transform duration-300">
                  <div className="relative w-full aspect-3/4 bg-[#2A0310] rounded-2xl overflow-hidden mb-4">
                    <Image
                      src={data.image}
                      alt={`Ketua HIMASI ${data.periode}`}
                      fill
                      sizes="(max-width: 768px) 240px, 288px"
                      quality={80}
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="text-center text-white space-y-2">
                    <p className="font-semibold text-sm md:text-base">
                      Ketua: <span className="font-normal">{data.ketua}</span>
                    </p>
                    <p className="font-semibold text-sm md:text-base">
                      Wakil: <span className="font-normal">{data.wakil}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Indikator dot navigasi */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {ketuaData.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToCard(index)}
              className={`transition-all duration-300 rounded-full ${
                activeIndex === index
                  ? 'w-8 h-3 bg-linear-to-r from-[#FFE8DB] to-[#FFFFFA]'
                  : 'w-3 h-3 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Scroll ke periode ${ketuaData[index].periode}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
