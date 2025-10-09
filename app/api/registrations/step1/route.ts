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
      yearClass,
      faculty,
      major
    } = body

    console.log('🔍 Validating required fields for step 1...')
    
    // Validasi required fields untuk sesi 1
    if (!email || !fullName || !phone || !npm || !yearClass) {
      console.log('❌ Missing required fields:', { email: !!email, fullName: !!fullName, phone: !!phone, npm: !!npm, yearClass: !!yearClass })
      return NextResponse.json(
        {
          success: false,
          message: 'Email, nama lengkap, nomor HP, NPM, dan tahun angkatan wajib diisi'
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

    // Validasi format NPM (harus 12 digit)
    if (npm && !/^\d{12}$/.test(npm.trim())) {
      console.log('❌ Invalid NPM format:', npm)
      return NextResponse.json(
        {
          success: false,
          message: 'NPM harus terdiri dari 12 digit angka'
        },
        { status: 400 }
      )
    }

    console.log('🔍 Searching for published activity...')
    
    // Ambil kegiatan utama yang published
    const activity = await prisma.activity.findFirst({
      where: { 
        isPublished: true 
      },
      include: {
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

    // Cek maksimal peserta
    if (activity.maxParticipants && activity._count.registrations >= activity.maxParticipants) {
      console.log('❌ Activity is full:', activity._count.registrations, '>=', activity.maxParticipants)
      return NextResponse.json(
        {
          success: false,
          message: 'Kegiatan sudah penuh. Maksimal peserta sudah tercapai.'
        },
        { status: 400 }
      )
    }

    console.log('🔍 Checking for existing registration...')
    
    // Cek apakah email sudah terdaftar untuk kegiatan ini  
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        activityId_email: {
          activityId: activity.id,
          email
        }
      }
    })

    if (existingRegistration) {
      console.log('❌ User already registered:', email)
      return NextResponse.json(
        {
          success: false,
          message: 'Email Anda sudah terdaftar untuk kegiatan ini'
        },
        { status: 400 }
      )
    }

    console.log('✅ All checks passed, creating step 1 registration...')
    
    // Buat pendaftaran sesi 1 (status PENDING tapi hanya data pribadi + akademik)
    const registration = await prisma.registration.create({
      data: {
        activityId: activity.id,
        email,
        fullName,
        phone,
        npm,
        yearClass,
        faculty,
        major,
        // Instagram dan info tambahan null dulu, akan diisi di step 2
        instagramProof: null,
        instagramHandle: null,
        motivation: null,
        specialRequest: null,
        status: 'PENDING' // Status pending sampai step 2 selesai
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
      
      if (error.message.includes('Unique constraint')) {
        errorMessage = 'Email Anda sudah terdaftar untuk kegiatan ini'
        statusCode = 400
      } else if (error.message.includes('Foreign key constraint')) {
        errorMessage = 'Referensi kegiatan tidak valid'
        statusCode = 400
      } else if (error.message.includes('Required field')) {
        errorMessage = 'Data yang diperlukan tidak lengkap'
        statusCode = 400
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: statusCode }
    )
  }
}