import RegistrationForm from '@/components/shared/Registration/RegistrationForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pendaftaran Kegiatan | HIMASI UNAS',
  description: 'Daftar untuk mengikuti kegiatan HIMASI UNAS',
  alternates: {
    canonical: '/pendaftaran',
  },
}

export default function PendaftaranPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,#FFE8DB_70%,#E4C6BE_80%,#994555_85%,#732E39_90%,#4B061A_100%)]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mt-20 mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4B061A] mb-4">
            Pendaftaran Kegiatan HIMASI
          </h1>
          <div className="w-24 md:w-32 h-1 bg-[#4B061A] mx-auto rounded-full mb-4"></div>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Isi form di bawah ini dengan lengkap dan benar untuk mendaftar kegiatan HIMASI.
            Pastikan semua data yang dimasukkan valid.
          </p>
        </div>

        {/* Registration Form */}
        <RegistrationForm />
      </div>
    </div>
  )
}