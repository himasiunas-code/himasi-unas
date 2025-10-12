"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryEvent } from "@/lib/type/Galeri/Galeri";

interface EventCarouselProps {
  event: GalleryEvent;
  interval?: number;
}

export default function EventCarousel({ event, interval = 3000 }: EventCarouselProps) {
  const [current, setCurrent] = useState(0);


  useEffect(() => {
    if (event.images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % event.images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [event.images.length, interval]);

  return (
    <div className="relative w-full bg-[linear-gradient(to_bottom,#FFE8DB_70%,#E4C6BE_80%,#994555_85%,#732E39_90%,#4B061A_100%)]">
      <div className="max-w-7xl mx-auto pt-30 pb-12 px-4 md:pt-30 md:pb-20">
        <div className="flex flex-col items-center md:hidden">
          <div className="relative w-full max-w-md h-52 rounded-2xl overflow-hidden mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={current + "-mobile"}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <Image
                  src={event.images[current].src}
                  alt={event.images[current].alt}
                  fill
                  className="object-cover rounded-2xl"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <h2 className="uppercase font-extrabold text-center text-2xl text-black pb-10">
            Welcome to gallery of{" "}
            <span className="bg-[#4B061A] bg-clip-text text-transparent">
              himpunan mahasiswa sistem informasi
            </span>
          </h2>
        </div>

        <div className="hidden md:grid md:grid-cols-2 items-center pb-5">
          <div className="text-black max-w-xs lg:max-w-lg">
            <h2 className="uppercase font-bold text-left text-xl lg:text-4xl mb-2">
              Welcome to gallery of{" "}
              <span className="bg-[#4B061A] bg-clip-text text-transparent">
                himpunan mahasiswa sistem informasi
              </span>
            </h2>
          </div>

          <div className="flex items-center w-full gap-4">
            <div className="relative w-1/2 h-72 lg:h-96 rounded-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current + "-main"}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={event.images[current].src}
                    alt={event.images[current].alt}
                    fill
                    className="object-cover rounded-2xl"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {event.images.length > 1 && (
              <div className="relative w-1/2 h-60 lg:h-80 rounded-2xl overflow-hidden hidden md:block">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current + "-preview"}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={event.images[(current + 1) % event.images.length].src}
                      alt={event.images[(current + 1) % event.images.length].alt}
                      fill
                      className="object-cover opacity-90 rounded-2xl"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}