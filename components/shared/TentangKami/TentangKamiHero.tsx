"use client";

import React from "react";
import Image from "next/image";
import Logo from "@/public/icon/LOGO HIMASI UNAS.png";

// Komponen hero header halaman Tentang Kami
export default function TentangKamiHero() {
  return (
    <main className="relative overflow-hidden min-h-[70vh] lg:min-h-[80vh]">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-[#4B061A] via-[#6B1B2F] to-[#8B2538]"></div>

      {/* Elemen latar dekoratif */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-4 lg:left-10 w-20 h-20 lg:w-32 lg:h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-8 lg:right-20 w-32 h-32 lg:w-48 lg:h-48 bg-white/3 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-40 right-8 lg:right-32 w-16 h-16 lg:w-24 lg:h-24 bg-white/10 rounded-full blur-lg animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 lg:w-96 lg:h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Kontainer konten utama */}
      <div className="relative z-10 container mx-auto px-4 max-w-6xl pt-12 lg:pt-1 mt-15 lg:mt-10 min-h-[70vh] lg:min-h-[80vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          {/* Logo HIMASI */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative w-64 h-64 lg:w-80 lg:h-80 group">
              <div className="absolute inset-8 rounded-full bg-white/10 backdrop-blur-sm shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <Image
                  src={Logo}
                  alt="Logo HIMASI UNAS"
                  fill
                  className="object-contain p-4 drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Teks profil */}
          <div className="text-white space-y-6 lg:space-y-8 order-1 lg:order-2 text-center lg:text-left">
            <div className="space-y-3 lg:space-y-4">
              <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <p className="text-sm lg:text-base font-medium text-[#FFE8DB]">
                  Tentang Kami
                </p>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
                <span className="block">Himpunan Mahasiswa</span>
                <span className="block text-[#FFE8DB] mt-2">
                  Sistem Informasi
                </span>
              </h1>

              <p className="text-base lg:text-lg text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Organisasi kemahasiswaan yang bergerak dalam bidang Sistem
                Informasi di Universitas Nasional, berdedikasi untuk
                mengembangkan potensi akademik dan profesional mahasiswa.
              </p>
            </div>

            {/* Kartu statistik */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <p className="text-2xl lg:text-3xl font-bold text-[#FFE8DB]">
                  2020
                </p>
                <p className="text-xs lg:text-sm text-white/70 mt-1">
                  Tahun Berdiri
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <p className="text-2xl lg:text-3xl font-bold text-[#FFE8DB]">
                  100+
                </p>
                <p className="text-xs lg:text-sm text-white/70 mt-1">
                  Anggota Aktif
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Dekorasi gelombang bawah */}
      <div className="relative w-full">
        <svg viewBox="0 0 1200 120" className="w-full h-auto">
          <path
            d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
            fill="#FFE8DB"
          />
        </svg>
      </div>
    </main>
  );
}
