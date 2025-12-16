import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/cache'

// GET /api/activities/current - Ambil kegiatan aktif saat ini untuk halaman utama
export async function GET() {
  try {
    console.log('📥 Current activity API called')
    
    // Check cache dulu (TTL 30 detik)
    const CACHE_KEY = 'current-activity'
    const cached = cache.get(CACHE_KEY)
    
    if (cached) {
      console.log('✅ Returning cached activity data')
      return NextResponse.json({
        success: true,
        data: cached,
        cached: true
      })
    }
    
    // Ambil kegiatan yang paling terbaru dan published
    const activity = await prisma.activity.findFirst({
      where: {
        isPublished: true
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

    // Hitung peserta berdasarkan status akademik dengan query terpisah (lebih efisien)
    const [totalCount, mahasiswaCount, pelajarCount] = await Promise.all([
      prisma.registration.count({
        where: { activityId: activity.id }
      }),
      prisma.registration.count({
        where: { 
          activityId: activity.id,
          academicStatus: 'Mahasiswa'
        }
      }),
      prisma.registration.count({
        where: { 
          activityId: activity.id,
          academicStatus: 'Pelajar'
        }
      })
    ])

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
      currentParticipants: totalCount,
      maxParticipants: activity.maxParticipants,
      mahasiswaCount,
      maxMahasiswa: activity.maxParticipantsMahasiswa,
      pelajarCount,
      maxPelajar: activity.maxParticipantsPelajar
    })

    // Add currentParticipants field and computed registration status
    const activityWithCount = {
      ...activity,
      currentParticipants: totalCount,
      mahasiswaCount,
      pelajarCount,
      // Add computed fields for debugging
      computedRegistrationOpen: isRegistrationOpen,
      registrationStatus: {
        isAutoOpenTime,
        isWithinDeadline,
        manuallyOpen: activity.registrationOpen,
        finalStatus: isRegistrationOpen
      }
    }

    // Simpan ke cache (TTL 30 detik)
    cache.set(CACHE_KEY, activityWithCount, 30000)

    return NextResponse.json({
      success: true,
      data: activityWithCount,
      cached: false
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