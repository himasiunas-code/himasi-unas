"use client";

import { useEffect } from "react";
import Script from "next/script";

// Daftar URL postingan Instagram untuk ditampilkan
const INSTAGRAM_POSTS = [
  "https://www.instagram.com/p/DUONbjsknI2/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  "https://www.instagram.com/p/DS73qDAD4Lv/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  "https://www.instagram.com/p/DSqor77k_9p/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA==",
];

export default function HomeBerita() {
  // Memproses ulang embed Instagram jika library pihak ketiga sudah dimuat
  useEffect(() => {
    if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }
  }, []);

  return (
    <main className="bg-[#FFE8DB] py-10 md:py-16">
      {/* Judul Seksi Berita */}
      <div className="w-full max-w-6xl mx-auto px-4 flex justify-center items-center text-center">
        <h2 className="font-bold text-xl md:text-2xl lg:text-4xl xl:text-6xl uppercase text-[#4B061A] mb-10">
          BERITA
        </h2>
      </div>

      {/* Grid feed Instagram */}
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {INSTAGRAM_POSTS.map((url, index) => (
            <div key={index} className="flex justify-center">
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={url}
                data-instgrm-version="14"
                style={{
                  background: "#FFF",
                  border: "0",
                  borderRadius: "3px",
                  boxShadow:
                    "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
                  margin: "1px",
                  maxWidth: "540px",
                  minWidth: "326px",
                  padding: "0",
                  width: "99.375%",
                }}
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Lihat postingan ini di Instagram
                </a>
              </blockquote>
            </div>
          ))}
        </div>

        {/* Tombol tautan ke profil Instagram */}
        <div className="flex justify-center pb-10">
          <a
            href="https://www.instagram.com/himasi.unas1949?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#4B061A] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#6B1B2F] transition text-sm md:text-base lg:text-lg"
          >
            Lihat Lebih Banyak di Instagram
          </a>
        </div>
      </div>

      {/* Skrip widget embed Instagram */}
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          if ((window as any).instgrm) {
            (window as any).instgrm.Embeds.process();
          }
        }}
      />
    </main>
  );
}
