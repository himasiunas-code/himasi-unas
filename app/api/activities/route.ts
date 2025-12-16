import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/activities - Ambil semua kegiatan dengan option filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'public' or 'admin'
    const published = searchParams.get('published')

    const whereClause: { isPublished?: boolean } = {}

    // Untuk public API, hanya tampilkan yang published
    if (type === 'public') {
      whereClause.isPublished = true
    }

    // Filter berdasarkan published status
    if (published === 'true') {
      whereClause.isPublished = true
    } else if (published === 'false') {
      whereClause.isPublished = false
    }

    const activities = await prisma.activity.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { registrations: true }
        },
        registrations: {
          select: {
            academicStatus: true
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    })

    // Add currentParticipants field and count by status
    const activitiesWithCount = activities.map(activity => {
      const mahasiswaCount = activity.registrations.filter(r => r.academicStatus === 'Mahasiswa').length
      const pelajarCount = activity.registrations.filter(r => r.academicStatus === 'Pelajar').length
      
      return {
        ...activity,
        currentParticipants: activity._count.registrations,
        mahasiswaCount,
        pelajarCount
      }
    })

    return NextResponse.json({
      success: true,
      activities: activitiesWithCount
    })
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch activities'
      },
      { status: 500 }
    )
  }
}

// POST /api/activities - Buat kegiatan baru (untuk admin)
// OTOMATIS MENGHAPUS SEMUA KEGIATAN SEBELUMNYA
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      content,
      image,
      category,
      startDate,
      endDate,
      location,
      maxParticipants,
      maxParticipantsMahasiswa,
      maxParticipantsPelajar,
      registrationDeadline,
      registrationStartDate,
      requiresApproval,
      isPublished,
      registrationOpen
    } = body

    if (!title || !description || !startDate) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title, description, and startDate are required'
        },
        { status: 400 }
      )
    }

    // STEP 1: Hapus semua kegiatan sebelumnya beserta registrasinya
    console.log('Menghapus semua kegiatan sebelumnya...')
    
    // Hapus semua registrasi terlebih dahulu
    await prisma.registration.deleteMany({})
    console.log('Semua registrasi telah dihapus')
    
    // Kemudian hapus semua kegiatan
    await prisma.activity.deleteMany({})
    console.log('Semua kegiatan sebelumnya telah dihapus')

    // STEP 2: Generate slug dari title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-|-$/g, '')

    // STEP 3: Buat kegiatan baru
    const activity = await prisma.activity.create({
      data: {
        title,
        slug,
        description,
        content,
        image,
        category,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        maxParticipants: maxParticipants || null,
        maxParticipantsMahasiswa: maxParticipantsMahasiswa || null,
        maxParticipantsPelajar: maxParticipantsPelajar || null,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
        registrationStartDate: registrationStartDate ? new Date(registrationStartDate) : null,
        requiresApproval: requiresApproval || false,
        isPublished: isPublished || false,
        registrationOpen: registrationOpen || false
      }
    })

    console.log('Kegiatan baru berhasil dibuat:', activity.title)

    return NextResponse.json({
      success: true,
      data: activity,
      message: 'Kegiatan baru berhasil dibuat. Semua kegiatan sebelumnya telah dihapus.'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create activity'
      },
      { status: 500 }
    )
  }
}