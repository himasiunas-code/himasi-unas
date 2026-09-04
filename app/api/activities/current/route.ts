import { NextResponse } from 'next/server'
import { getCurrentActivityData } from '@/lib/activity'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET /api/activities/current - Ambil kegiatan aktif saat ini
export async function GET() {
  try {
    const activity = await getCurrentActivityData()

    if (!activity) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No active activity found',
      })
    }

    return NextResponse.json({
      success: true,
      data: activity,
    })
  } catch (error) {
    console.error('❌ Error fetching current activity:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch current activity',
      },
      { status: 500 }
    )
  }
}