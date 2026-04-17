import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, MessageCircle, ArrowRight, Home } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pendaftaran Selesai | HIMASI UNAS',
  description: 'Terima kasih telah mendaftar kegiatan HIMASI UNAS',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/pendaftaran/selesai',
  },
}

export default function PendaftaranSelesaiPage() {
  // Link grup WhatsApp - ganti dengan link yang sesuai
  const whatsappGroupLink = "https://chat.whatsapp.com/Hjb6ns5SoGb5I7C1qlXaN2?mode=hqrc"
  
  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,#FFE8DB_70%,#E4C6BE_80%,#994555_85%,#732E39_90%,#4B061A_100%)] py-6 sm:py-12">
      <div className="container mx-auto mt-25 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Success Card */}
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-gray-200 shadow-2xl text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-green-100 rounded-full mb-4 sm:mb-6">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-green-600" />
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">
              🎉 Pendaftaran Berhasil!
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed px-2">
              Terima kasih telah mendaftar kegiatan HIMASI UNAS! <br className="hidden sm:block" />
              <span className="block sm:inline">Data Anda sudah tersimpan</span>
            </p>

            {/* Divider */}
            <div className="w-20 sm:w-24 h-1 bg-[#4B061A] mx-auto rounded-full mb-6 sm:mb-8"></div>

            {/* WhatsApp Group Info */}
            <div className="bg-linear-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg">
                  {/* WhatsApp Logo SVG */}
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 px-2">
                Bergabung dengan Grup WhatsApp
              </h2>
              
              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed px-2">
                Untuk mendapatkan informasi terbaru, update kegiatan, dan berinteraksi dengan peserta lainnya, 
                silakan bergabung dengan grup WhatsApp!
              </p>

              <a
                href={whatsappGroupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span className="truncate">Gabung Grup WhatsApp</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              </a>
            </div>

            {/* Important Notes */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 text-left">
              <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-3 sm:mb-4 flex items-center gap-2">
                <span className="text-xl sm:text-2xl">📌</span>
                <span>Informasi Penting</span>
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-green-600 font-bold shrink-0 mt-0.5">✓</span>
                  <span>Data pendaftaran Anda sudah tersimpan dengan aman</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-green-600 font-bold shrink-0 mt-0.5">✓</span>
                  <span>Tim HIMASI akan meninjau pendaftaran Anda</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-green-600 font-bold shrink-0 mt-0.5">✓</span>
                  <span>Bergabunglah dengan grup WhatsApp untuk mendapatkan update terbaru</span>
                </li>
              </ul>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-[#4B061A] hover:bg-[#5B0720] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                Kembali ke Beranda
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
              <p className="text-gray-600 text-xs sm:text-sm px-2">
                Ada pertanyaan? Hubungi kami di{' '}
                <a href="/hubungi-kami" className="text-[#4B061A] font-semibold hover:underline">
                  Halaman Hubungi Kami
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
