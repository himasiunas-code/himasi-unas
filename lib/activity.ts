import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/cache'

export const CURRENT_ACTIVITY_CACHE_KEY = 'current-activity-data'

export interface CurrentActivityData {
  id: string
  title: string
  description: string
  image: string | null
  startDate: string
  endDate: string | null
  registrationOpen: boolean
  registrationStartDate: string | null
  registrationDeadline: string | null
  maxParticipants: number | null
  maxParticipantsMahasiswa: number | null
  maxParticipantsPelajar: number | null
  currentParticipants: number
  count2024: number
  count2025: number
  maxParticipants2024: number
  maxParticipants2025: number
  remaining2024: number
  remaining2025: number
  isFull2024: boolean
  isFull2025: boolean
  isOverallFull: boolean
  computedRegistrationOpen: boolean
  registrationStatus: {
    isAutoOpenTime: boolean
    isWithinDeadline: boolean
    manuallyOpen: boolean
    finalStatus: boolean
  }
}

/**
 * Mengambil data kegiatan aktif saat ini secara cepat dengan optimasi query dan cache
 */
export async function getCurrentActivityData(
  forceRefresh = false
): Promise<CurrentActivityData | null> {
  try {
    if (!forceRefresh) {
      const cached = cache.get<CurrentActivityData>(CURRENT_ACTIVITY_CACHE_KEY)
      if (cached) {
        return cached
      }
    }

    const activity = await prisma.activity.findFirst({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        startDate: true,
        endDate: true,
        registrationOpen: true,
        registrationStartDate: true,
        registrationDeadline: true,
        maxParticipants: true,
        maxParticipantsMahasiswa: true,
        maxParticipantsPelajar: true,
      },
    })

    if (!activity) {
      return null
    }

    // Ambil hitungan peserta dengan groupBy dalam 1 query cepat
    const groupCounts = await prisma.registration.groupBy({
      by: ['yearClass'],
      where: { activityId: activity.id },
      _count: { _all: true },
    })

    let totalCount = 0
    let count2024 = 0
    let count2025 = 0

    for (const item of groupCounts) {
      const count = item._count._all
      totalCount += count
      if (item.yearClass === '2024') count2024 += count
      if (item.yearClass === '2025') count2025 += count
    }

    const now = new Date()
    const isAutoOpenTime = activity.registrationStartDate
      ? now >= new Date(activity.registrationStartDate)
      : true
    const isWithinDeadline = activity.registrationDeadline
      ? now <= new Date(activity.registrationDeadline)
      : true
    const isRegistrationOpen =
      activity.registrationOpen || (isAutoOpenTime && isWithinDeadline)

    const max2024 =
      activity.maxParticipantsMahasiswa && activity.maxParticipantsMahasiswa > 0
        ? activity.maxParticipantsMahasiswa
        : 5
    const max2025 =
      activity.maxParticipantsPelajar && activity.maxParticipantsPelajar > 0
        ? activity.maxParticipantsPelajar
        : 5

    const effectiveTotalMax =
      activity.maxParticipants && activity.maxParticipants > 0
        ? activity.maxParticipants
        : max2024 + max2025

    const isFull2024 = count2024 >= max2024
    const isFull2025 = count2025 >= max2025
    const isTotalFull =
      activity.maxParticipants && activity.maxParticipants > 0
        ? totalCount >= activity.maxParticipants
        : false
    const isOverallFull = isTotalFull || (isFull2024 && isFull2025)

    const result: CurrentActivityData = {
      ...activity,
      startDate: activity.startDate.toISOString(),
      endDate: activity.endDate ? activity.endDate.toISOString() : null,
      registrationStartDate: activity.registrationStartDate
        ? activity.registrationStartDate.toISOString()
        : null,
      registrationDeadline: activity.registrationDeadline
        ? activity.registrationDeadline.toISOString()
        : null,
      currentParticipants: totalCount,
      maxParticipants: effectiveTotalMax,
      count2024,
      count2025,
      maxParticipants2024: max2024,
      maxParticipants2025: max2025,
      remaining2024: Math.max(0, max2024 - count2024),
      remaining2025: Math.max(0, max2025 - count2025),
      isFull2024,
      isFull2025,
      isOverallFull,
      computedRegistrationOpen: isRegistrationOpen && !isOverallFull,
      registrationStatus: {
        isAutoOpenTime,
        isWithinDeadline,
        manuallyOpen: activity.registrationOpen,
        finalStatus: isRegistrationOpen && !isOverallFull,
      },
    }

    // Simpan ke cache memory
    cache.set(CURRENT_ACTIVITY_CACHE_KEY, result, 15000)

    return result
  } catch (error) {
    console.error('Error in getCurrentActivityData:', error)
    return null
  }
}

/**
 * Hapus cache kegiatan terkini agar query berikutnya selalu fresh
 */
export function invalidateCurrentActivityCache(): void {
  cache.clear(CURRENT_ACTIVITY_CACHE_KEY)
}
