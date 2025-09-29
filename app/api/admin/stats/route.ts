import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/stats - Mendapatkan statistik untuk dashboard admin
export async function GET() {
  try {
    // Total activities
    const totalActivities = await prisma.activity.count()
    const publishedActivities = await prisma.activity.count({
      where: { isPublished: true }
    })

    // Total registrations
    const totalRegistrations = await prisma.registration.count()
    
    // Registration by status
    const registrationsByStatus = await prisma.registration.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    })

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentRegistrations = await prisma.registration.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    })

    // Registration trend (last 30 days, grouped by day)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const registrationTrend = await prisma.registration.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Group by date
    const trendData = registrationTrend.reduce((acc: { [key: string]: number }, reg) => {
      const date = reg.createdAt.toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    // Top activities by registration count
    const topActivities = await prisma.activity.findMany({
      include: {
        _count: {
          select: { registrations: true }
        }
      },
      orderBy: {
        registrations: {
          _count: 'desc'
        }
      },
      take: 5
    })

    // Recent registrations with activity info
    const latestRegistrations = await prisma.registration.findMany({
      include: {
        activity: {
          select: {
            title: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    const stats = {
      overview: {
        totalActivities,
        publishedActivities,
        totalRegistrations,
        recentRegistrations
      },
      registrationsByStatus: registrationsByStatus.map(item => ({
        status: item.status,
        count: item._count.id
      })),
      registrationTrend: Object.entries(trendData).map(([date, count]) => ({
        date,
        count
      })),
      topActivities: topActivities.map(activity => ({
        id: activity.id,
        title: activity.title,
        slug: activity.slug,
        registrationCount: activity._count.registrations,
        maxParticipants: activity.maxParticipants,
        registrationOpen: activity.registrationOpen
      })),
      latestRegistrations: latestRegistrations.map(reg => ({
        id: reg.id,
        fullName: reg.fullName,
        email: reg.email,
        status: reg.status,
        createdAt: reg.createdAt,
        activityTitle: reg.activity.title,
        activitySlug: reg.activity.slug
      }))
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch statistics'
      },
      { status: 500 }
    )
  }
}