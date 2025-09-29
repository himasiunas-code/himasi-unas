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
    if (!email || !fullName || !phone || !yearClass) {
      console.log('❌ Missing required fields:', { email: !!email, fullName: !!fullName, phone: !!phone, yearClass: !!yearClass })
      return NextResponse.json(
        {
          success: false,
          message: 'Email, nama lengkap, nomor HP, dan tahun angkatan wajib diisi'
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
    
    if (!activity.registrationOpen) {
      console.log('❌ Registration is closed')
      return NextResponse.json(
        {
          success: false,
          message: 'Registration is closed for this activity'
        },
        { status: 400 }
      )
    }

    // Cek deadline pendaftaran
    if (activity.registrationDeadline && new Date() > activity.registrationDeadline) {
      console.log('❌ Registration deadline passed:', activity.registrationDeadline)
      return NextResponse.json(
        {
          success: false,
          message: 'Registration deadline has passed'
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
            title: true,
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