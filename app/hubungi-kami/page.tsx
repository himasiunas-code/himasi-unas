"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Instagram,
  Users,
  Send,
  User,
  AtSign,
  Hash,
  FileText,
} from "lucide-react";
import Banner from "@/public/image/Hubungi/BannerV1.png";

export default function HubungiKamiPage() {
  const [formData, setFormData] = useState({
    namaLengkap: "",
    email: "",
    nomorTelepon: "",
    subjek: "",
    isiPesan: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({
          namaLengkap: "",
          email: "",
          nomorTelepon: "",
          subjek: "",
          isiPesan: "",
        });
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        throw new Error("Gagal mengirim pesan");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-[#FFE8DB]">
      {/* Banner Section with 16:9 aspect ratio */}
      <section className="relative w-full">
        <div className="aspect-video w-full overflow-hidden">
          <Image
            src={Banner}
            alt="Hubungi Kami - HIMASI UNAS"
            fill
            className="object-cover"
            priority
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-[#4B061A]/60 flex items-center justify-center p-2 sm:p-4">
            <div className="text-center text-white w-full max-w-4xl px-2">
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-4 drop-shadow-lg leading-tight">
                Hubungi Kami
              </h1>
              <p className="text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-8 drop-shadow-md leading-relaxed">
                Jangan ragu untuk menghubungi HIMASI UNAS. Kami siap membantu
                dan mendengar dari Anda!
              </p>
            </div>
          </div>

          {/* Bottom Gradient Transition */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-[linear-gradient(to_bottom,transparent_20%,#FFE8DB_70%)]"></div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
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
                    <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
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
                  href="https://wa.me/qr/4AZXPQ4P7H4CG1"
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
                    <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
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
                  href="https://wa.me/qr/4AZXPQ4P7H4CG1"
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
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
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
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Follow Kami
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFE8DB] via-[#F5D5CC] to-[#E8C4B8] relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 md:w-72 md:h-72 bg-gradient-to-br from-[#4B061A]/5 to-[#732E39]/10 rounded-full -translate-x-16 -translate-y-16 md:-translate-x-36 md:-translate-y-36"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 md:w-72 md:h-72 bg-gradient-to-br from-[#4B061A]/5 to-[#732E39]/10 rounded-full translate-x-16 translate-y-16 md:translate-x-36 md:translate-y-36"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#4B061A] to-[#732E39] rounded-2xl mb-6 shadow-xl">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4B061A] mb-4 bg-gradient-to-r from-[#4B061A] to-[#732E39] bg-clip-text text-transparent">
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
                    <span>Konsultasi akademik tersedia</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>Ruang meeting dapat dipinjam</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span>Event bulanan setiap Sabtu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#4B061A] via-[#732E39] to-[#994555] relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-48 h-48 md:w-96 md:h-96 bg-gradient-to-br from-white/5 to-white/10 rounded-full -translate-x-24 -translate-y-24 md:-translate-x-48 md:-translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-36 h-36 md:w-72 md:h-72 bg-gradient-to-tl from-white/5 to-white/10 rounded-full translate-x-18 translate-y-18 md:translate-x-36 md:translate-y-36"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 shadow-xl">
              <Send className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Kirim Pesan Cepat
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Punya pertanyaan atau ingin bergabung? Kirim pesan kepada kami dan
              kami akan merespons sesegera mungkin
            </p>
          </div>

          {/* Success Message */}
          {isSuccess && (
            <div className="mb-8 p-4 bg-green-500/20 border border-green-500/30 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center text-green-100">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="font-medium">
                  Pesan berhasil dikirim! Kami akan segera merespons.
                </span>
              </div>
            </div>
          )}

          {/* Map & Contact Form Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
              {/* Left Side - Google Map */}
              <div className="h-full">
                {/* Embedded Google Map */}
                <div className="relative w-full h-full hidden lg:block rounded-2xl overflow-hidden shadow-xl">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.7048089553543!2d106.83593617496636!3d-6.280407562874747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f211176e9827%3A0xb4bc144c3140a2d9!2sUniversitas%20Nasional!5e0!3m2!1sen!2sid!4v1728466800000!5m2!1sen!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-2xl"
                  ></iframe>
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div className="space-y-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Kirimkan Pesan Anda!
                  </h3>
                  <p className="text-white/80 text-sm">
                    Hubungi kami untuk informasi lebih lanjut tentang HIMASI
                    UNAS
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Nama Lengkap */}
                    <div className="space-y-2">
                      <label
                        htmlFor="namaLengkap"
                        className="flex items-center text-white font-medium"
                      >
                        <User className="w-5 h-5 mr-2" />
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        id="namaLengkap"
                        name="namaLengkap"
                        value={formData.namaLengkap}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
                        placeholder="Masukkan nama lengkap Anda"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="flex items-center text-white font-medium"
                      >
                        <AtSign className="w-5 h-5 mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
                        placeholder="nama@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Nomor Telepon */}
                    <div className="space-y-2">
                      <label
                        htmlFor="nomorTelepon"
                        className="flex items-center text-white font-medium"
                      >
                        <Phone className="w-5 h-5 mr-2" />
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        id="nomorTelepon"
                        name="nomorTelepon"
                        value={formData.nomorTelepon}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
                        placeholder="628xxxxxxxxx"
                      />
                    </div>

                    {/* Subjek */}
                    <div className="space-y-2">
                      <label
                        htmlFor="subjek"
                        className="flex items-center text-white font-medium"
                      >
                        <Hash className="w-5 h-5 mr-2" />
                        Subjek
                      </label>
                      <input
                        type="text"
                        id="subjek"
                        name="subjek"
                        value={formData.subjek}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
                        placeholder="Topik pesan Anda"
                      />
                    </div>
                  </div>

                  {/* Isi Pesan */}
                  <div className="space-y-2">
                    <label
                      htmlFor="isiPesan"
                      className="flex items-center text-white font-medium"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      Isi Pesan
                    </label>
                    <textarea
                      id="isiPesan"
                      name="isiPesan"
                      value={formData.isiPesan}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 resize-none"
                      placeholder="Tulis pesan Anda di sini..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-white/90 text-[#4B061A] font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-[#4B061A]/30 border-t-[#4B061A] rounded-full animate-spin mr-2"></div>
                          Mengirim Pesan...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Kirim Pesan
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Additional Contact Info - Centered */}
          <div className="mt-12 text-center">
          </div>
        </div>
      </section>
    </main>
  );
}
