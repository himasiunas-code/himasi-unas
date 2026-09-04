'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  User,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle,
  X,
  Send,
  GraduationCap,
  Upload,
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface FormData {
  fullName: string
  phone: string
  npm: string
  yearClass: '2024' | '2025' | ''
}

interface FormErrors {
  [key: string]: string
}

interface ActivityStatus {
  id: string
  title: string
  registrationOpen: boolean
  registrationStartDate: string | null
  registrationDeadline: string | null
  currentParticipants: number
  maxParticipants: number | null
  count2024?: number
  count2025?: number
  maxParticipants2024?: number
  maxParticipants2025?: number
  remaining2024?: number
  remaining2025?: number
  isFull2024?: boolean
  isFull2025?: boolean
}

interface RegistrationFormProps {
  initialActivity?: ActivityStatus | any
}

// Helper untuk menghitung status pendaftaran dari data kegiatan secara instan
function computeRegistrationStatus(
  act: any
): 'loading' | 'open' | 'not-started' | 'closed' | 'full' | 'no-activity' {
  if (!act) return 'no-activity'
  const now = new Date()
  const eventStartTime = new Date(act.startDate).getTime()

  if (now.getTime() > eventStartTime) {
    return 'closed'
  }

  const isAllFull =
    act.isOverallFull ??
    ((act.isFull2024 && act.isFull2025) ||
      (act.maxParticipants && act.maxParticipants > 0 && act.currentParticipants >= act.maxParticipants))

  if (isAllFull) {
    return 'full'
  }

  const isAutoOpenTime = act.registrationStartDate
    ? now >= new Date(act.registrationStartDate)
    : true
  const isWithinDeadline = act.registrationDeadline
    ? now <= new Date(act.registrationDeadline)
    : true

  const isOpen = act.registrationOpen || (isAutoOpenTime && isWithinDeadline)

  if (!isOpen) {
    return !isAutoOpenTime ? 'not-started' : 'closed'
  }
  return 'open'
}

// Komponen formulir pendaftaran kegiatan HIMASI UNAS (1 Sesi ringkas)
export default function RegistrationForm({ initialActivity }: RegistrationFormProps = {}) {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    npm: '',
    yearClass: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [portalProof, setPortalProof] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State notifikasi pop-up
  const [showPopup, setShowPopup] = useState(false)
  const [popupType, setPopupType] = useState<'success' | 'error'>('success')
  const [popupTitle, setPopupTitle] = useState('')
  const [popupMessage, setPopupMessage] = useState('')

  // State status kegiatan (langsung dihitung dari initialActivity jika tersedia, 0ms loading)
  const [activityStatus, setActivityStatus] = useState<ActivityStatus | null>(
    initialActivity || null
  )
  const [registrationStatus, setRegistrationStatus] = useState<
    'loading' | 'open' | 'not-started' | 'closed' | 'full' | 'no-activity'
  >(() => {
    if (initialActivity) {
      return computeRegistrationStatus(initialActivity)
    }
    return 'loading'
  })
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Prefetch halaman selesai pendaftaran agar navigasi instan
  useEffect(() => {
    router.prefetch('/pendaftaran/selesai')
  }, [router])

  // Efek confetti selebrasi saat pendaftaran berhasil
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4B061A', '#8B1C3B', '#FFD700', '#FF6B6B', '#4ECDC4'],
      })
    } catch (err) {
      console.error('Confetti error:', err)
    }
  }

  // Tampilkan notifikasi pop-up
  const showNotification = (type: 'success' | 'error', title: string, message: string) => {
    setPopupType(type)
    setPopupTitle(title)
    setPopupMessage(message)
    setShowPopup(true)

    setTimeout(() => {
      setShowPopup(false)
    }, type === 'success' ? 4000 : 6000)
  }

  // Ambil dan pantau status kegiatan dari API secara berkala di latar belakang
  useEffect(() => {
    let isCancelled = false

    const checkActivityStatus = async () => {
      try {
        const response = await fetch('/api/activities/current', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        })
        const result = await response.json()

        if (isCancelled) return

        if (result.success && result.data) {
          const act = result.data
          setActivityStatus(act)
          setRegistrationStatus(computeRegistrationStatus(act))
        } else {
          setRegistrationStatus('no-activity')
        }
      } catch (err) {
        console.error('Gagal memeriksa status kegiatan:', err)
        if (!isCancelled && !activityStatus) setRegistrationStatus('no-activity')
      }
    }

    // Jalankan pengecekan langsung saat mount untuk memastikan data paling mutakhir
    checkActivityStatus()

    const interval = setInterval(checkActivityStatus, 15000)
    return () => {
      isCancelled = true
      clearInterval(interval)
    }
  }, [])

  // Hitung waktu mundur (countdown) jika pendaftaran belum dimulai
  useEffect(() => {
    if (registrationStatus !== 'not-started' || !activityStatus?.registrationStartDate) return

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const openTime = new Date(activityStatus.registrationStartDate!).getTime()
      const difference = openTime - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        window.location.reload()
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [registrationStatus, activityStatus])

  // Handle perubahan input form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Handle pemilihan berkas screenshot portal mahasiswa
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        portalProof: 'Format file harus berupa JPG, PNG, atau WEBP',
      }))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        portalProof: 'Ukuran file maksimal 5MB',
      }))
      return
    }

    setErrors((prev) => ({ ...prev, portalProof: '' }))
    setPortalProof(file)

    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Hapus berkas screenshot yang dipilih
  const removeFile = () => {
    setPortalProof(null)
    setPreviewUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Validasi form data sebelum dikirim
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap wajib diisi'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor WhatsApp / HP wajib diisi'
    } else if (!/^[\d\-\+\(\)\s]{8,20}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Format nomor WhatsApp / HP tidak valid'
    }

    if (!formData.npm.trim()) {
      newErrors.npm = 'NPM wajib diisi'
    } else if (!/^\d{6,16}$/.test(formData.npm.trim())) {
      newErrors.npm = 'NPM harus berupa digit angka yang valid'
    }

    if (!formData.yearClass) {
      newErrors.yearClass = 'Pilih salah satu tahun angkatan (2024 atau 2025)'
    }

    if (!portalProof) {
      newErrors.portalProof = 'Screenshot bukti portal mahasiswa wajib diupload'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle submit form pendaftaran
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Baca file screenshot portal mahasiswa sebagai base64 Data URL
      let studentPortalProofUrl = previewUrl
      if (!studentPortalProofUrl && portalProof) {
        studentPortalProofUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(portalProof)
        })
      }

      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          npm: formData.npm.trim(),
          yearClass: formData.yearClass,
          studentPortalProof: studentPortalProofUrl,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gagal mengirim pendaftaran')
      }

      // Simpan session pendaftaran selesai agar halaman selesai dapat diakses
      if (typeof window !== 'undefined') {
        const token = result.token || Math.random().toString(36).substring(2)
        // Pasang cookie di client juga sebagai jaminan instan untuk middleware/server
        document.cookie = `reg_success_token=${token}; path=/; max-age=60; SameSite=Lax`
        sessionStorage.setItem('registration_completed_token', token)
        sessionStorage.setItem(
          'registration_completed',
          JSON.stringify({
            fullName: formData.fullName.trim(),
            npm: formData.npm.trim(),
            yearClass: formData.yearClass,
            activityTitle: activityStatus?.title || 'Kegiatan HIMASI UNAS',
            timestamp: Date.now(),
          })
        )
      }

      // Notifikasi sukses dan selebrasi
      triggerConfetti()
      showNotification(
        'success',
        '🎉 Pendaftaran Berhasil!',
        'Data Anda telah berhasil terdaftar. Mengalihkan ke halaman selesai...'
      )

      // Redirect instan menggunakan router Next.js (cepat tanpa reload penuh browser)
      setTimeout(() => {
        router.push('/pendaftaran/selesai')
      }, 1000)
    } catch (error) {
      console.error('Error submitting registration:', error)
      const message =
        error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim pendaftaran'
      showNotification('error', '❌ Pendaftaran Gagal', message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Tampilan loading status
  if (registrationStatus === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] bg-white/95 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-2xl">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-[#4B061A] rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Memeriksa Status Pendaftaran</h2>
        <p className="text-gray-600">Mohon tunggu sebentar...</p>
      </div>
    )
  }

  // Tampilan belum ada kegiatan aktif
  if (registrationStatus === 'no-activity') {
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
          className="bg-linear-to-r from-[#4B061A] to-[#8B1C3B] text-white px-6 py-3 rounded-xl hover:from-[#5B0720] hover:to-[#9B2C4B] transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
        >
          Kembali ke Halaman Kegiatan
        </button>
      </div>
    )
  }

  // Tampilan belum dibuka
  if (registrationStatus === 'not-started') {
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
          className="bg-linear-to-r from-[#4B061A] to-[#8B1C3B] text-white px-6 py-3 rounded-xl font-medium shadow-lg"
        >
          Kembali ke Halaman Kegiatan
        </button>
      </div>
    )
  }

  // Tampilan ditutup
  if (registrationStatus === 'closed') {
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
          className="bg-linear-to-r from-[#4B061A] to-[#8B1C3B] text-white px-6 py-3 rounded-xl font-medium shadow-lg"
        >
          Lihat Kegiatan Lainnya
        </button>
      </div>
    )
  }

  // Tampilan kuota penuh
  if (registrationStatus === 'full') {
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
          className="bg-linear-to-r from-[#4B061A] to-[#8B1C3B] text-white px-6 py-3 rounded-xl font-medium shadow-lg"
        >
          Lihat Kegiatan Lainnya
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        suppressHydrationWarning
        className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 md:p-10 border border-gray-200 shadow-2xl space-y-6"
      >
        {/* Header formulir */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-[#4B061A] to-[#8B1C3B] rounded-full mb-4 shadow-lg text-white">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Formulir Pendaftaran</h2>
          <p className="text-gray-600 text-sm mt-1">
            Silakan lengkapi data Anda untuk mendaftar{' '}
            <span className="font-semibold text-[#4B061A]">
              {activityStatus?.title || 'Kegiatan HIMASI'}
            </span>
          </p>
        </div>

        {/* Input Nama Lengkap */}
        <div className="space-y-2">
          <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">
            <User className="w-4 h-4 inline mr-2 text-[#4B061A]" />
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Masukkan nama lengkap Anda"
            className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B061A] focus:border-[#4B061A] transition-all duration-200 shadow-xs"
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs flex items-center mt-1">
              <AlertCircle className="w-3.5 h-3.5 mr-1" />
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Input Nomor WhatsApp / HP */}
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
            <Phone className="w-4 h-4 inline mr-2 text-[#4B061A]" />
            Nomor WhatsApp / HP <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Contoh: 081234567890"
            className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B061A] focus:border-[#4B061A] transition-all duration-200 shadow-xs"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs flex items-center mt-1">
              <AlertCircle className="w-3.5 h-3.5 mr-1" />
              {errors.phone}
            </p>
          )}
        </div>

        {/* Input NPM */}
        <div className="space-y-2">
          <label htmlFor="npm" className="block text-sm font-semibold text-gray-700">
            <GraduationCap className="w-4 h-4 inline mr-2 text-[#4B061A]" />
            NPM (Nomor Pokok Mahasiswa) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="npm"
            name="npm"
            value={formData.npm}
            onChange={handleInputChange}
            placeholder="Contoh: 2431122001"
            className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B061A] focus:border-[#4B061A] transition-all duration-200 shadow-xs"
          />
          {errors.npm && (
            <p className="text-red-500 text-xs flex items-center mt-1">
              <AlertCircle className="w-3.5 h-3.5 mr-1" />
              {errors.npm}
            </p>
          )}
        </div>

        {/* Pilihan Tahun Angkatan (2024 atau 2025) */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            <Calendar className="w-4 h-4 inline mr-2 text-[#4B061A]" />
            Tahun Angkatan <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            {(['2024', '2025'] as const).map((year) => {
              const isSelected = formData.yearClass === year
              const isFull = year === '2024' ? activityStatus?.isFull2024 : activityStatus?.isFull2025
              const remaining = year === '2024'
                ? (activityStatus?.remaining2024 ?? 5)
                : (activityStatus?.remaining2025 ?? 5)
              const maxSlot = year === '2024'
                ? (activityStatus?.maxParticipants2024 ?? 5)
                : (activityStatus?.maxParticipants2025 ?? 5)

              return (
                <button
                  type="button"
                  key={year}
                  disabled={isFull}
                  onClick={() => {
                    if (isFull) return
                    setFormData((prev) => ({ ...prev, yearClass: year }))
                    if (errors.yearClass) {
                      setErrors((prev) => ({ ...prev, yearClass: '' }))
                    }
                  }}
                  className={`py-4 px-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                    isFull
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-75'
                      : isSelected
                      ? 'bg-linear-to-r from-[#4B061A] to-[#8B1C3B] text-white border-[#4B061A] shadow-md scale-[1.02] cursor-pointer'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isFull
                          ? 'border-gray-300 bg-gray-200'
                          : isSelected
                          ? 'border-white bg-white'
                          : 'border-gray-400'
                      }`}
                    >
                      {isSelected && !isFull && <div className="w-2.5 h-2.5 rounded-full bg-[#4B061A]" />}
                    </div>
                    <span className="font-bold text-base md:text-lg">Angkatan {year}</span>
                  </div>

                  {/* Indikator Kuota / Sisa Slot */}
                  <div>
                    {isFull ? (
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-red-100 text-red-700 border border-red-200">
                        Kuota Penuh (0/{maxSlot})
                      </span>
                    ) : (
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                          isSelected
                            ? 'bg-white/25 text-white'
                            : 'bg-green-100 text-green-800 border border-green-200'
                        }`}
                      >
                        Sisa {remaining} dari {maxSlot} slot
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
          {errors.yearClass && (
            <p className="text-red-500 text-xs flex items-center mt-1">
              <AlertCircle className="w-3.5 h-3.5 mr-1" />
              {errors.yearClass}
            </p>
          )}
        </div>

        {/* Upload Bukti Portal Mahasiswa */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            <Upload className="w-4 h-4 inline mr-2 text-[#4B061A]" />
            Screenshot Portal Mahasiswa UNAS <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 transition-all duration-200 hover:border-[#4B061A] bg-gray-50/60">
            {!previewUrl ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-3 shadow-xs border border-gray-200 text-[#4B061A]">
                  <Upload className="w-6 h-6" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="portalProof"
                />
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#4B061A] hover:bg-[#3A0514] text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-xs cursor-pointer"
                  >
                    Pilih Foto Screenshot Portal
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  Format: JPG, JPEG, PNG, atau WEBP (Maksimal 5MB)
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  Lampirkan tangkapan layar (SS) portal mahasiswa UNAS Anda
                </p>
              </div>
            ) : (
              <div className="relative max-w-xs mx-auto">
                <Image
                  src={previewUrl}
                  alt="Preview Screenshot Portal Mahasiswa"
                  width={300}
                  height={200}
                  className="w-full max-h-48 object-contain rounded-xl shadow-md border border-gray-200 bg-white"
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md transition-transform hover:scale-110 cursor-pointer"
                  title="Hapus foto"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="text-center mt-2">
                  <p className="text-xs text-green-700 font-medium flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 mr-1 text-green-600" />
                    {portalProof?.name || 'Screenshot berhasil dipilih'}
                  </p>
                </div>
              </div>
            )}
          </div>
          {errors.portalProof && (
            <p className="text-red-500 text-xs flex items-center mt-1">
              <AlertCircle className="w-3.5 h-3.5 mr-1" />
              {errors.portalProof}
            </p>
          )}
        </div>

        {/* Tombol Submit Pendaftaran */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-linear-to-r from-[#4B061A] to-[#8B1C3B] text-white py-4 rounded-xl font-bold text-lg hover:from-[#5B0720] hover:to-[#9B2C4B] transition-all duration-300 transform hover:scale-[1.01] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memproses Pendaftaran...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Daftar Sekarang</span>
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">
            Pastikan data yang Anda masukkan sudah benar sebelum mengklik Daftar Sekarang.
          </p>
        </div>
      </form>

      {/* Pop-up notifikasi status */}
      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          onClick={() => setShowPopup(false)}
        >
          <div
            className={`relative max-w-md w-full p-6 rounded-3xl shadow-2xl transform transition-all ${
              popupType === 'success'
                ? 'bg-linear-to-br from-green-50 to-emerald-50 border-2 border-green-200'
                : 'bg-linear-to-br from-red-50 to-rose-50 border-2 border-red-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowPopup(false)
                if (popupType === 'success') {
                  router.push('/pendaftaran/selesai')
                }
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center mb-4">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md ${
                  popupType === 'success' ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                {popupType === 'success' ? (
                  <CheckCircle className="w-8 h-8" />
                ) : (
                  <AlertCircle className="w-8 h-8" />
                )}
              </div>
            </div>

            <h3
              className={`text-xl font-bold text-center mb-2 ${
                popupType === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {popupTitle}
            </h3>

            <p
              className={`text-center text-sm mb-6 ${
                popupType === 'success' ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {popupMessage}
            </p>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowPopup(false)
                  if (popupType === 'success') {
                    router.push('/pendaftaran/selesai')
                  }
                }}
                className={`px-6 py-2.5 rounded-xl font-semibold text-white transition-all shadow-md cursor-pointer ${
                  popupType === 'success'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {popupType === 'success' ? 'Lanjut ke Halaman Selesai →' : 'Tutup'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}