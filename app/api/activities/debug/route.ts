import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/activities/debug - Debug endpoint untuk melihat semua kegiatan
export async function GET() {
  try {
    console.log('🔍 Debug activities API called')
    
    // Ambil semua kegiatan untuk debugging
    const allActivities = await prisma.activity.findMany({
      include: {
        _count: {
          select: { registrations: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('📋 All activities found:', allActivities.length)
    
    allActivities.forEach(activity => {
      console.log(`Activity: ${activity.title}`, {
        id: activity.id,
        isPublished: activity.isPublished,
        registrationOpen: activity.registrationOpen,
        startDate: activity.startDate,
        registrationStartDate: activity.registrationStartDate,
        registrationDeadline: activity.registrationDeadline,
        maxParticipants: activity.maxParticipants,
        currentRegistrations: activity._count.registrations,
        createdAt: activity.createdAt
      })
    })

    // Hitung statistik
    const publishedCount = allActivities.filter(a => a.isPublished).length
    const unpublishedCount = allActivities.filter(a => !a.isPublished).length
    const registrationOpenCount = allActivities.filter(a => a.registrationOpen).length

    return NextResponse.json({
      success: true,
      data: {
        total: allActivities.length,
        published: publishedCount,
        unpublished: unpublishedCount,
        registrationOpen: registrationOpenCount,
        activities: allActivities.map(activity => ({
          id: activity.id,
          title: activity.title,
          isPublished: activity.isPublished,
          registrationOpen: activity.registrationOpen,
          startDate: activity.startDate,
          registrationStartDate: activity.registrationStartDate,
          registrationDeadline: activity.registrationDeadline,
          maxParticipants: activity.maxParticipants,
          currentRegistrations: activity._count.registrations,
          createdAt: activity.createdAt,
          updatedAt: activity.updatedAt
        }))
      }
    })
  } catch (error) {
    console.error('❌ Error in debug activities:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch activities for debugging',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}