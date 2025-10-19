"use client";

import React, { useState } from "react";
import { Send, User, AtSign, Phone, Hash, FileText } from "lucide-react";

export default function ContactForm() {
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
  );
}