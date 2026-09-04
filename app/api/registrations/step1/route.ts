import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/registrations/step1 - Submit sesi 1: Data pribadi + akademik
export async function POST(request: NextRequest) {
  try {
    console.log('📥 Step 1 Registration API called')
    
    const body = await request.json()
    console.log('📦 Step 1 Request body received:', body)
    
    const {
      email,
      fullName,
      phone,
      npm,
      academicStatus,
      yearClass,
      institution,
      faculty,
      major
    } = body

    console.log('🔍 Validating required fields for step 1...')
    
    // Validasi required fields untuk sesi 1
    if (!email || !fullName || !phone || !npm) {
      console.log('❌ Missing required fields:', { email: !!email, fullName: !!fullName, phone: !!phone, npm: !!npm })
      return NextResponse.json(
        {
          success: false,
          message: 'Email, nama lengkap, nomor HP, dan NPM wajib diisi'
        },
        { status: 400 }
      )
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email)
      return NextResponse.json(
        {
          success: false,
          message: 'Format email tidak valid'
        },
        { status: 400 }
      )
    }

    console.log('🔍 Searching for published activity...')
    
    // 🚀 OPTIMIZED: Select only essential fields untuk reduce bandwidth
    const activity = await prisma.activity.findFirst({
      where: { 
        isPublished: true 
      },
      select: {
        id: true,
        title: true,
        registrationOpen: true,
        registrationStartDate: true,
        registrationDeadline: true,
        startDate: true,
        maxParticipants: true,
        maxParticipantsMahasiswa: true,
        maxParticipantsPelajar: true,
        _count: {
          select: { registrations: true }
        }
      }
    })

    if (!activity) {
      console.log('❌ No published activity found')
      return NextResponse.json(
        {
          success: false,
          message: 'No active activity found'
        },
        { status: 404 }
      )
    }

    console.log('✅ Found activity:', {
      id: activity.id,
      title: activity.title,
      registrationOpen: activity.registrationOpen,
      currentParticipants: activity._count.registrations,
      maxParticipants: activity.maxParticipants
    })

    console.log('🔍 Checking registration status...')
    
    // Check auto-open based on registrationStartDate
    const now = new Date()
    const isAutoOpenTime = activity.registrationStartDate ? now >= new Date(activity.registrationStartDate) : true
    const isWithinDeadline = activity.registrationDeadline ? now <= new Date(activity.registrationDeadline) : true
    
    console.log('📅 Time check:', {
      now: now.toISOString(),
      registrationStartDate: activity.registrationStartDate,
      registrationDeadline: activity.registrationDeadline,
      isAutoOpenTime,
      isWithinDeadline,
      manuallyOpen: activity.registrationOpen
    })
    
    // Registration is open if manually opened OR auto-open time has arrived (and within deadline)
    const isRegistrationOpen = activity.registrationOpen || (isAutoOpenTime && isWithinDeadline)
    
    if (!isRegistrationOpen) {
      if (!isAutoOpenTime) {
        console.log('❌ Registration not started yet')
        const startDate = activity.registrationStartDate ? new Date(activity.registrationStartDate).toLocaleDateString('id-ID') : 'segera'
        return NextResponse.json(
          {
            success: false,
            message: `Pendaftaran belum dibuka. Pendaftaran akan dimulai pada ${startDate}`
          },
          { status: 400 }
        )
      } else {
        console.log('❌ Registration is closed')
        return NextResponse.json(
          {
            success: false,
            message: 'Pendaftaran untuk kegiatan ini sudah ditutup'
          },
          { status: 400 }
        )
      }
    }

    // Additional deadline check
    if (activity.registrationDeadline && now > new Date(activity.registrationDeadline)) {
      console.log('❌ Registration deadline passed:', activity.registrationDeadline)
      const deadlineDate = new Date(activity.registrationDeadline).toLocaleDateString('id-ID')
      return NextResponse.json(
        {
          success: false,
          message: `Batas waktu pendaftaran sudah berakhir pada ${deadlineDate}`
        },
        { status: 400 }
      )
    }

    // Cek apakah NPM atau email sudah terdaftar untuk kegiatan ini  
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        activityId: activity.id,
        OR: [
          ...(npm ? [{ npm: npm.trim() }] : []),
          ...(email ? [{ email: email.trim() }] : [])
        ]
      }
    })

    if (existingRegistration) {
      console.log('❌ User already registered:', { npm, email })
      return NextResponse.json(
        {
          success: false,
          message: 'Data Anda sudah terdaftar untuk kegiatan ini'
        },
        { status: 400 }
      )
    }

    console.log('✅ All checks passed, creating step 1 registration using atomic transaction...')
    
    // Gunakan database transaction untuk memastikan slot check dan registration creation atomik
    const registration = await prisma.$transaction(async (tx) => {
      console.log('🔒 Starting atomic transaction for slot reservation...')
      
      // Re-check slot availability dalam transaksi untuk mencegah race condition
      const currentActivity = await tx.activity.findUnique({
        where: { id: activity.id },
        include: {
          _count: {
            select: { registrations: true }
          }
        }
      })

      if (!currentActivity) {
        throw new Error('Activity not found during transaction')
      }

      // Hitung jumlah peserta per status akademik
      const mahasiswaCount = await tx.registration.count({
        where: {
          activityId: activity.id,
          academicStatus: 'Mahasiswa'
        }
      })

      const pelajarCount = await tx.registration.count({
        where: {
          activityId: activity.id,
          academicStatus: 'Pelajar'
        }
      })

      console.log('🔍 Final slot check:', {
        totalParticipants: currentActivity._count.registrations,
        maxParticipants: currentActivity.maxParticipants,
        mahasiswaCount,
        maxMahasiswa: currentActivity.maxParticipantsMahasiswa,
        pelajarCount,
        maxPelajar: currentActivity.maxParticipantsPelajar,
        requestedStatus: academicStatus
      })

      // Jika ada pembagian slot berdasarkan status akademik
      if (currentActivity.maxParticipantsMahasiswa && currentActivity.maxParticipantsPelajar) {
        if (academicStatus === 'Mahasiswa') {
          if (mahasiswaCount >= currentActivity.maxParticipantsMahasiswa) {
            console.log('❌ Slot Mahasiswa penuh:', mahasiswaCount, '>=', currentActivity.maxParticipantsMahasiswa)
            throw new Error('SLOT_MAHASISWA_FULL')
          }
        } else if (academicStatus === 'Pelajar') {
          if (pelajarCount >= currentActivity.maxParticipantsPelajar) {
            console.log('❌ Slot Pelajar penuh:', pelajarCount, '>=', currentActivity.maxParticipantsPelajar)
            throw new Error('SLOT_PELAJAR_FULL')
          }
        }
      } else {
        // Fallback ke pengecekan total slot jika tidak ada pembagian
        if (currentActivity.maxParticipants && currentActivity._count.registrations >= currentActivity.maxParticipants) {
          console.log('❌ Activity is full during transaction:', currentActivity._count.registrations, '>=', currentActivity.maxParticipants)
          throw new Error('SLOT_FULL')
        }
      }

      // Double-check untuk pendaftaran yang sudah terdaftar dalam transaksi
      const duplicateCheck = await tx.registration.findFirst({
        where: {
          activityId: activity.id,
          OR: [
            ...(npm ? [{ npm: npm.trim() }] : []),
            ...(email ? [{ email: email.trim() }] : [])
          ]
        }
      })

      if (duplicateCheck) {
        console.log('❌ Duplicate registration found during transaction:', { npm, email })
        throw new Error('DUPLICATE_REGISTRATION')
      }

      console.log('✅ Slot available, creating registration...')
      
      // Buat pendaftaran sesi 1 dengan step1Completed = true untuk menandai slot sudah di-reserve
      const newRegistration = await tx.registration.create({
        data: {
          activityId: activity.id,
          email,
          fullName,
          phone,
          npm,
          academicStatus,
          // yearClass, // COMMENTED OUT - field is now optional
          institution,
          faculty,
          major,
          // Instagram dan info tambahan null dulu, akan diisi di step 2
          instagramProof: null,
          instagramHandle: null,
          motivation: null,
          specialRequest: null,
          paymentMethod: null,
          paymentProof: null,
          status: 'PENDING',
          step1Completed: true,  // Menandai step 1 sudah selesai dan slot reserved
          step2Completed: false, // Step 2 belum selesai
          createdAt: new Date(),
          updatedAt: new Date()
        },
        include: {
          activity: {
            select: {
              title: true,
              startDate: true,
              location: true
            }
          }
        }
      })

      console.log('✅ Registration created successfully in transaction:', newRegistration.id)
      return newRegistration
    })

    console.log('✅ Transaction completed successfully for registration:', registration.id)

    console.log('✅ Step 1 Registration created successfully:', registration.id)

    return NextResponse.json({
      success: true,
      message: `Selamat ${fullName}! Data pribadi Anda sudah terdaftar. Slot kegiatan bertambah dan nama Anda sudah masuk database. Saatnya lanjut untuk menyelesaikan pendaftaran.`,
      data: {
        registrationId: registration.id,
        fullName: registration.fullName,
        email: registration.email,
        step: 1,
        nextStep: 2
      }
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Error creating step 1 registration:', error)
    
    let errorMessage = 'Gagal menyimpan data sesi 1'
    let statusCode = 500
    
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
      
      // Handle transaction-specific errors
      if (error.message === 'SLOT_FULL') {
        errorMessage = 'Maaf, slot kegiatan sudah penuh. Kuota habis saat Anda sedang mendaftar.'
        statusCode = 400
      } else if (error.message === 'SLOT_MAHASISWA_FULL') {
        errorMessage = 'Maaf, slot untuk Mahasiswa sudah penuh. Silakan coba kegiatan lain atau tunggu pengumuman slot tambahan.'
        statusCode = 400
      } else if (error.message === 'SLOT_PELAJAR_FULL') {
        errorMessage = 'Maaf, slot untuk Pelajar sudah penuh. Silakan coba kegiatan lain atau tunggu pengumuman slot tambahan.'
        statusCode = 400
      } else if (error.message === 'EMAIL_DUPLICATE') {
        errorMessage = 'Email Anda sudah terdaftar untuk kegiatan ini'
        statusCode = 400
      } else if (error.message.includes('Unique constraint')) {
        errorMessage = 'Email Anda sudah terdaftar untuk kegiatan ini'
        statusCode = 400
      } else if (error.message.includes('Foreign key constraint')) {
        errorMessage = 'Referensi kegiatan tidak valid'
        statusCode = 400
      } else if (error.message.includes('Required field')) {
        errorMessage = 'Data yang diperlukan tidak lengkap'
        statusCode = 400
      } else {
        // In development, show the actual error
        errorMessage = error.message || 'Gagal menyimpan data sesi 1'
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: statusCode }
    )
  }
}