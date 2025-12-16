'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Upload, User, Mail, Phone, Calendar, Building, FileImage, Instagram, MessageSquare, AlertCircle, CheckCircle, X /*, CreditCard, Smartphone */ } from 'lucide-react'
import confetti from 'canvas-confetti'
import imageCompression from 'browser-image-compression'

interface FormData {
  email: string
  fullName: string
  phone: string
  npm: string
  academicStatus: string
  // yearClass: string
  institution: string
  faculty: string
  major: string
  instagramHandle: string
  // paymentMethod: string
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
  computedRegistrationOpen: boolean
  registrationStatus: {
    isAutoOpenTime: boolean
    isWithinDeadline: boolean
    manuallyOpen: boolean
    finalStatus: boolean
  }
}

export default function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1)
  const [registrationId, setRegistrationId] = useState<string | null>(null)
  const [step1Completed, setStep1Completed] = useState(false)
  const [hasIncompleteRegistration, setHasIncompleteRegistration] = useState(false)
  const [showResumePrompt, setShowResumePrompt] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    fullName: '',
    phone: '',
    npm: '',
    academicStatus: '',
    // yearClass: '',
    institution: '',
    faculty: '',
    major: '',
    instagramHandle: ''
    // paymentMethod: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [instagramProof, setInstagramProof] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  // const [paymentProof, setPaymentProof] = useState<File | null>(null)
  // const [paymentPreviewUrl, setPaymentPreviewUrl] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Pop-up notification states
  const [showPopup, setShowPopup] = useState(false)
  const [popupType, setPopupType] = useState<'success' | 'error'>('success')
  const [popupTitle, setPopupTitle] = useState('')
  const [popupMessage, setPopupMessage] = useState('')
  const [activityStatus, setActivityStatus] = useState<ActivityStatus | null>(null)
  const [registrationStatus, setRegistrationStatus] = useState<'loading' | 'open' | 'not-started' | 'closed' | 'full' | 'no-activity'>('loading')
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  // const paymentFileInputRef = useRef<HTMLInputElement>(null)

  // Party popper confetti effect
  const triggerConfetti = () => {
    if (typeof window === 'undefined') {
      console.log('Window not available, skipping confetti')
      return
    }
    
    console.log('Triggering confetti animation...') // Debug log
    
    try {
      // Multiple bursts with different timings for celebration effect
      const duration = 3000
      const animationEnd = Date.now() + duration
      const defaults = { 
        startVelocity: 30, 
        spread: 360, 
        ticks: 60, 
        zIndex: 9999,
        disableForReducedMotion: false
      }

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min
      }

      // Simple test burst first
      console.log('Firing simple confetti burst...')
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1']
      })
      console.log('Simple confetti burst fired!')
      
      // Additional bursts
      console.log('Firing center confetti burst...')
      confetti({
        ...defaults,
        particleCount: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#4B061A', '#8B1C3B', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1']
      })
      console.log('Center confetti burst fired!')

    // Second burst - left side
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 50,
        origin: { x: 0.2, y: 0.6 },
        colors: ['#4B061A', '#8B1C3B', '#FFD700', '#FF6B6B']
      })
    }, 200)

    // Third burst - right side
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 50,
        origin: { x: 0.8, y: 0.6 },
        colors: ['#4B061A', '#8B1C3B', '#FFD700', '#4ECDC4']
      })
    }, 400)

    // Continuous small bursts
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }

      const particleCount = 20 * (timeLeft / duration)
      
      confetti({
        ...defaults,
        particleCount,
        origin: { 
          x: randomInRange(0.1, 0.9), 
          y: randomInRange(0.2, 0.8) 
        },
        colors: ['#4B061A', '#8B1C3B', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1']
      })
    }, 250)

    // Special golden shower effect
    setTimeout(() => {
      confetti({
        particleCount: 200,
        angle: 90,
        spread: 45,
        origin: { x: 0.5, y: 0 },
        colors: ['#FFD700', '#FFA500', '#FF8C00'],
        shapes: ['star', 'circle'],
        scalar: 1.2,
        drift: 1,
        gravity: 0.8,
        ticks: 100
      })
    }, 800)
    } catch (error) {
      console.error('Error triggering confetti:', error)
    }
  }

  // Show pop-up notification
  const showNotification = (type: 'success' | 'error', title: string, message: string) => {
    setPopupType(type)
    setPopupTitle(title)
    setPopupMessage(message)
    setShowPopup(true)
    
    // Auto-hide after 5 seconds for success, 7 seconds for error
    setTimeout(() => {
      setShowPopup(false)
    }, type === 'success' ? 5000 : 7000)
  }

  // Close pop-up notification
  const closeNotification = () => {
    setShowPopup(false)
  }

  // Compress data untuk localStorage (remove empty/default values)
  const compressFormData = (data: FormData) => {
    const compressed: Partial<FormData> = {}
    Object.entries(data).forEach(([key, value]) => {
      if (value && value !== '') {
        compressed[key as keyof FormData] = value
      }
    })
    return compressed
  }

  // Save registration state to localStorage (optimized)
  const saveStateToLocalStorage = () => {
    try {
      // Only save essential data untuk network efficiency
      const registrationState = {
        s: currentStep, // Shortened keys untuk mengurangi size
        r: registrationId,
        c: step1Completed,
        d: compressFormData(formData), // Compressed data
        t: Date.now() // Timestamp as number (lebih kecil dari ISO string)
      }
      const serialized = JSON.stringify(registrationState)
      
      // Check size before saving
      const sizeKB = new Blob([serialized]).size / 1024
      if (sizeKB > 100) {
        console.warn('⚠️ State size too large:', sizeKB.toFixed(2), 'KB')
      }
      
      localStorage.setItem('himasi_registration_state', serialized)
      console.log('✅ State saved:', sizeKB.toFixed(2), 'KB')
    } catch (error) {
      console.error('Failed to save state to localStorage:', error)
    }
  }

  // Load registration state from localStorage (with decompression)
  const loadStateFromLocalStorage = () => {
    try {
      const savedState = localStorage.getItem('himasi_registration_state')
      if (savedState) {
        const state = JSON.parse(savedState)
        
        // Handle both old and new format (backward compatibility)
        const isCompressed = 's' in state && 'r' in state
        
        if (isCompressed) {
          // New compressed format
          const savedTime = state.t
          const now = Date.now()
          const hoursDiff = (now - savedTime) / (1000 * 60 * 60)
          
          if (hoursDiff < 24 && state.c && state.r) {
            console.log('🔄 Found incomplete registration (compressed)')
            // Decompress back to original format
            return {
              currentStep: state.s,
              registrationId: state.r,
              step1Completed: state.c,
              formData: state.d,
              timestamp: new Date(state.t).toISOString()
            }
          } else if (hoursDiff >= 24) {
            console.log('⏰ Saved state expired (>24 hours), clearing...')
            localStorage.removeItem('himasi_registration_state')
          }
        } else {
          // Old uncompressed format (fallback)
          const savedTime = new Date(state.timestamp).getTime()
          const now = new Date().getTime()
          const hoursDiff = (now - savedTime) / (1000 * 60 * 60)
          
          if (hoursDiff < 24 && state.step1Completed && state.registrationId) {
            console.log('🔄 Found incomplete registration (legacy)')
            return state
          } else if (hoursDiff >= 24) {
            localStorage.removeItem('himasi_registration_state')
          }
        }
      }
      return null
    } catch (error) {
      console.error('Failed to load state from localStorage:', error)
      return null
    }
  }

  // Clear registration state from localStorage
  const clearStateFromLocalStorage = () => {
    try {
      localStorage.removeItem('himasi_registration_state')
      console.log('🗑️ State cleared from localStorage')
    } catch (error) {
      console.error('Failed to clear state from localStorage:', error)
    }
  }

  // Resume incomplete registration
  const resumeRegistration = (savedState: any) => {
    setCurrentStep(savedState.currentStep)
    setRegistrationId(savedState.registrationId)
    setStep1Completed(savedState.step1Completed)
    setFormData(savedState.formData)
    setShowResumePrompt(false)
    showNotification('success', '🔄 Pendaftaran Dilanjutkan', 'Anda dapat melanjutkan pendaftaran dari langkah terakhir')
  }

  // Start new registration (clear saved state)
  const startNewRegistration = () => {
    clearStateFromLocalStorage()
    setShowResumePrompt(false)
    setHasIncompleteRegistration(false)
    showNotification('success', '✨ Pendaftaran Baru Dimulai', 'Silakan isi formulir dari awal')
  }

  // Load saved state on component mount
  useEffect(() => {
    const savedState = loadStateFromLocalStorage()
    if (savedState) {
      setHasIncompleteRegistration(true)
      setShowResumePrompt(true)
    }
  }, [])

  // Save state whenever it changes (with debounce untuk efisiensi)
  useEffect(() => {
    if (step1Completed && registrationId) {
      // Debounce save - tunggu 500ms setelah perubahan terakhir
      const debounceTimer = setTimeout(() => {
        saveStateToLocalStorage()
      }, 500)
      
      return () => clearTimeout(debounceTimer)
    }
  }, [currentStep, registrationId, step1Completed, formData])

  // Cache untuk activity status (mengurangi redundant API calls)
  const activityCacheRef = useRef<{ data: ActivityStatus | null; timestamp: number } | null>(null)
  
  // Check activity status and determine registration availability
  useEffect(() => {
    let isCancelled = false // Prevent race condition
    
    const checkActivityStatus = async () => {
      try {
        // Check cache first (cache selama 30 detik)
        const now = Date.now()
        if (activityCacheRef.current && (now - activityCacheRef.current.timestamp) < 30000) {
          console.log('📦 Using cached activity status')
          const cachedData = activityCacheRef.current.data
          if (cachedData && !isCancelled) {
            setActivityStatus(cachedData)
            // Process status dari cache...
            return
          }
        }
        
        const response = await fetch('/api/activities/current', {
          // Add cache control headers
          headers: {
            'Cache-Control': 'max-age=30'
          }
        })
        const result = await response.json()
        
        if (isCancelled) return // Don't update if component unmounted
        if (result.success && result.data) {
          // Update cache
          activityCacheRef.current = {
            data: result.data,
            timestamp: Date.now()
          }
          
          setActivityStatus(result.data)
          console.log('🔍 Activity Status Check:', result.data.registrationStatus)
          
          // Determine registration status
          const activity = result.data
          const now = new Date()
          
          // Check if activity has started (event date passed)
          const eventStartTime = new Date(activity.startDate).getTime()
          if (now.getTime() > eventStartTime) {
            setRegistrationStatus('closed')
            return
          }
          
          // Check if registration is full
          // EXCEPTION: Jika user sudah di Step 2 (punya registrationId dan step1Completed), 
          // mereka boleh menyelesaikan pendaftaran meskipun slot penuh
          if (activity.maxParticipants && activity.currentParticipants >= activity.maxParticipants) {
            // Jika user sudah berhasil Step 1, biarkan mereka menyelesaikan Step 2
            if (!(registrationId && step1Completed)) {
              setRegistrationStatus('full')
              return
            }
          }
          
          // Check auto-open time and deadline
          const isAutoOpenTime = activity.registrationStartDate ? now >= new Date(activity.registrationStartDate) : true
          const isWithinDeadline = activity.registrationDeadline ? now <= new Date(activity.registrationDeadline) : true
          
          // Registration is open if manually opened OR auto-open time has arrived (and within deadline)
          const isRegistrationOpen = activity.registrationOpen || (isAutoOpenTime && isWithinDeadline)
          
          if (!isRegistrationOpen) {
            if (!isAutoOpenTime) {
              setRegistrationStatus('not-started')
            } else {
              setRegistrationStatus('closed')
            }
          } else {
            setRegistrationStatus('open')
          }
        } else {
          setRegistrationStatus('no-activity')
        }
      } catch (error) {
        console.error('Failed to check activity status:', error)
        setRegistrationStatus('no-activity')
      }
    }
    
    checkActivityStatus()
    
    // Check every 60 seconds for status updates (dikurangi dari 30 detik untuk hemat bandwidth)
    const interval = setInterval(checkActivityStatus, 60000)
    return () => {
      clearInterval(interval)
      isCancelled = true // Cancel any pending updates
    }
  }, [registrationId, step1Completed])

  // Calculate countdown timer for registration start
  useEffect(() => {
    if (registrationStatus !== 'not-started' || !activityStatus?.registrationStartDate) return

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const openTime = new Date(activityStatus.registrationStartDate!).getTime()
      const difference = openTime - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        // Recheck status when countdown reaches zero
        window.location.reload()
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [registrationStatus, activityStatus])

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Handle file upload with automatic compression
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, instagramProof: 'File harus berformat JPG, JPEG, PNG, atau WEBP' }))
      return
    }

    // Validate file size (max 1MB before compression)
    const maxSize = 1024 * 1024
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, instagramProof: 'Ukuran file maksimal 1MB. Silakan pilih gambar yang lebih kecil.' }))
      return
    }

    // Clear any previous errors
    setErrors(prev => ({ ...prev, instagramProof: '' }))
    
    try {
      // Show compression progress
      setErrors(prev => ({ ...prev, instagramProof: 'Mengompres gambar...' }))
      
      // Compression options - compress further for database efficiency
      const options = {
        maxSizeMB: 0.5, // Target 500KB after compression (from max 1MB input)
        maxWidthOrHeight: 1920, // Max resolution
        useWebWorker: true,
        fileType: 'image/jpeg' as const // Convert to JPEG for better compression
      }
      
      // Compress the image
      const compressedFile = await imageCompression(file, options)
      
      // Log compression result
      console.log('📤 Original file size:', (file.size / 1024).toFixed(2), 'KB')
      console.log('📦 Compressed file size:', (compressedFile.size / 1024).toFixed(2), 'KB')
      console.log('💾 Space saved:', ((1 - compressedFile.size / file.size) * 100).toFixed(1), '%')
      
      // Clear compression message
      setErrors(prev => ({ ...prev, instagramProof: '' }))
      
      // Set compressed file
      setInstagramProof(compressedFile)

      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.onerror = () => {
        setErrors(prev => ({ ...prev, instagramProof: 'Gagal membaca file. Silakan coba file lain.' }))
      }
      reader.readAsDataURL(compressedFile)
    } catch (error) {
      console.error('Compression error:', error)
      setErrors(prev => ({ ...prev, instagramProof: 'Gagal mengompres gambar. Silakan coba lagi.' }))
    }
  }

  // Remove file
  const removeFile = () => {
    setInstagramProof(null)
    setPreviewUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // PAYMENT FEATURE - COMMENTED OUT (can be re-enabled in the future)
  // Handle payment file upload
  // const handlePaymentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   if (!file) return

  //   // Validate file type
  //   const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  //   if (!allowedTypes.includes(file.type)) {
  //     setErrors(prev => ({ ...prev, paymentProof: 'File harus berformat JPG, JPEG, PNG, atau WEBP' }))
  //     return
  //   }

  //   // Validate file size (max 500KB)
  //   const maxSize = 500 * 1024 // 500KB
  //   if (file.size > maxSize) {
  //     setErrors(prev => ({ ...prev, paymentProof: 'Ukuran file maksimal 500KB. Kompres gambar terlebih dahulu.' }))
  //     return
  //   }

  //   // Clear any previous errors
  //   setErrors(prev => ({ ...prev, paymentProof: '' }))
  //   
  //   // Set file state
  //   setPaymentProof(file)

  //   // Create preview
  //   const reader = new FileReader()
  //   reader.onload = () => {
  //     setPaymentPreviewUrl(reader.result as string)
  //   }
  //   reader.onerror = () => {
  //     setErrors(prev => ({ ...prev, paymentProof: 'Gagal membaca file. Silakan coba file lain.' }))
  //   }
  //   reader.readAsDataURL(file)
  // }

  // Remove payment file
  // const removePaymentFile = () => {
  //   setPaymentProof(null)
  //   setPaymentPreviewUrl('')
  //   if (paymentFileInputRef.current) {
  //     paymentFileInputRef.current.value = ''
  //   }
  // }

  // Validate Step 1 (Data Pribadi + Akademik)
  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {}

    // Required fields untuk Step 1
    if (!formData.email.trim()) newErrors.email = 'Email wajib diisi'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Format email tidak valid'
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi'
    if (!formData.phone.trim()) newErrors.phone = 'Nomor HP wajib diisi'
    else if (!/^[\d\-\+\(\)\s]+$/.test(formData.phone)) newErrors.phone = 'Format nomor HP tidak valid'
    
    if (!formData.npm.trim()) newErrors.npm = 'NPM wajib diisi'

    if (!formData.academicStatus.trim()) newErrors.academicStatus = 'Status wajib dipilih'
    // if (!formData.yearClass.trim()) newErrors.yearClass = 'Tahun angkatan wajib dipilih'
    if (!formData.institution.trim()) newErrors.institution = 'Asal instansi wajib diisi'
    if (!formData.faculty.trim()) newErrors.faculty = 'Fakultas wajib diisi'
    if (!formData.major.trim()) newErrors.major = 'Jurusan wajib diisi'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validate Step 2 (Instagram + Info Tambahan)
  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {}

    // Instagram handle validation
    if (!formData.instagramHandle.trim()) {
      newErrors.instagramHandle = 'Username Instagram wajib diisi'
    }

    // Instagram proof validation
    if (!instagramProof) {
      newErrors.instagramProof = 'Bukti follow Instagram wajib diupload'
    }

    // PAYMENT VALIDATION - COMMENTED OUT
    // Payment method wajib dipilih
    // if (!formData.paymentMethod.trim()) newErrors.paymentMethod = 'Metode pembayaran wajib dipilih'
    
    // Payment proof wajib diupload
    // if (!paymentProof) newErrors.paymentProof = 'Bukti pembayaran wajib diupload'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle Step 1 submission
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep1()) {
      return
    }

    setIsSubmitting(true)

    try {
      const step1Data = {
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        npm: formData.npm,
        academicStatus: formData.academicStatus,
        // yearClass: formData.yearClass,
        institution: formData.institution,
        faculty: formData.faculty,
        major: formData.major
      }

      console.log('🚀 Submitting step 1 data:', step1Data)

      const response = await fetch('/api/registrations/step1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(step1Data)
      })

      const result = await response.json()
      console.log('📦 Step 1 result:', result)

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gagal menyimpan data sesi 1')
      }
      
      // Simpan registration ID untuk step 2
      setRegistrationId(result.data.registrationId)
      setStep1Completed(true)
      
      // Save state to localStorage immediately
      setTimeout(() => {
        saveStateToLocalStorage()
      }, 100)
      
      // Show success pop-up
      showNotification('success', '🎉 Sesi 1 Berhasil!', result.message + ' \n\n🥳')
      
      // Pindah ke step 2 setelah 3 detik
      setTimeout(() => {
        setCurrentStep(2)
        saveStateToLocalStorage()
      }, 3000)
      
    } catch (error) {
      console.error('Error submitting step 1:', error)
      
      let errorTitle = '❌ Gagal Menyimpan Sesi 1'
      let errorMessage = 'Terjadi kesalahan saat menyimpan data sesi 1'
      
      if (error instanceof Error) {
        errorMessage = error.message
        
        // Handle specific error cases
        if (error.message.includes('slot kegiatan sudah penuh') || error.message.includes('kuota habis')) {
          errorTitle = '😔 Slot Sudah Penuh'
          errorMessage = 'Maaf, slot kegiatan sudah penuh tepat saat Anda mendaftar. Silakan coba kegiatan lain atau tunggu pengumuman slot tambahan.'
        } else if (error.message.includes('sudah terdaftar')) {
          errorTitle = '📧 Email Sudah Terdaftar'
          errorMessage = 'Email Anda sudah terdaftar untuk kegiatan ini. Silakan gunakan email lain atau lanjutkan ke Step 2 jika belum selesai.'
        } else if (error.message.includes('belum dibuka') || error.message.includes('ditutup')) {
          errorTitle = '⏰ Pendaftaran Tidak Tersedia'
          errorMessage = 'Pendaftaran belum dibuka atau sudah ditutup. Silakan periksa jadwal pendaftaran.'
        } else if (error.message.includes('deadline')) {
          errorTitle = '⏰ Batas Waktu Terlewat'
          errorMessage = 'Batas waktu pendaftaran sudah berakhir.'
        }
      }
      
      showNotification('error', errorTitle, errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Step 2 submission
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep2()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Process Instagram proof - convert to base64 data URL
      let instagramProofUrl = null
      if (instagramProof) {
        try {
          console.log('🔄 Converting Instagram file to base64:', instagramProof.name, 'Size:', instagramProof.size)
          
          // Convert file to base64 data URL
          instagramProofUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(instagramProof)
          })
          
          console.log('✅ Instagram file converted to base64:', instagramProofUrl ? `Data URL (${instagramProofUrl.length} chars)` : 'No URL')
          
        } catch (uploadError) {
          console.error('❌ Instagram file conversion error:', uploadError)
          instagramProofUrl = null
        }
      }

      // PAYMENT PROCESSING - COMMENTED OUT
      // Process payment proof - convert to base64 data URL
      // let paymentProofUrl = null
      // if (paymentProof) {
      //   try {
      //     console.log('🔄 Converting Payment file to base64:', paymentProof.name, 'Size:', paymentProof.size)
      //     
      //     // Convert file to base64 data URL
      //     paymentProofUrl = await new Promise<string>((resolve, reject) => {
      //       const reader = new FileReader()
      //       reader.onload = () => resolve(reader.result as string)
      //       reader.onerror = reject
      //       reader.readAsDataURL(paymentProof)
      //     })
      //     
      //     console.log('✅ Payment file converted to base64:', paymentProofUrl ? `Data URL (${paymentProofUrl.length} chars)` : 'No URL')
      //     
      //   } catch (uploadError) {
      //     console.error('❌ Payment file conversion error:', uploadError)
      //     paymentProofUrl = null
      //   }
      // }

      const step2Data = {
        registrationId,
        instagramHandle: formData.instagramHandle,
        instagramProof: instagramProofUrl
        // paymentMethod: formData.paymentMethod,
        // paymentProof: paymentProofUrl
      }

      console.log('🚀 Submitting step 2 data:', {
        ...step2Data,
        instagramProof: instagramProofUrl ? `Data URL (${instagramProofUrl.length} chars)` : null
        // paymentProof: paymentProofUrl ? `Data URL (${paymentProofUrl.length} chars)` : null
      })

      const response = await fetch('/api/registrations/step2', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(step2Data)
      })

      const result = await response.json()
      console.log('📦 Step 2 result:', result)

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gagal menyelesaikan pendaftaran')
      }
      
      // Clear localStorage karena pendaftaran sudah selesai
      clearStateFromLocalStorage()
      
      // Show success pop-up with confetti effect
      showNotification('success', '🎉 Pendaftaran Selesai!', result.message)
      
      // Trigger party popper confetti effect
      console.log('About to trigger confetti...') // Debug log
      
      // Try immediate confetti first
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
      
      // Then trigger full animation
      setTimeout(() => {
        triggerConfetti()
      }, 100) // Shorter delay
      
      // Redirect ke halaman informasi grup WhatsApp setelah 1 detik
      setTimeout(() => {
        window.location.href = '/pendaftaran/selesai'
      }, 1000)
      
    } catch (error) {
      console.error('Error submitting step 2:', error)
      
      let errorTitle = '❌ Gagal Menyelesaikan Pendaftaran'
      let errorMessage = 'Terjadi kesalahan saat menyelesaikan pendaftaran'
      
      if (error instanceof Error) {
        errorMessage = error.message
        
        // Handle specific error cases
        if (error.message.includes('ditutup') || error.message.includes('deadline')) {
          errorTitle = '⏰ Pendaftaran Sudah Ditutup'
          errorMessage = 'Maaf, pendaftaran sudah ditutup saat Anda sedang mengisi data. Silakan coba kegiatan lain.'
        } else if (error.message.includes('penuh') || error.message.includes('kuota')) {
          errorTitle = '😔 Slot Sudah Penuh'
          errorMessage = 'Maaf, slot kegiatan sudah penuh saat Anda menyelesaikan pendaftaran. Silakan coba kegiatan lain atau tunggu pengumuman slot tambahan.'
        } else if (error.message.includes('status tidak valid') || error.message.includes('Step 1')) {
          errorTitle = '🔄 Perlu Mulai Ulang'
          errorMessage = 'Terjadi masalah dengan data pendaftaran. Silakan mulai ulang dari Step 1.'
          
          // Reset form to step 1 after a delay
          setTimeout(() => {
            setCurrentStep(1)
            setRegistrationId(null)
            setStep1Completed(false)
            showNotification('success', '🔄 Pendaftaran Reset', 'Silakan mulai ulang pendaftaran dari Step 1.')
          }, 5000)
        } else if (error.message.includes('sudah dimulai')) {
          errorTitle = '🚀 Kegiatan Sudah Dimulai'
          errorMessage = 'Kegiatan sudah dimulai sehingga pendaftaran tidak dapat diselesaikan.'
        }
      }
      
      showNotification('error', errorTitle, errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle form submission (router)
  const handleSubmit = async (e: React.FormEvent) => {
    if (currentStep === 1) {
      await handleStep1Submit(e)
    } else {
      await handleStep2Submit(e)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Resume Incomplete Registration Prompt */}
      {showResumePrompt && hasIncompleteRegistration && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-[#4B061A] animate-scale-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full mb-4 shadow-lg">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">🔄 Pendaftaran Belum Selesai</h3>
              <p className="text-gray-600">
                Kami menemukan pendaftaran Anda yang belum diselesaikan. Apakah Anda ingin melanjutkan?
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  const savedState = loadStateFromLocalStorage()
                  if (savedState) resumeRegistration(savedState)
                }}
                className="w-full bg-linear-to-r from-[#4B061A] to-[#8B1C3B] text-white px-6 py-4 rounded-xl hover:from-[#5B0720] hover:to-[#9B2C4B] transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg flex items-center justify-center"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Lanjutkan Pendaftaran
              </button>
              
              <button
                onClick={startNewRegistration}
                className="w-full bg-gray-200 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold flex items-center justify-center"
              >
                <X className="w-5 h-5 mr-2" />
                Mulai Pendaftaran Baru
              </button>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-800">
                💡 <strong>Tips:</strong> Jika Anda melanjutkan, data yang sudah Anda isi akan dimuat kembali.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Registration Status Guard */}
      {registrationStatus === 'loading' ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white/95 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-2xl">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-[#4B061A] rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Memeriksa Status Pendaftaran</h2>
          <p className="text-gray-600">Mohon tunggu sebentar...</p>
        </div>
      ) : registrationStatus === 'no-activity' ? (
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-2xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tidak Ada Kegiatan Aktif</h2>
          <p className="text-gray-600 mb-6">Saat ini belum ada kegiatan yang tersedia untuk pendaftaran.</p>
          <button
            onClick={() => window.location.href = '/kegiatan'}
            className="bg-linear-to-r from-[#4B061A] to-[#8B1C3B] text-white px-6 py-3 rounded-xl hover:from-[#5B0720] hover:to-[#9B2C4B] transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
          >
            Kembali ke Halaman Kegiatan
          </button>
        </div>
      ) : registrationStatus === 'not-started' ? (
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-2xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <User className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pendaftaran Belum Dibuka</h2>
          <p className="text-gray-600 mb-6">
            Pendaftaran untuk <strong>{activityStatus?.title}</strong> akan dibuka pada:<br/>
            <span className="text-[#4B061A] font-semibold">
              {activityStatus?.registrationStartDate 
                ? new Date(activityStatus.registrationStartDate).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Segera'
              }
            </span>
          </p>
          
          {/* Countdown Timer */}
          {(timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pendaftaran Dibuka Dalam:</h3>
              <div className="flex justify-center gap-4">
                {[
                  { label: 'Hari', value: timeLeft.days },
                  { label: 'Jam', value: timeLeft.hours },
                  { label: 'Menit', value: timeLeft.minutes },
                  { label: 'Detik', value: timeLeft.seconds },
                ].map((item, index) => (
                  <div key={index} className="bg-linear-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 shadow-lg">
                    <div className="text-2xl font-bold text-[#4B061A] mb-1">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/kegiatan'}
              className="bg-linear-to-r from-[#4B061A] to-[#8B1C3B] text-white px-6 py-3 rounded-xl hover:from-[#5B0720] hover:to-[#9B2C4B] transition-all duration-300 transform hover:scale-105 font-medium shadow-lg mr-3"
            >
              Kembali ke Halaman Kegiatan
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-all duration-300 font-medium shadow-lg"
            >
              Refresh Status
            </button>
          </div>
        </div>
      ) : registrationStatus === 'closed' ? (
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-2xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pendaftaran Ditutup</h2>
          <p className="text-gray-600 mb-6">
            Maaf, pendaftaran untuk <strong>{activityStatus?.title}</strong> sudah ditutup.
            {activityStatus?.registrationDeadline && (
              <>
                <br/>Batas waktu pendaftaran: {new Date(activityStatus.registrationDeadline).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </>
            )}
          </p>
          <button
            onClick={() => window.location.href = '/kegiatan'}
            className="bg-linear-to-r from-[#4B061A] to-[#8B1C3B] text-white px-6 py-3 rounded-xl hover:from-[#5B0720] hover:to-[#9B2C4B] transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
          >
            Lihat Kegiatan Lainnya
          </button>
        </div>
      ) : registrationStatus === 'full' && !(registrationId && step1Completed) ? (
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-2xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <User className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Kuota Penuh</h2>
          <p className="text-gray-600 mb-6">
            Maaf, pendaftaran untuk <strong>{activityStatus?.title}</strong> sudah penuh.<br/>
            Kuota: {activityStatus?.currentParticipants}/{activityStatus?.maxParticipants} peserta
          </p>
          <button
            onClick={() => window.location.href = '/kegiatan'}
            className="bg-linear-to-r from-[#4B061A] to-[#8B1C3B] text-white px-6 py-3 rounded-xl hover:from-[#5B0720] hover:to-[#9B2C4B] transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
          >
            Lihat Kegiatan Lainnya
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 md:p-10 border border-gray-200 shadow-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center w-full max-w-md">
              {/* Step 1 */}
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  currentStep >= 1 
                    ? 'bg-[#4B061A] text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step1Completed ? <CheckCircle className="w-5 h-5" /> : '1'}
                </div>
                <div className="ml-3 text-sm font-medium text-gray-700 hidden sm:block">
                  Data Pribadi
                </div>
              </div>
              
              {/* Connector */}
              <div className={`flex-1 h-1 mx-4 rounded transition-all duration-300 ${
                currentStep > 1 ? 'bg-[#4B061A]' : 'bg-gray-200'
              }`}></div>
              
              {/* Step 2 */}
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  currentStep >= 2 
                    ? 'bg-[#4B061A] text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
                <div className="ml-3 text-sm font-medium text-gray-700 hidden sm:block">
                  Informasi Tambahan
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-[#4B061A] to-[#8B1C3B] rounded-full mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {currentStep === 1 ? 'Sesi 1: Data Pribadi & Akademik' : 'Sesi 2: Informasi Instagram'}
          </h2>
          <p className="text-gray-600">
            {currentStep === 1 
              ? 'Lengkapi data pribadi dan akademik Anda. Data akan langsung tersimpan setelah sesi ini.' 
              : 'Lengkapi informasi Instagram untuk menyelesaikan pendaftaran.'
            }
          </p>
        </div>

        {/* PAYMENT INFO - COMMENTED OUT (can be re-enabled in the future) */}
        {/* Informasi Biaya & Slot - Tampil di Step 1 */}
        {/* {currentStep === 1 && (
          <>
            <div className="bg-linear-to-r from-green-500 to-emerald-600 rounded-xl p-4 sm:p-6 mb-6 text-white shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center w-full sm:w-auto">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mr-3 sm:mr-4 shrink-0">
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm opacity-90 mb-1">Biaya Pendaftaran</p>
                    <p className="text-2xl sm:text-3xl font-bold">Rp 30.000</p>
                  </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <p className="text-xs sm:text-sm opacity-90">Pembayaran di Sesi 2</p>
                </div>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 text-xs sm:text-sm opacity-90">
                <div className="flex items-center sm:mr-6">
                  <span className="w-2 h-2 bg-white rounded-full mr-2 shrink-0"></span>
                  <span>Transfer Bank BCA</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-2 shrink-0"></span>
                  <span>DANA e-Wallet</span>
                </div>
              </div>
            </div>

            {/* Informasi Slot & Sistem Reservasi */}
            {/* {activityStatus && (
              <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-8 shadow-lg">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                      {registrationId && step1Completed ? 'Slot Anda Sudah Tereservasi' : 'Sistem Slot Reservasi'}
                    </h3>
                    <div className="space-y-2 text-sm text-blue-700">
                      <div className="flex items-center justify-between">
                        <span>{registrationId && step1Completed ? 'Status Slot:' : 'Sisa Slot:'}</span>
                        <span className="font-bold">
                          {registrationId && step1Completed ? (
                            <span className="text-green-700">✅ Reserved untuk Anda</span>
                          ) : (
                            activityStatus.maxParticipants 
                              ? `${Math.max(0, activityStatus.maxParticipants - activityStatus.currentParticipants)}/${activityStatus.maxParticipants}`
                              : 'Unlimited'
                          )}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-blue-200">
                        <p className="text-xs leading-relaxed">
                          <span className="font-semibold">💡 Info:</span> 
                          {registrationId && step1Completed ? (
                            ' Slot Anda sudah tereservasi. Selesaikan pendaftaran dalam 30 menit sejak Sesi 1 untuk memastikan slot tidak dikembalikan ke sistem.'
                          ) : (
                            ' Setelah Anda menyelesaikan Sesi 1, slot akan otomatis di-reserve untuk Anda selama 30 menit untuk menyelesaikan Sesi 2.'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )} */}
          {/* </>
        )} */}

        <div className="space-y-8">
          
          {/* Step 1: Data Pribadi + Akademik */}
          {currentStep === 1 && (
            <>
              {/* Section 1: Data Pribadi */}
              <div className="bg-linear-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-[#4B061A]" />
              Data Pribadi
            </h3>
            <div className="grid gap-6">
              {/* Email */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-3">
                  <Mail className="w-4 h-4 inline mr-2 text-[#4B061A]" />
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B061A] focus:border-[#4B061A] transition-all duration-300 hover:border-gray-400 shadow-sm"
                  placeholder="contoh@gmail.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-2 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.email}</p>}
              </div>

              {/* Nama Lengkap */}
              <div className="group">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-3">
                  <User className="w-4 h-4 inline mr-2 text-[#4B061A]" />
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B061A] focus:border-[#4B061A] transition-all duration-300 hover:border-gray-400 shadow-sm"
                  placeholder="Nama lengkap sesuai KTP"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-2 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.fullName}</p>}
              </div>

              {/* Nomor HP */}
              <div className="group">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-3">
                  <Phone className="w-4 h-4 inline mr-2 text-[#4B061A]" />
                  Nomor HP <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B061A] focus:border-[#4B061A] transition-all duration-300 hover:border-gray-400 shadow-sm"
                  placeholder="081234567890"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-2 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Data Akademik */}
          <div className="bg-linear-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2 text-[#4B061A]" />
              Data Akademik
            </h3>
            <div className="grid gap-6">
              {/* Status Akademik */}
              <div className="group">
                <label htmlFor="academicStatus" className="block text-sm font-medium text-gray-700 mb-3">
                  <User className="w-4 h-4 inline mr-2 text-[#4B061A]" />
                  Status <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="academicStatus"
                    name="academicStatus"
                    value={formData.academicStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4B061A] focus:border-[#4B061A] transition-all duration-300 hover:border-gray-400 shadow-sm appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 12px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px'
                    }}
                  >
                    <option value="" className="text-gray-500 bg-gray-50">Pilih Status</option>
                    <option value="Mahasiswa" className="text-gray-800 bg-white py-2">Mahasiswa</option>
                    <option value="Pelajar" className="text-gray-800 bg-white py-2">Pelajar</option>
                  </select>
                </div>
                {errors.academicStatus && <p className="text-red-500 text-sm mt-2 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.academicStatus}</p>}
              </div>

              {/* NPM */}
              <div className="group">
                <label htmlFor="npm" className="block text-sm font-medium text-gray-700 mb-3">
                  <User className="w-4 h-4 inline mr-2 text-[#4B061A]" />
                  NPM / NIM / NIS / NISN <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="npm"
                  name="npm"
                  value={formData.npm}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B061A] focus:border-[#4B061A] transition-all duration-300 hover:border-gray-400 shadow-sm"
                  placeholder="202241000123"
                />
                {errors.npm && <p className="text-red-500 text-sm mt-2 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.npm}</p>}
              </div>

              {/* Asal Instansi */}
              <div className="group">
                <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-3">
                  <Building className="w-4 h-4 inline mr-2 text-[#4B061A]" />
                  Asal Instansi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B061A] focus:border-[#4B061A] transition-all duration-300 hover:border-gray-400 shadow-sm"
                  placeholder="Universitas Nasional"
                />
                {errors.institution && <p className="text-red-500 text-sm mt-2 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.institution}</p>}
              </div>

              {/* YEAR CLASS FIELD - COMMENTED OUT (can be re-enabled in the future) */}
              {/* Tahun Angkatan */}
              {/* <div className="group">
                <label htmlFor="yearClass" className="block text-sm font-medium text-gray-700 mb-3">
                  <Calendar className="w-4 h-4 inline mr-2 text-[#4B061A]" />
                  Tahun Angkatan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="yearClass"
                    name="yearClass"
                    value={formData.yearClass}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4B061A] focus:border-[#4B061A] transition-all duration-300 hover:border-gray-400 shadow-sm appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 12px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px'
                    }}
                  >
                    <option value="" className="text-gray-500 bg-gray-50">Pilih Tahun Angkatan</option>
                    {Array.from({ length: new Date().getFullYear() - 2022 + 1 }, (_, i) => {
                      const year = new Date().getFullYear() - i
                      return year >= 2022 ? (
                        <option key={year} value={year.toString()} className="text-gray-800 bg-white py-2">
                          {year}
                        </option>
                      ) : null
                    }).filter(Boolean)}
                  </select>
                  {/* Custom dropdown arrow overlay */}
                  {/* <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                {errors.yearClass && <p className="text-red-500 text-sm mt-2 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.yearClass}</p>}
              </div> */}

              {/* Fakultas dan Jurusan */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-3">
                    <Building className="w-4 h-4 inline mr-2 text-[#4B061A]" />
                    Fakultas / Kelas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="faculty"
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B061A] focus:border-[#4B061A] transition-all duration-300 hover:border-gray-400 shadow-sm"
                    placeholder="FTKI / XII"
                  />
                  {errors.faculty && <p className="text-red-500 text-sm mt-2 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.faculty}</p>}
                </div>
                
                <div className="group">
                  <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-3">
                    <Building className="w-4 h-4 inline mr-2 text-[#4B061A]" />
                    Jurusan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="major"
                    name="major"
                    value={formData.major}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B061A] focus:border-[#4B061A] transition-all duration-300 hover:border-gray-400 shadow-sm"
                    placeholder="SI / RPL / TKJ"
                  />
                  {errors.major && <p className="text-red-500 text-sm mt-2 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.major}</p>}
                </div>
              </div>
            </div>
          </div>
          </>
          )}

          {/* Step 2: Instagram & Info Tambahan */}
          {currentStep === 2 && (
            <>
              {/* Section 3: Instagram & Bukti Follow */}
              <div className="bg-linear-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Instagram className="w-5 h-5 mr-2 text-[#4B061A]" />
              Instagram & Bukti Follow
            </h3>
            <div className="grid gap-6">
              {/* Instagram Handle */}
              <div className="group">
                <label htmlFor="instagramHandle" className="block text-sm font-medium text-gray-700 mb-3">
                  <Instagram className="w-4 h-4 inline mr-2 text-[#4B061A]" />
                  Username Instagram <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="instagramHandle"
                  name="instagramHandle"
                  value={formData.instagramHandle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B061A] focus:border-[#4B061A] transition-all duration-300 hover:border-gray-400 shadow-sm"
                  placeholder="@username_instagram"
                />
                {errors.instagramHandle && <p className="text-red-500 text-sm mt-2 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.instagramHandle}</p>}
              </div>

              {/* Upload Screenshot */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <FileImage className="w-4 h-4 inline mr-2 text-[#4B061A]" />
                  Screenshot Bukti Follow Instagram HIMASI <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50">
                  {!previewUrl ? (
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-linear-to-r from-[#4B061A] to-[#8B1C3B] text-white px-6 py-3 rounded-xl hover:from-[#5B0720] hover:to-[#9B2C4B] transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
                      >
                        Pilih File Gambar
                      </button>
                      <p className="text-gray-600 text-sm mt-3">Format: JPG, JPEG, PNG, WEBP (Max: 1MB)</p>
                      <p className="text-gray-500 text-xs mt-1">Screenshot harus menunjukkan bahwa Anda sudah follow @himasi.unas1949</p>
                      <p className="text-blue-600 text-xs mt-1">💡 Tip: Kompres gambar jika ukuran terlalu besar</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <Image
                        src={previewUrl}
                        alt="Preview Screenshot"
                        width={400}
                        height={300}
                        className="w-full max-w-sm mx-auto rounded-xl shadow-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeFile}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-300 shadow-lg transform hover:scale-110"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="text-center mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
                        <p className="text-gray-800 text-sm font-medium">
                          {instagramProof?.name}
                        </p>
                        <p className="text-green-600 text-xs mt-1 flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          File berhasil diupload
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {errors.instagramProof && <p className="text-red-500 text-sm mt-2 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.instagramProof}</p>}
              </div>
            </div>
          </div>

          {/* PAYMENT SECTION - COMMENTED OUT (can be re-enabled in the future) */}
          {/* Section 4: Pembayaran */}
          {/* <div className="bg-linear-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-200 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
              Pembayaran
            </h3>
            
            <div className="space-y-6">
              {/* Metode Pembayaran */}
              {/* <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Pilih Metode Pembayaran <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {/* BCA Transfer */}
                  {/* <div className="border border-gray-300 rounded-xl p-4 hover:border-purple-400 transition-colors">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bca"
                        checked={formData.paymentMethod === "bca"}
                        onChange={handleInputChange}
                        className="mt-1 text-purple-600 focus:ring-purple-500"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center mb-2">
                          <CreditCard className="w-6 h-6 mr-3 text-blue-600" />
                          <span className="font-medium text-gray-800">Transfer Bank BCA</span>
                        </div>
                        {formData.paymentMethod === "bca" && (
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-sm text-gray-600">Nominal:</p>
                              <p className="font-bold text-blue-800 text-xl">Rp 30.000</p>
                            </div>
                            <div className="border-t border-blue-200 pt-3">
                              <p className="text-sm text-gray-600 mb-1">Transfer ke rekening:</p>
                              <p className="font-mono font-bold text-blue-800 text-lg">1234567890</p>
                              <p className="text-sm text-gray-600">a.n. HIMASI UNAS</p>
                              <p className="text-xs text-blue-600 mt-2">💡 Transfer tepat sesuai nominal agar mudah dikonfirmasi</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div> */}

                  {/* DANA E-wallet */}
                  {/* <div className="border border-gray-300 rounded-xl p-4 hover:border-purple-400 transition-colors">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="dana"
                        checked={formData.paymentMethod === "dana"}
                        onChange={handleInputChange}
                        className="mt-1 text-purple-600 focus:ring-purple-500"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center mb-2">
                          <Smartphone className="w-6 h-6 mr-3 text-green-600" />
                          <span className="font-medium text-gray-800">DANA E-wallet</span>
                        </div>
                        {formData.paymentMethod === "dana" && (
                          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-sm text-gray-600">Nominal:</p>
                              <p className="font-bold text-green-800 text-xl">Rp 30.000</p>
                            </div>
                            <div className="border-t border-green-200 pt-3">
                              <p className="text-sm text-gray-600 mb-1">Transfer ke DANA:</p>
                              <p className="font-mono font-bold text-green-800 text-lg">081234567890</p>
                              <p className="text-sm text-gray-600">a.n. HIMASI UNAS</p>
                              <p className="text-xs text-green-600 mt-2">💡 Transfer tepat sesuai nominal agar mudah dikonfirmasi</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
                {errors.paymentMethod && <p className="text-red-500 text-sm mt-2 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.paymentMethod}</p>}
              </div> */}

              {/* Upload Bukti Pembayaran */}
              {/* <div className="group">
                <label htmlFor="paymentProof" className="block text-sm font-medium text-gray-700 mb-3">
                  <Upload className="w-4 h-4 inline mr-2 text-purple-600" />
                  Upload Bukti Pembayaran <span className="text-red-500">*</span>
                  <span className="text-gray-500 text-xs ml-2">(Max 500KB, format: JPG, PNG)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors bg-gray-50">
                  {!paymentPreviewUrl ? (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <input
                        type="file"
                        id="paymentProof"
                        name="paymentProof"
                        accept="image/*"
                        onChange={handlePaymentFileChange}
                        className="hidden"
                      />
                      <label 
                        htmlFor="paymentProof" 
                        className="cursor-pointer inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Pilih Bukti Pembayaran
                      </label>
                      <p className="text-gray-500 text-sm mt-2">
                        Upload screenshot atau foto bukti transfer/pembayaran
                      </p>
                    </div>
                  ) : (
                    <div className="relative">
                      <Image 
                        src={paymentPreviewUrl} 
                        alt="Preview bukti pembayaran" 
                        width={300}
                        height={192}
                        className="max-h-48 mx-auto rounded-lg shadow-md object-cover"
                      />
                      <button
                        type="button"
                        onClick={removePaymentFile}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-green-800 text-sm font-medium flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Bukti pembayaran berhasil diupload
                        </p>
                        <p className="text-green-600 text-xs mt-1">
                          Ukuran: {paymentProof ? (paymentProof.size / 1024).toFixed(1) : 0} KB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {errors.paymentProof && <p className="text-red-500 text-sm mt-2 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.paymentProof}</p>}
              </div>
            </div>
          </div> */}
          </>
          )}

          {/* Submit Section */}
          <div className="bg-linear-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-lg text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-[#4B061A] to-[#8B1C3B] rounded-full mb-4 shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {currentStep === 1 ? 'Siap untuk Lanjut?' : 'Siap untuk Selesaikan?'}
              </h3>
              <p className="text-gray-600 text-sm">
                {currentStep === 1 
                  ? (
                    <>
                      Data pribadi dan akademik akan langsung tersimpan di database dan{' '}
                      <span className="font-bold">
                        slot kegiatan akan bertambah.
                      </span>
                    </>
                  )
                  : 'Pastikan informasi Instagram sudah benar sebelum menyelesaikan pendaftaran.'
                }
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-[#4B061A] to-[#8B1C3B] text-white px-4 sm:px-8 py-4 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-[#5B0720] hover:to-[#9B2C4B] hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isSubmitting ? (
                <span className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent sm:mr-3"></div>
                  <span className="text-center leading-tight">
                    {currentStep === 1 ? 'Menyimpan Data Sesi 1...' : 'Menyelesaikan Pendaftaran...'}
                  </span>
                </span>
              ) : (
                <span className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0">
                  <Upload className="w-6 h-6 sm:w-5 sm:h-5 sm:mr-2" />
                  <span className="text-center leading-tight">
                    {currentStep === 1 ? 'Simpan & Lanjut ke Sesi 2' : 'Selesaikan Pendaftaran'}
                  </span>
                </span>
              )}
            </button>
            
            <div className="mt-6 p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                <span className="flex flex-col sm:flex-row items-center justify-center mb-3 sm:mb-2 text-blue-700 gap-1 sm:gap-0">
                  <AlertCircle className="w-4 h-4 sm:mr-2" />
                  <span className="font-semibold">Syarat dan Ketentuan</span>
                </span>
                <span className="block text-justify sm:text-center" style={{ textAlignLast: 'center' }}>
                  Dengan mengirim form ini, Anda setuju dengan syarat dan ketentuan yang berlaku. 
                  Data yang Anda berikan akan digunakan untuk keperluan pendaftaran kegiatan HIMASI.
                </span>
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* Activity Status Debug Panel */}
      {activityStatus && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200 hidden">
          <h4 className="font-semibold text-blue-800 mb-3">📊 Status Kegiatan</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p><strong>Judul:</strong> {activityStatus.title}</p>
              <p><strong>Manual Open:</strong> {activityStatus.registrationOpen ? '✅ Ya' : '❌ Tidak'}</p>
              <p><strong>Auto Open Time:</strong> {activityStatus.registrationStatus?.isAutoOpenTime ? '✅ Sudah Tiba' : '❌ Belum Tiba'}</p>
              <p><strong>Within Deadline:</strong> {activityStatus.registrationStatus?.isWithinDeadline ? '✅ Masih Berlaku' : '❌ Sudah Lewat'}</p>
            </div>
            <div className="space-y-2">
              <p><strong>Final Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
                  activityStatus.registrationStatus?.finalStatus ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                }`}>
                  {activityStatus.registrationStatus?.finalStatus ? 'TERBUKA' : 'TERTUTUP'}
                </span>
              </p>
              <p><strong>Start Date:</strong> {activityStatus.registrationStartDate ? new Date(activityStatus.registrationStartDate).toLocaleString('id-ID') : 'Tidak ada'}</p>
              <p><strong>Deadline:</strong> {activityStatus.registrationDeadline ? new Date(activityStatus.registrationDeadline).toLocaleString('id-ID') : 'Tidak ada'}</p>
              <p><strong>Peserta:</strong> {activityStatus.currentParticipants}/{activityStatus.maxParticipants || '∞'}</p>
            </div>
          </div>
          {!activityStatus.registrationStatus?.finalStatus && (
            <div className="mt-3 p-3 bg-red-100 rounded border border-red-300">
              <p className="text-red-700 text-sm font-medium">
                ⚠️ <strong>Alasan Pendaftaran Tertutup:</strong><br/>
                {!activityStatus.registrationStatus?.isAutoOpenTime && '• Belum waktu pembukaan pendaftaran'}<br/>
                {!activityStatus.registrationStatus?.isWithinDeadline && '• Sudah melewati batas waktu pendaftaran'}<br/>
                {!activityStatus.registrationOpen && activityStatus.registrationStatus?.isAutoOpenTime && activityStatus.registrationStatus?.isWithinDeadline && '• Admin belum membuka pendaftaran secara manual'}
              </p>
            </div>
          )}
            <div className="mt-3 p-2 bg-gray-100 rounded text-xs text-gray-600">
              <p><strong>Waktu Sekarang:</strong> {new Date().toLocaleString('id-ID')}</p>
            </div>
          </div>
        )}
      </>
      )}

      {/* Pop-up Notification */}
      {showPopup && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={closeNotification}
        >
          <div 
            className={`relative max-w-md w-full mx-4 p-6 rounded-3xl shadow-2xl transform transition-all duration-300 scale-100 ${
              popupType === 'success' 
                ? 'bg-linear-to-br from-green-50 to-green-100 border-2 border-green-200' 
                : 'bg-linear-to-br from-red-50 to-red-100 border-2 border-red-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeNotification}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="flex items-center justify-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                popupType === 'success' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {popupType === 'success' ? (
                  <CheckCircle className="w-8 h-8" />
                ) : (
                  <AlertCircle className="w-8 h-8" />
                )}
              </div>
            </div>

            {/* Title */}
            <h3 className={`text-xl font-bold text-center mb-3 ${
              popupType === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {popupTitle}
            </h3>

            {/* Message */}
            <p className={`text-center text-sm leading-relaxed mb-6 ${
              popupType === 'success' ? 'text-green-700' : 'text-red-700'
            }`}>
              {popupMessage}
            </p>

            {/* Action Button */}
            <div className="flex justify-center">
              <button
                onClick={closeNotification}
                className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  popupType === 'success' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {popupType === 'success' ? 'Lanjutkan' : 'Tutup'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}