import React from "react";
import Link from "next/link";
import { MapPin, Users, MessageCircle, Phone } from "lucide-react";

export default function LocationSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFE8DB] via-[#F5D5CC] to-[#E8C4B8] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 md:w-72 md:h-72 bg-gradient-to-br from-[#4B061A]/5 to-[#732E39]/10 rounded-full -translate-x-16 -translate-y-16 md:-translate-x-36 md:-translate-y-36"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 md:w-72 md:h-72 bg-gradient-to-br from-[#4B061A]/5 to-[#732E39]/10 rounded-full translate-x-16 translate-y-16 md:translate-x-36 md:translate-y-36"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#4B061A] to-[#732E39] rounded-2xl mb-6 shadow-xl">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4B061A] mb-4 bg-gradient-to-r from-[#4B061A] to-[#732E39] bg-clip-text">
            Lokasi Kami
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Temukan kami di kampus Universitas Nasional dan bergabunglah dalam
            kegiatan HIMASI
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Main Location Card */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border border-white/50 hover:border-[#4B061A]/20 relative overflow-hidden">
            {/* Card decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4B061A]/10 to-[#732E39]/20 rounded-full -mr-16 -mt-16"></div>

            <div className="relative z-10">
              <div className="flex items-start space-x-6 mb-6">
                <div className="p-4 bg-gradient-to-br from-[#4B061A] to-[#732E39] rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#4B061A] mb-2 group-hover:text-[#732E39] transition-colors duration-300">
                    Sekre SI
                  </h3>
                  <span className="inline-block px-3 py-1 bg-[#4B061A]/10 text-[#4B061A] text-sm font-medium rounded-full">
                    Pusat Informasi
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[#4B061A] rounded-full mr-3"></div>
                  <span className="font-medium">Blok D, Lantai 2</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[#4B061A] rounded-full mr-3"></div>
                  <span className="font-medium">
                    Fakultas Teknologi Komunikasi dan Informatika
                  </span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[#4B061A] rounded-full mr-3"></div>
                  <span>Universitas Nasional</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[#4B061A] rounded-full mr-3"></div>
                  <span>Jl. Sawo Manila No.61, RT.14/RW.7</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[#4B061A] rounded-full mr-3"></div>
                  <span>Pejaten Bar., Ps. Minggu, Kota Jakarta Selatan</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[#4B061A] rounded-full mr-3"></div>
                  <span>Daerah Khusus Ibukota Jakarta 12520</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="https://www.google.com/maps/place/Universitas+Nasional/@-6.2804075,106.8359362,17z/data=!4m15!1m8!3m7!1s0x2e69f21500ac062f:0xd8ee8cebb3cad135!2sJl.+Sawo+Manila+No.61,+RT.9%2FRW.10,+Pejaten+Timur,+Jakarta+Selatan,+DKI+Jakarta,+Daerah+Khusus+Ibukota+Jakarta+12520!3b1!8m2!3d-6.2804075!4d106.8385111!16s%2Fg%2F11vspcmnbw!3m5!1s0x2e69f211176e9827:0xb4bc144c3140a2d9!8m2!3d-6.2807919!4d106.8394182!16s%2Fm%2F0hzqph9?entry=ttu&g_ep=EgoyMDI1MTAwNi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#4B061A] to-[#732E39] hover:from-[#732E39] hover:to-[#994555] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Buka di Maps
                </Link>
                <button className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-white/50 hover:bg-white/80 text-[#4B061A] font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-[#4B061A]/20 hover:border-[#4B061A]/40">
                  <Phone className="w-5 h-5 mr-2" />
                  Hubungi
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="space-y-6">
            {/* Operating Hours */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-[#4B061A] ml-4">
                  Jam Operasional
                </h4>
              </div>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Senin - Jumat</span>
                  <span className="font-medium">08:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sabtu</span>
                  <span className="font-medium">08:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Minggu</span>
                  <span className="font-medium text-red-500">Tutup</span>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-[#4B061A] ml-4">
                  Info Cepat
                </h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Konsultasi akademik</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Kebutuhan administrasi</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Informasi terbaru</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}