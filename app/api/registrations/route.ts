import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma, RegistrationStatus } from '@prisma/client'
import { invalidateCurrentActivityCache } from '@/lib/activity'

// POST /api/registrations - Submit pendaftaran untuk kegiatan utama
export async function POST(request: NextRequest) {
  try {
    console.log('📥 Registration API called')
    
    const body = await request.json()
    console.log('📦 Request body received:', {
      ...body,
      instagramProof: body.instagramProof ? `Data URL (${body.instagramProof.length} chars)` : null
    })
    
    const {
      email,
      fullName,
      phone,
      npm,
      yearClass,
      studentPortalProof,
      faculty,
      major,
      instagramProof,
      instagramHandle,
      motivation,
      specialRequest
    } = body

    console.log('🔍 Validating required fields...')
    
    // Validasi required fields (Nama lengkap, nomor HP, NPM, tahun angkatan, dan bukti portal mahasiswa)
    if (!fullName || !phone || !npm || !yearClass || !studentPortalProof) {
      console.log('❌ Missing required fields:', {
        fullName: !!fullName,
        phone: !!phone,
        npm: !!npm,
        yearClass: !!yearClass,
        studentPortalProof: !!studentPortalProof,
      })
      return NextResponse.json(
        {
          success: false,
          message: 'Nama lengkap, nomor HP, NPM, tahun angkatan, dan bukti portal mahasiswa wajib diisi',
        },
        { status: 400 }
      )
    }

    // Validasi format NPM (angka)
    if (!/^\d{6,16}$/.test(npm.trim())) {
      console.log('❌ Invalid NPM format:', npm)
      return NextResponse.json(
        {
          success: false,
          message: 'NPM harus berupa digit angka yang valid'
        },
        { status: 400 }
      )
    }

    // Validasi tahun angkatan (hanya 2024 atau 2025)
    if (yearClass.trim() !== '2024' && yearClass.trim() !== '2025') {
      return NextResponse.json(
        {
          success: false,
          message: 'Tahun angkatan harus 2024 atau 2025'
        },
        { status: 400 }
      )
    }

    // Generate email unik berdasarkan NPM jika email tidak diisi dari form
    const registrationEmail = email && email.trim() !== ''
      ? email.trim()
      : `${npm.trim()}@civitas.unas.ac.id`

    // Validasi instagram proof jika ada
    if (instagramProof && typeof instagramProof === 'string') {
      // Check if it's a valid data URL
      if (!instagramProof.startsWith('data:image/')) {
        console.log('❌ Invalid instagram proof format')
        return NextResponse.json(
          {
            success: false,
            message: 'Format bukti follow Instagram tidak valid'
          },
          { status: 400 }
        )
      }
      
      // Check size of base64 data (roughly 25MB limit in base64)
      if (instagramProof.length > 33554432) { // 32MB in characters
        console.log('❌ Instagram proof too large:', instagramProof.length)
        return NextResponse.json(
          {
            success: false,
            message: 'Gambar bukti follow Instagram terlalu besar. Kompres gambar terlebih dahulu.'
          },
          { status: 400 }
        )
      }
    }

    console.log('🔍 Searching for published activity...')
    
    // 🚀 OPTIMIZED: Select only essential fields untuk reduce Neon bandwidth
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

    // Additional deadline check (already checked above, but keeping for clarity)
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

    // Cek maksimal peserta total jika diset positif oleh admin
    if (activity.maxParticipants && activity.maxParticipants > 0 && activity._count.registrations >= activity.maxParticipants) {
      console.log('❌ Activity is full:', activity._count.registrations, '>=', activity.maxParticipants)
      return NextResponse.json(
        {
          success: false,
          message: 'Kuota pendaftaran kegiatan sudah penuh'
        },
        { status: 400 }
      )
    }

    // Cek kuota per angkatan sesuai konfigurasi kegiatan di admin
    const targetYear = yearClass.trim()
    const maxForYear = targetYear === '2024'
      ? (activity.maxParticipantsMahasiswa && activity.maxParticipantsMahasiswa > 0 ? activity.maxParticipantsMahasiswa : 5)
      : (activity.maxParticipantsPelajar && activity.maxParticipantsPelajar > 0 ? activity.maxParticipantsPelajar : 5)

    const yearRegistrationsCount = await prisma.registration.count({
      where: {
        activityId: activity.id,
        yearClass: targetYear
      }
    })

    if (yearRegistrationsCount >= maxForYear) {
      console.log(`❌ Quota full for Angkatan ${targetYear}: ${yearRegistrationsCount} >= ${maxForYear}`)
      return NextResponse.json(
        {
          success: false,
          message: `Maaf, kuota pendaftaran untuk Angkatan ${targetYear} sudah penuh (${maxForYear} slot)`
        },
        { status: 400 }
      )
    }

    console.log('🔍 Checking for existing registration...')
    
    // Cek apakah email atau NPM sudah terdaftar untuk kegiatan ini  
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        activityId: activity.id,
        OR: [
          { email: registrationEmail },
          { npm: npm.trim() }
        ]
      }
    })

    if (existingRegistration) {
      console.log('❌ User already registered:', { email: registrationEmail, npm: npm.trim() })
      return NextResponse.json(
        {
          success: false,
          message: 'NPM ini sudah terdaftar untuk kegiatan ini'
        },
        { status: 400 }
      )
    }

    console.log('✅ All checks passed, creating registration...')
    
    // Buat pendaftaran baru (1 sesi langsung selesai)
    const registration = await prisma.registration.create({
      data: {
        activityId: activity.id,
        email: registrationEmail,
        fullName: fullName.trim(),
        phone: phone.trim(),
        npm: npm.trim(),
        yearClass: yearClass.trim(),
        academicStatus: 'Mahasiswa',
        institution: 'Universitas Nasional',
        faculty: faculty?.trim() || 'FTKI',
        major: major?.trim() || 'Sistem Informasi',
        instagramProof: studentPortalProof || instagramProof || null,
        instagramHandle: instagramHandle || null,
        motivation: motivation || null,
        specialRequest: specialRequest || null,
        step1Completed: true,
        step2Completed: true,
        status: 'PENDING'
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

    console.log('✅ Registration created successfully:', registration.id)
    invalidateCurrentActivityCache()

    const responseData = {
      ...registration,
      studentPortalProof: (registration as any).studentPortalProof || registration.instagramProof
    }

    // Buat one-time token untuk mengizinkan akses ke /pendaftaran/selesai
    const successToken = Math.random().toString(36).substring(2) + Date.now().toString(36)

    const response = NextResponse.json({
      success: true,
      message: 'Registration submitted successfully!',
      data: responseData,
      token: successToken,
    }, { status: 201 })

    // Set cookie short-lived (60 detik) untuk mengizinkan akses ke /pendaftaran/selesai
    response.cookies.set('reg_success_token', successToken, {
      path: '/',
      maxAge: 60, // 60 detik saja
      httpOnly: false, // client-accessible agar bisa segera dikonsumsi/dihapus
      sameSite: 'lax',
    })

    return response

  } catch (error) {
    console.error('❌ Error creating registration:', error)
    
    // More detailed error handling
    let errorMessage = 'Failed to submit registration'
    let statusCode = 500
    
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
      
      // Check for specific database errors
      if (error.message.includes('Unique constraint')) {
        errorMessage = 'You have already registered for this activity'
        statusCode = 400
      } else if (error.message.includes('Foreign key constraint')) {
        errorMessage = 'Invalid activity reference'
        statusCode = 400
      } else if (error.message.includes('Required field')) {
        errorMessage = 'Missing required information'
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
}// GET /api/registrations - Ambil pendaftaran (untuk admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activityId = searchParams.get('activityId')
    const status = searchParams.get('status')

    const whereClause: Prisma.RegistrationWhereInput = {}
    
    if (activityId) {
      whereClause.activityId = activityId
    }
    
    if (status) {
      whereClause.status = status as RegistrationStatus
    }

    const registrations = await prisma.registration.findMany({
      where: whereClause,
      include: {
        activity: {
          select: {
            id: true,
            title: true,
            slug: true,
            startDate: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const mappedRegistrations = registrations.map((reg) => ({
      ...reg,
      studentPortalProof: (reg as any).studentPortalProof || reg.instagramProof,
    }))

    return NextResponse.json({
      success: true,
      registrations: mappedRegistrations,
    })
  } catch (error) {
    console.error('Error fetching registrations:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch registrations'
      },
      { status: 500 }
    )
  }
}