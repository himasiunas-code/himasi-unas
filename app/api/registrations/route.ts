import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma, RegistrationStatus } from '@prisma/client'

// POST /api/registrations - Submit pendaftaran untuk kegiatan utama
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
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

    // Validasi required fields
    if (!email || !fullName || !phone || !yearClass) {
      return NextResponse.json(
        {
          success: false,
          message: 'email, fullName, phone, and yearClass are required'
        },
        { status: 400 }
      )
    }

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
      return NextResponse.json(
        {
          success: false,
          message: 'No active activity found'
        },
        { status: 404 }
      )
    }

    if (!activity.registrationOpen) {
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
      return NextResponse.json(
        {
          success: false,
          message: 'Activity is full. Maximum participants reached.'
        },
        { status: 400 }
      )
    }

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
      return NextResponse.json(
        {
          success: false,
          message: 'You have already registered for this activity'
        },
        { status: 400 }
      )
    }

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

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully!',
      data: registration
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating registration:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit registration'
      },
      { status: 500 }
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