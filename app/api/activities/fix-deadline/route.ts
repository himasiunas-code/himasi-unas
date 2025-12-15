import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/activities/fix-deadline - Update all registration deadlines to end of day (23:59:59)
export async function POST() {
  try {
    console.log('🔧 Fixing registration deadlines to 23:59:59...')
    
    // Find all activities with registration deadline
    const activities = await prisma.activity.findMany({
      where: {
        registrationDeadline: {
          not: null
        }
      },
      select: {
        id: true,
        title: true,
        registrationDeadline: true
      }
    })

    console.log(`📋 Found ${activities.length} activities with deadlines`)

    const updates = []
    
    for (const activity of activities) {
      if (!activity.registrationDeadline) continue
      
      const deadline = new Date(activity.registrationDeadline)
      
      // Set time to 23:59:59
      deadline.setHours(23, 59, 59, 999)
      
      console.log(`📅 Updating ${activity.title}: ${activity.registrationDeadline} → ${deadline.toISOString()}`)
      
      await prisma.activity.update({
        where: { id: activity.id },
        data: {
          registrationDeadline: deadline
        }
      })
      
      updates.push({
        id: activity.id,
        title: activity.title,
        oldDeadline: activity.registrationDeadline,
        newDeadline: deadline.toISOString()
      })
    }

    console.log('✅ All deadlines updated successfully')

    return NextResponse.json({
      success: true,
      message: `Updated ${updates.length} activity deadlines to 23:59:59`,
      updates
    })
  } catch (error) {
    console.error('❌ Error fixing deadlines:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fix deadlines'
      },
      { status: 500 }
    )
  }
}
