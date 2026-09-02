"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryEvent } from "@/lib/type/Galeri";

interface GaleriHeroProps {
  event: GalleryEvent;
  interval?: number;
  year?: string;
}

// Komponen carousel hero utama halaman galeri per tahun akademik
export default function GaleriHero({ event, interval = 5000, year }: GaleriHeroProps) {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);

  // Inisialisasi indeks acak saat pertama kali dimuat di browser
  useEffect(() => {
    if (event.images.length > 1) {
      const initialCurrent = Math.floor(Math.random() * event.images.length);
      let initialNext = (initialCurrent + 1) % event.images.length;
      while (initialNext === initialCurrent && event.images.length > 1) {
        initialNext = Math.floor(Math.random() * event.images.length);
      }
      setCurrent(initialCurrent);
      setNext(initialNext);
    }
  }, [event.images.length]);

  // Preload gambar berikutnya ke memori browser sebelum giliran tampil tiba
  useEffect(() => {
    if (typeof window !== "undefined" && event.images[next]?.src) {
      const img = new window.Image();
      img.src = event.images[next].src;
    }
  }, [next, event.images]);

  // Rotasi gambar berkala (5 detik) - gambar baru langsung muncul instan tanpa delay
  useEffect(() => {
    if (event.images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(next);
      setNext((prevNext) => {
        let candidate = prevNext;
        while ((candidate === prevNext || candidate === next) && event.images.length > 2) {
          candidate = Math.floor(Math.random() * event.images.length);
        }
        return candidate === prevNext ? (prevNext + 1) % event.images.length : candidate;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [next, event.images.length, interval]);

  return (
    <div className="relative w-full bg-[#FFE8DB]">
      <div className="relative z-10 max-w-7xl mx-auto pt-25 pb-12 px-4 md:pt-30 md:pb-20">
        <div className="flex flex-col items-center md:hidden">
          <div className="relative w-full max-w-md h-52 rounded-2xl overflow-hidden mb-6">
            {event.images.length > 0 ? (
              <AnimatePresence>
                <motion.div
                  key={current + "-mobile"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={event.images[current].src}
                    alt={event.images[current].alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 450px"
                    quality={85}
                    priority
                    className="object-cover rounded-2xl"
                  />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-2xl">
                <p className="text-gray-500 text-center px-4">Belum ada foto</p>
              </div>
            )}
          </div>

          <h2 className="uppercase font-extrabold text-center text-2xl text-black pb-10">
            Welcome to gallery of{" "}
            <span className="bg-[#4B061A] bg-clip-text text-transparent">
              himpunan mahasiswa sistem informasi
            </span>
            {year && (
              <span className="block mt-2 text-3xl font-black bg-linear-to-r from-[#8B1538] via-[#6B0E28] to-[#4B061A] bg-clip-text text-transparent">
                {year}
              </span>
            )}
          </h2>
        </div>

        <div className="hidden md:grid md:grid-cols-2 items-center pb-5">
          <div className="text-black max-w-xs lg:max-w-lg">
            <h2 className="uppercase font-bold text-left text-xl lg:text-4xl mb-2">
              Welcome to gallery of{" "}
              <span className="bg-[#4B061A] bg-clip-text text-transparent">
                himpunan mahasiswa sistem informasi
              </span>
              {year && (
                <span className="block mt-3 text-4xl lg:text-5xl font-black bg-linear-to-r from-[#8B1538] via-[#6B0E28] to-[#4B061A] bg-clip-text text-transparent">
                  {year}
                </span>
              )}
            </h2>
          </div>

          <div className="flex items-center w-full gap-4">
            <div className="relative w-1/2 h-72 lg:h-96 rounded-2xl overflow-hidden">
              {event.images.length > 0 ? (
                <AnimatePresence>
                  <motion.div
                    key={current + "-main"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={event.images[current].src}
                      alt={event.images[current].alt}
                      fill
                      sizes="(max-width: 1024px) 350px, 450px"
                      quality={85}
                      priority
                      className="object-cover rounded-2xl"
                    />
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-2xl">
                  <p className="text-gray-500 text-center px-4">Belum ada foto</p>
                </div>
              )}
            </div>

            {event.images.length > 1 && (
              <div className="relative w-1/2 h-60 lg:h-80 rounded-2xl overflow-hidden hidden md:block">
                <AnimatePresence>
                  <motion.div
                    key={next + "-preview"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={event.images[next].src}
                      alt={event.images[next].alt}
                      fill
                      sizes="(max-width: 1024px) 250px, 350px"
                      quality={85}
                      className="object-cover opacity-90 rounded-2xl"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Dekorasi gelombang bawah */}
      <div className="absolute bottom-0 left-0 right-0 z-0">
        <svg viewBox="0 0 1200 120" className="w-full h-auto">
          <path
            d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
            fill="rgba(75, 6, 26, 1)"
          />
        </svg>
      </div>
    </div>
  );
}