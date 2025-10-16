import React from "react";
import Link from "next/link";
import { Mail, Instagram } from "lucide-react";

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.484 3.488"/>
  </svg>
);

export default function ContactCards() {
  return (
    <section className="bg-[#FFE8DB] py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#4B061A] mb-3 sm:mb-4">
            Informasi Kontak
          </h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto px-2">
            Berbagai cara untuk terhubung dengan HIMASI UNAS
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* WhatsApp 1 */}
          <div className="group bg-gradient-to-br from-white via-white to-emerald-50 rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-green-100 hover:border-green-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-3 sm:p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <WhatsAppIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="ml-2 sm:ml-4">
                  <h3 className="text-xs sm:text-xl font-bold text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                    WhatsApp
                  </h3>
                  <span className="text-sm sm:text-sm text-green-600 font-medium">
                    Leysa
                  </span>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Chat dengan bersangkutan
              </p>
              <Link
                href="https://wa.me/628569874380?text=Halo,%20saya%20ingin%20bertanya%20tentang%20HIMASI%20UNAS"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Chat Sekarang
              </Link>
            </div>
          </div>

          {/* WhatsApp 2 */}
          <div className="group bg-gradient-to-br from-white via-white to-emerald-50 rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-emerald-100 hover:border-emerald-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-3 sm:p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <WhatsAppIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="ml-2 sm:ml-4">
                  <h3 className="text-xs sm:text-xl font-bold text-gray-800 group-hover:text-emerald-700 transition-colors duration-300">
                    WhatsApp
                  </h3>
                  <span className="text-sm sm:text-sm text-emerald-600 font-medium">
                    Evan
                  </span>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Chat dengan bersangkutan
              </p>
              <Link
                href="https://wa.me/6281333105219?text=Halo,%20saya%20ingin%20bertanya%20tentang%20HIMASI%20UNAS"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Chat Sekarang
              </Link>
            </div>
          </div>

          {/* Email */}
          <div className="group bg-gradient-to-br from-white via-white to-blue-50 rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-blue-100 hover:border-blue-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Mail className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="ml-2 sm:ml-4">
                  <h3 className="text-xs sm:text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                    Email
                  </h3>
                  <span className="text-sm sm:text-sm text-blue-600 font-medium">
                    Resmi
                  </span>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Kirim pesan formal
              </p>
              <Link
                href="mailto:himasiunas@gmail.com"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Kirim Email
              </Link>
            </div>
          </div>

          {/* Instagram */}
          <div className="group bg-gradient-to-br from-white via-white to-pink-50 rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-pink-100 hover:border-pink-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-500/10 to-pink-600/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Instagram className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="ml-2 sm:ml-4">
                  <h3 className="text-xs sm:text-xl font-bold text-gray-800 group-hover:text-pink-700 transition-colors duration-300">
                    Instagram
                  </h3>
                  <span className="text-sm sm:text-sm text-pink-600 font-medium">
                    Sosmed
                  </span>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Follow aktivitas kami
              </p>
              <Link
                href="https://www.instagram.com/himasi.unas1949/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Follow Kami
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}