import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma, RegistrationStatus } from '@prisma/client'

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
      faculty,
      major,
      instagramProof,
      instagramHandle,
      motivation,
      specialRequest
    } = body

    console.log('🔍 Validating required fields...')
    
    // Validasi required fields
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

    // Cek maksimal peserta
    if (activity.maxParticipants && activity._count.registrations >= activity.maxParticipants) {
      console.log('❌ Activity is full:', activity._count.registrations, '>=', activity.maxParticipants)
      return NextResponse.json(
        {
          success: false,
          message: 'Activity is full. Maximum participants reached.'
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
          message: 'You have already registered for this activity'
        },
        { status: 400 }
      )
    }

    console.log('✅ All checks passed, creating registration...')
    
    // Buat pendaftaran baru
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
        instagramProof,
        instagramHandle,
        motivation,
        specialRequest
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

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully!',
      data: registration
    }, { status: 201 })

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

    return NextResponse.json({
      success: true,
      registrations: registrations
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