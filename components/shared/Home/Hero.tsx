"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Banner from "@/public/image/Home/BannerV1.png";
import Logo from "@/public/icon/HIMASI.png";

export default function Hero() {
  return (
    <main className="relative overflow-hidden min-h-screen">
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-[#4B061A] via-[#6B1B2F] to-[#8B2538]"></div>

      {/* Decorative Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-4 lg:left-10 w-20 h-20 lg:w-32 lg:h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 left-8 lg:left-20 w-32 h-32 lg:w-48 lg:h-48 bg-white/3 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-40 right-8 lg:right-32 w-16 h-16 lg:w-24 lg:h-24 bg-white/10 rounded-full blur-lg animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 lg:w-96 lg:h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-4 max-w-4xl xl:max-w-7xl py-8 lg:py-16 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-1 lg:gap-12 items-center w-full">
          {/* Left Content */}
          <div className="text-white space-y-6 lg:space-y-8 order-2 lg:order-1">
            <div className="space-y-3 lg:space-y-4 text-center lg:text-left">
              <h2 className="text-base md:text-lg lg:text-xl font-light text-white/80">
                Universitas Nasional
              </h2>
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                <span className="block">Himpunan Mahasiswa</span>
                <span className="block text-[#FFE8DB]">Sistem Informasi</span>
              </h1>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-2 lg:pt-4 justify-center lg:justify-start">
              <Link
                href="http://si.ftki.unas.ac.id/"
                className="group inline-flex items-center justify-center px-6 lg:px-8 py-3 lg:py-4 bg-white text-[#4B061A] font-semibold rounded-full hover:bg-white/90 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl text-sm lg:text-base"
              >
                <span className="mr-2">Jelajahi</span>
                <svg
                  className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                href="/hubungi-kami"
                className="group inline-flex items-center justify-center px-6 lg:px-8 py-3 lg:py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[#4B061A] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg text-sm lg:text-base"
              >
                <svg
                  className="w-4 h-4 lg:w-5 lg:h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>Hubungi Kami</span>
              </Link>
            </div>
          </div>

          {/* Right Content - Images */}
          <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative scale-75 sm:scale-90 lg:scale-100">
              {/* Main Image Circle */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 group">
                <div className="absolute inset-0 rounded-full border-3 lg:border-4 border-white/20 animate-pulse group-hover:border-white/40 transition-colors duration-500"></div>
                <div className="absolute inset-1 lg:inset-2 rounded-full overflow-hidden border-3 lg:border-4 border-white/30 shadow-xl lg:shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-105">
                  <Image
                    src={Banner}
                    alt="HIMASI UNAS Team"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-[#4B061A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>

              {/* Secondary Image Circle - Top Right */}
              <div
                className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 lg:-top-8 lg:-right-8 w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40"
                style={{
                  animation: "float 5s ease-in-out infinite",
                  animationDelay: "1s",
                }}
              >
                <div className="absolute inset-0 rounded-full border border-white/20 lg:border-2"></div>
                <div className="absolute inset-0.5 lg:inset-1 rounded-full overflow-hidden border border-white/40 lg:border-2 shadow-lg lg:shadow-xl">
                  <Image
                    src={Logo}
                    alt="HIMASI UNAS"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Floating Elements - Hidden on very small screens, smaller on mobile */}
              <div
                className="absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-6 w-12 h-12 lg:w-20 lg:h-20 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center"
                style={{ animation: "float 3s ease-in-out infinite" }}
              ></div>

              <div
                className="absolute top-8 -left-8 lg:top-12 lg:-left-12 w-10 h-10 lg:w-16 lg:h-16 bg-[#FFE8DB]/20 rounded-full backdrop-blur-sm flex items-center justify-center"
                style={{
                  animation: "float 4s ease-in-out infinite",
                  animationDelay: "0.5s",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="w-full h-auto">
          <path
            d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
            fill="rgba(75, 6, 26, 1)"
          />
        </svg>
      </div>
    </main>
  );
}
