import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/registrations/cleanup - Cleanup incomplete registrations
export async function POST(request: NextRequest) {
  try {
    console.log('🧹 Registration cleanup API called')
    
    // Authorization check - hanya bisa dipanggil dengan API key atau oleh admin
    const authHeader = request.headers.get('authorization')
    const apiKey = process.env.CLEANUP_API_KEY || 'himasi-cleanup-2024'
    
    if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
      console.log('❌ Unauthorized cleanup attempt')
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Timeout untuk registrasi yang tidak selesai (default: 30 menit)
    const timeoutMinutes = 30
    const timeoutDate = new Date(Date.now() - timeoutMinutes * 60 * 1000)
    
    console.log(`🔍 Looking for incomplete registrations older than ${timeoutMinutes} minutes (before ${timeoutDate.toISOString()})`)
    
    // Cari registrasi yang step1Completed = true tapi step2Completed = false
    // dan sudah dibuat lebih dari timeout
    const incompleteRegistrations = await prisma.registration.findMany({
      where: {
        step1Completed: true,
        step2Completed: false,
        createdAt: {
          lt: timeoutDate
        }
      },
      include: {
        activity: {
          select: {
            title: true
          }
        }
      }
    })
    
    console.log(`🔍 Found ${incompleteRegistrations.length} incomplete registrations to cleanup`)
    
    if (incompleteRegistrations.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No incomplete registrations found to cleanup',
        data: {
          cleanedUp: 0,
          timeoutMinutes,
          cutoffTime: timeoutDate.toISOString()
        }
      })
    }
    
    // Delete registrasi yang tidak selesai
    const deleteResult = await prisma.registration.deleteMany({
      where: {
        id: {
          in: incompleteRegistrations.map(r => r.id)
        }
      }
    })
    
    console.log(`✅ Cleaned up ${deleteResult.count} incomplete registrations`)
    
    // Log detail registrasi yang dihapus
    console.log('📋 Cleaned up registrations:', incompleteRegistrations.map(r => ({
      id: r.id,
      email: r.email,
      fullName: r.fullName,
      activity: r.activity.title,
      createdAt: r.createdAt
    })))
    
    return NextResponse.json({
      success: true,
      message: `Successfully cleaned up ${deleteResult.count} incomplete registrations`,
      data: {
        cleanedUp: deleteResult.count,
        timeoutMinutes,
        cutoffTime: timeoutDate.toISOString(),
        details: incompleteRegistrations.map(r => ({
          id: r.id,
          email: r.email,
          fullName: r.fullName,
          activity: r.activity.title,
          createdAt: r.createdAt
        }))
      }
    })
    
  } catch (error) {
    console.error('❌ Error during registration cleanup:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to cleanup incomplete registrations',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    )
  }
}

// GET /api/registrations/cleanup - Check incomplete registrations (for monitoring)
export async function GET() {
  try {
    console.log('👀 Registration cleanup check API called')
    
    const timeoutMinutes = 30
    const timeoutDate = new Date(Date.now() - timeoutMinutes * 60 * 1000)
    
    // Cari registrasi yang tidak selesai
    const incompleteRegistrations = await prisma.registration.findMany({
      where: {
        step1Completed: true,
        step2Completed: false,
        createdAt: {
          lt: timeoutDate
        }
      },
      include: {
        activity: {
          select: {
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
    
    // Hitung juga yang masih dalam grace period
    const recentIncompleteRegistrations = await prisma.registration.findMany({
      where: {
        step1Completed: true,
        step2Completed: false,
        createdAt: {
          gte: timeoutDate
        }
      },
      include: {
        activity: {
          select: {
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json({
      success: true,
      data: {
        timeoutMinutes,
        cutoffTime: timeoutDate.toISOString(),
        expiredIncomplete: {
          count: incompleteRegistrations.length,
          registrations: incompleteRegistrations
        },
        recentIncomplete: {
          count: recentIncompleteRegistrations.length,
          registrations: recentIncompleteRegistrations
        }
      }
    })
    
  } catch (error) {
    console.error('❌ Error checking incomplete registrations:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to check incomplete registrations',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    )
  }
}