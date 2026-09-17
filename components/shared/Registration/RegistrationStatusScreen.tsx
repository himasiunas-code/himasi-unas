import { AlertCircle, Calendar, X } from 'lucide-react'
import { ActivityStatus, RegistrationStatus, TimeLeft } from './types'

interface RegistrationStatusScreenProps {
  status: RegistrationStatus
  activityStatus: ActivityStatus | null
  timeLeft: TimeLeft
}

export default function RegistrationStatusScreen({
  status,
  activityStatus,
  timeLeft,
}: RegistrationStatusScreenProps) {
  // Tampilan loading status
  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] bg-white/95 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-2xl">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-[#4B061A] rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Memeriksa Status Pendaftaran</h2>
        <p className="text-gray-600">Mohon tunggu sebentar...</p>
      </div>
    )
  }

  // Tampilan belum ada kegiatan aktif
  if (status === 'no-activity') {
    return (
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-2xl text-center max-w-xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Tidak Ada Kegiatan Aktif</h2>
        <p className="text-gray-600 mb-6">
          Saat ini belum ada kegiatan yang tersedia untuk pendaftaran.
        </p>
        <button
          onClick={() => (window.location.href = '/kegiatan')}
          className="bg-linear-to-r from-[#4B061A] to-[#8B1C3B] text-white px-6 py-3 rounded-xl hover:from-[#5B0720] hover:to-[#9B2C4B] transition-all duration-300 transform hover:scale-105 font-medium shadow-lg cursor-pointer"
        >
          Kembali ke Halaman Kegiatan
        </button>
      </div>
    )
  }

  // Tampilan belum dibuka
  if (status === 'not-started') {
    return (
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-2xl text-center max-w-xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
          <Calendar className="w-8 h-8 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pendaftaran Belum Dibuka</h2>
        <p className="text-gray-600 mb-6">
          Pendaftaran untuk <strong>{activityStatus?.title}</strong> akan segera dibuka.
        </p>
        {(timeLeft.days > 0 ||
          timeLeft.hours > 0 ||
          timeLeft.minutes > 0 ||
          timeLeft.seconds > 0) && (
          <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto mb-6">
            {[
              { label: 'Hari', val: timeLeft.days },
              { label: 'Jam', val: timeLeft.hours },
              { label: 'Menit', val: timeLeft.minutes },
              { label: 'Detik', val: timeLeft.seconds },
            ].map((t, i) => (
              <div key={i} className="bg-gray-100 rounded-xl p-3 text-center">
                <span className="text-xl font-bold text-[#4B061A]">{t.val}</span>
                <p className="text-xs text-gray-500">{t.label}</p>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => (window.location.href = '/kegiatan')}
          className="bg-linear-to-r from-[#4B061A] to-[#8B1C3B] text-white px-6 py-3 rounded-xl font-medium shadow-lg cursor-pointer"
        >
          Kembali ke Halaman Kegiatan
        </button>
      </div>
    )
  }

  // Tampilan ditutup
  if (status === 'closed') {
    return (
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-2xl text-center max-w-xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <X className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pendaftaran Ditutup</h2>
        <p className="text-gray-600 mb-6">
          Pendaftaran untuk kegiatan <strong>{activityStatus?.title}</strong> telah berakhir.
        </p>
        <button
          onClick={() => (window.location.href = '/kegiatan')}
          className="bg-linear-to-r from-[#4B061A] to-[#8B1C3B] text-white px-6 py-3 rounded-xl font-medium shadow-lg cursor-pointer"
        >
          Lihat Kegiatan Lainnya
        </button>
      </div>
    )
  }

  // Tampilan kuota penuh
  if (status === 'full') {
    return (
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-2xl text-center max-w-xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Kuota Pendaftaran Penuh</h2>
        <p className="text-gray-600 mb-6">
          Maaf, kuota untuk kegiatan <strong>{activityStatus?.title}</strong> sudah habis.
        </p>
        <button
          onClick={() => (window.location.href = '/kegiatan')}
          className="bg-linear-to-r from-[#4B061A] to-[#8B1C3B] text-white px-6 py-3 rounded-xl font-medium shadow-lg cursor-pointer"
        >
          Lihat Kegiatan Lainnya
        </button>
      </div>
    )
  }

  return null
}
