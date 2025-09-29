import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/activities/current - Ambil kegiatan aktif saat ini untuk halaman utama
export async function GET() {
  try {
    // Ambil kegiatan yang paling terbaru dan published
    // TIDAK perlu registrationOpen: true karena halaman utama harus tetap show kegiatan
    const activity = await prisma.activity.findFirst({
      where: {
        isPublished: true
        // Hapus registrationOpen: true requirement
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
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No active activity found'
      })
    }

    // Add currentParticipants field
    const activityWithCount = {
      ...activity,
      currentParticipants: activity._count.registrations
    }

    return NextResponse.json({
      success: true,
      data: activityWithCount
    })
  } catch (error) {
    console.error('Error fetching current activity:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch current activity'
      },
      { status: 500 }
    )
  }
}