import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { RegistrationStatus } from '@prisma/client'

// PATCH /api/admin/registrations/[id] - Update status pendaftaran
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, rejectedReason, approvedBy } = body

    // Validasi status
    if (!Object.values(RegistrationStatus).includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid status'
        },
        { status: 400 }
      )
    }

    // Update registration
    const updateData: any = {
      status,
      updatedAt: new Date()
    }

    if (status === RegistrationStatus.APPROVED) {
      updateData.approvedAt = new Date()
      updateData.approvedBy = approvedBy || 'Admin'
    }

    if (status === RegistrationStatus.REJECTED && rejectedReason) {
      updateData.rejectedReason = rejectedReason
    }

    const registration = await prisma.registration.update({
      where: { id },
      data: updateData,
      include: {
        activity: {
          select: {
            title: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: `Registration ${status.toLowerCase()} successfully`,
      data: registration
    })

  } catch (error) {
    console.error('Error updating registration:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update registration'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/registrations/[id] - Hapus pendaftaran
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.registration.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Registration deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting registration:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete registration'
      },
      { status: 500 }
    )
  }
}