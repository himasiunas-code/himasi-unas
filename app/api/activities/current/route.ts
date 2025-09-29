import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/activities/current - Ambil kegiatan aktif saat ini untuk halaman utama
export async function GET() {
  try {
    console.log('📥 Current activity API called')
    
    // Ambil kegiatan yang paling terbaru dan published
    const activity = await prisma.activity.findFirst({
      where: {
        isPublished: true
      },
      include: {
        _count: {
          select: { registrations: true }
        }
      },
      orderBy: {
        createdAt: 'desc'  // Yang paling baru dibuat
      }
    })

    if (!activity) {
      console.log('❌ No published activity found')
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No active activity found'
      })
    }

    // Check auto-open status based on registrationStartDate (same logic as registration API)
    const now = new Date()
    const isAutoOpenTime = activity.registrationStartDate ? now >= new Date(activity.registrationStartDate) : true
    const isWithinDeadline = activity.registrationDeadline ? now <= new Date(activity.registrationDeadline) : true
    const isRegistrationOpen = activity.registrationOpen || (isAutoOpenTime && isWithinDeadline)

    console.log('✅ Current activity status:', {
      id: activity.id,
      title: activity.title,
      registrationOpen: activity.registrationOpen,
      registrationStartDate: activity.registrationStartDate,
      registrationDeadline: activity.registrationDeadline,
      now: now.toISOString(),
      isAutoOpenTime,
      isWithinDeadline,
      finalRegistrationStatus: isRegistrationOpen,
      currentParticipants: activity._count.registrations,
      maxParticipants: activity.maxParticipants
    })

    // Add currentParticipants field and computed registration status
    const activityWithCount = {
      ...activity,
      currentParticipants: activity._count.registrations,
      // Add computed fields for debugging
      computedRegistrationOpen: isRegistrationOpen,
      registrationStatus: {
        isAutoOpenTime,
        isWithinDeadline,
        manuallyOpen: activity.registrationOpen,
        finalStatus: isRegistrationOpen
      }
    }

    return NextResponse.json({
      success: true,
      data: activityWithCount
    })
  } catch (error) {
    console.error('❌ Error fetching current activity:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch current activity'
      },
      { status: 500 }
    )
  }
}