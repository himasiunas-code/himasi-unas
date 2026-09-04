import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { invalidateCurrentActivityCache } from '@/lib/activity'

// GET /api/activities/[id] - Get specific activity
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const activity = await prisma.activity.findUnique({
      where: {
        id: id
      },
      include: {
        registrations: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: { registrations: true }
        }
      }
    })

    if (!activity) {
      return NextResponse.json({
        success: false,
        message: 'Activity not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        ...activity,
        currentParticipants: activity._count.registrations
      }
    })
  } catch (error) {
    console.error('Error fetching activity:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch activity'
      },
      { status: 500 }
    )
  }
}

// PUT /api/activities/[id] - Update activity
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Check if activity exists
    const existingActivity = await prisma.activity.findUnique({
      where: { id: id }
    })

    if (!existingActivity) {
      return NextResponse.json({
        success: false,
        message: 'Activity not found'
      }, { status: 404 })
    }

    // Generate slug from title if title changed
    let slug = existingActivity.slug
    if (title !== existingActivity.title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-|-$/g, '')
    }

    const updatedActivity = await prisma.activity.update({
      where: {
        id: id
      },
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
      },
      include: {
        _count: {
          select: { registrations: true }
        }
      }
    })

    invalidateCurrentActivityCache()

    return NextResponse.json({
      success: true,
      data: {
        ...updatedActivity,
        currentParticipants: updatedActivity._count.registrations
      }
    })

  } catch (error) {
    console.error('Error updating activity:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update activity'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/activities/[id] - Delete activity
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if activity exists
    const existingActivity = await prisma.activity.findUnique({
      where: { id: id },
      include: {
        _count: {
          select: { registrations: true }
        }
      }
    })

    if (!existingActivity) {
      return NextResponse.json({
        success: false,
        message: 'Activity not found'
      }, { status: 404 })
    }

    // Delete the activity (registrations will be cascade deleted due to schema)
    await prisma.activity.delete({
      where: {
        id: id
      }
    })

    invalidateCurrentActivityCache()

    return NextResponse.json({
      success: true,
      message: `Activity "${existingActivity.title}" and ${existingActivity._count.registrations} registrations deleted successfully`
    })

  } catch (error) {
    console.error('Error deleting activity:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete activity'
      },
      { status: 500 }
    )
  }
}