"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryEvent } from "@/lib/type/Galeri";

interface GaleriHeroProps {
  event: GalleryEvent;
  interval?: number;
  year?: string;
}

// Fungsi untuk memilih 2 indeks foto acak yang berbeda satu sama lain dan berbeda dari foto sebelumnya
function getNextRandomPair(
  len: number,
  prevLeft: number,
  prevRight: number
): [number, number] {
  if (len <= 1) return [0, 0];
  if (len === 2) return [prevRight, prevLeft];

  // Pilih foto kiri acak: bukan foto kiri sebelumnya dan bukan foto kanan sebelumnya
  let left = Math.floor(Math.random() * len);
  let attempts = 0;
  while ((left === prevLeft || left === prevRight) && attempts < 50) {
    left = Math.floor(Math.random() * len);
    attempts++;
  }

  // Pilih foto kanan acak: bukan foto kiri baru, bukan foto kanan sebelumnya, dan bukan foto kiri sebelumnya
  let right = Math.floor(Math.random() * len);
  attempts = 0;
  while (
    (right === left || right === prevRight || right === prevLeft) &&
    attempts < 50
  ) {
    right = Math.floor(Math.random() * len);
    attempts++;
  }

  if (right === left) {
    right = (left + 1) % len;
  }

  return [left, right];
}

// Komponen carousel hero utama halaman galeri per tahun akademik
export default function GaleriHero({ event, interval = 5000, year }: GaleriHeroProps) {
  const [currentPair, setCurrentPair] = useState<[number, number]>([0, 1]);
  const upcomingPairRef = useRef<[number, number]>([0, 1]);

  // Inisialisasi sepasang foto acak saat pertama kali dimuat
  useEffect(() => {
    if (event.images.length > 1) {
      const initial = getNextRandomPair(event.images.length, -1, -1);
      const upcoming = getNextRandomPair(event.images.length, initial[0], initial[1]);
      setCurrentPair(initial);
      upcomingPairRef.current = upcoming;

      // Preload sepasang foto berikutnya ke memori browser
      if (typeof window !== "undefined") {
        if (event.images[upcoming[0]]?.src) {
          const img1 = new window.Image();
          img1.src = event.images[upcoming[0]].src;
        }
        if (event.images[upcoming[1]]?.src) {
          const img2 = new window.Image();
          img2.src = event.images[upcoming[1]].src;
        }
      }
    }
  }, [event.images]);

  // Rotasi berkala: kedua foto kiri dan kanan berganti ke foto acak baru secara independen
  useEffect(() => {
    if (event.images.length <= 1) return;

    const timer = setInterval(() => {
      const nextPair = upcomingPairRef.current;
      setCurrentPair(nextPair);

      // Siapkan pasangan acak berikutnya untuk preload
      const nextUpcoming = getNextRandomPair(
        event.images.length,
        nextPair[0],
        nextPair[1]
      );
      upcomingPairRef.current = nextUpcoming;

      if (typeof window !== "undefined") {
        if (event.images[nextUpcoming[0]]?.src) {
          const img1 = new window.Image();
          img1.src = event.images[nextUpcoming[0]].src;
        }
        if (event.images[nextUpcoming[1]]?.src) {
          const img2 = new window.Image();
          img2.src = event.images[nextUpcoming[1]].src;
        }
      }
    }, interval);

    return () => clearInterval(timer);
  }, [event.images, interval]);

  const [leftIndex, rightIndex] = currentPair;

  return (
    <div className="relative w-full bg-[#FFE8DB]">
      <div className="relative z-10 max-w-7xl mx-auto pt-25 pb-12 px-4 md:pt-30 md:pb-20">
        <div className="flex flex-col items-center md:hidden">
          <div className="relative w-full max-w-md h-52 rounded-2xl overflow-hidden mb-6">
            {event.images.length > 0 ? (
              <AnimatePresence>
                <motion.div
                  key={leftIndex + "-mobile"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={event.images[leftIndex].src}
                    alt={event.images[leftIndex].alt}
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
                    key={leftIndex + "-main"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={event.images[leftIndex].src}
                      alt={event.images[leftIndex].alt}
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
                    key={rightIndex + "-side"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={event.images[rightIndex].src}
                      alt={event.images[rightIndex].alt}
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