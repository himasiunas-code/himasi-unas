'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  User,
  Phone,
  AlertCircle,
  Send,
  GraduationCap,
} from 'lucide-react'
import {
  FormData,
  FormErrors,
  ActivityStatus,
  RegistrationStatus,
  RegistrationFormProps,
} from './types'
import { computeRegistrationStatus, triggerConfetti } from './utils'
import { useCountdown } from '@/hooks'
import RegistrationStatusScreen from './RegistrationStatusScreen'
import RegistrationYearClassSelector from './RegistrationYearClassSelector'
import RegistrationPortalProofUpload from './RegistrationPortalProofUpload'
import RegistrationNotificationModal from './RegistrationNotificationModal'

// Komponen formulir pendaftaran kegiatan HIMASI UNAS (Modular & Ringkas)
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
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus>(() => {
    if (initialActivity) {
      return computeRegistrationStatus(initialActivity)
    }
    return 'loading'
  })
  const targetStartDate =
    registrationStatus === 'not-started' ? activityStatus?.registrationStartDate : null
  const timeLeft = useCountdown(targetStartDate, () => {
    window.location.reload()
  })

  // Prefetch halaman selesai pendaftaran agar navigasi instan
  useEffect(() => {
    router.prefetch('/pendaftaran/selesai')
  }, [router])

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

  // Tampilkan layar status jika belum masuk ke kondisi form aktif
  if (registrationStatus !== 'open') {
    return (
      <RegistrationStatusScreen
        status={registrationStatus}
        activityStatus={activityStatus}
        timeLeft={timeLeft}
      />
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
        <RegistrationYearClassSelector
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          activityStatus={activityStatus}
        />

        {/* Upload Bukti Portal Mahasiswa */}
        <RegistrationPortalProofUpload
          previewUrl={previewUrl}
          portalProof={portalProof}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          removeFile={removeFile}
          errors={errors}
        />

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
      <RegistrationNotificationModal
        show={showPopup}
        onClose={() => setShowPopup(false)}
        type={popupType}
        title={popupTitle}
        message={popupMessage}
      />
    </div>
  )
}