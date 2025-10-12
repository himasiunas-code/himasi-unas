import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { RegistrationStatus, Prisma } from '@prisma/client'
import { EmailService } from '@/lib/email-service'

// PATCH /api/admin/registrations/[id] - Update status pendaftaran
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, reason, approvedBy } = body

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
    const updateData: Prisma.RegistrationUpdateInput = {
      status,
      updatedAt: new Date()
    }

    if (status === RegistrationStatus.APPROVED) {
      updateData.approvedAt = new Date()
      updateData.approvedBy = approvedBy || 'Admin'
    }

    if (status === RegistrationStatus.REJECTED && reason) {
      updateData.rejectedReason = reason
    }

    const registration = await prisma.registration.update({
      where: { id },
      data: updateData,
      include: {
        activity: {
          select: {
            title: true,
            slug: true,
            startDate: true,
            location: true
          }
        }
      }
    })

    // Kirim email setelah update berhasil
    try {
      const emailService = new EmailService()
      
      const emailData = {
        fullName: registration.fullName,
        email: registration.email,
        activityTitle: registration.activity.title,
        activitySlug: registration.activity.slug,
        activityStartDate: new Date(registration.activity.startDate).toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        activityLocation: registration.activity.location || undefined,
        reason: registration.rejectedReason || undefined
      }

      if (status === RegistrationStatus.APPROVED) {
        await emailService.sendApprovalEmail(emailData)
        console.log(`Approval email sent to ${registration.email}`)
      } else if (status === RegistrationStatus.REJECTED) {
        await emailService.sendRejectionEmail(emailData)
        console.log(`Rejection email sent to ${registration.email}`)
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Jangan sampai error email menggagalkan update status
    }

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