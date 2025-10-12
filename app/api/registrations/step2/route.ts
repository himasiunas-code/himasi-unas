import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/registrations/step2 - Update sesi 2: Instagram + info tambahan
export async function PUT(request: NextRequest) {
  try {
    console.log('📥 Step 2 Registration API called')
    
    const body = await request.json()
    console.log('📦 Step 2 Request body received:', {
      ...body,
      instagramProof: body.instagramProof ? `Data URL (${body.instagramProof.length} chars)` : null
    })
    
    const {
      registrationId,
      instagramHandle,
      instagramProof,
      motivation,
      specialRequest,
      paymentMethod,
      paymentProof
    } = body

    console.log('🔍 Validating step 2 data...')
    
    // Validasi required fields untuk sesi 2
    if (!registrationId) {
      console.log('❌ Missing registration ID')
      return NextResponse.json(
        {
          success: false,
          message: 'Registration ID tidak ditemukan'
        },
        { status: 400 }
      )
    }

    // Validasi payment method
    if (!paymentMethod) {
      console.log('❌ Missing payment method')
      return NextResponse.json(
        {
          success: false,
          message: 'Metode pembayaran harus dipilih'
        },
        { status: 400 }
      )
    }

    if (!['bca', 'dana'].includes(paymentMethod)) {
      console.log('❌ Invalid payment method:', paymentMethod)
      return NextResponse.json(
        {
          success: false,
          message: 'Metode pembayaran tidak valid'
        },
        { status: 400 }
      )
    }

    // Validasi payment proof
    if (!paymentProof) {
      console.log('❌ Missing payment proof')
      return NextResponse.json(
        {
          success: false,
          message: 'Bukti pembayaran harus diupload'
        },
        { status: 400 }
      )
    }

    if (typeof paymentProof === 'string' && !paymentProof.startsWith('data:image/')) {
      console.log('❌ Invalid payment proof format')
      return NextResponse.json(
        {
          success: false,
          message: 'Format bukti pembayaran tidak valid'
        },
        { status: 400 }
      )
    }

    // Validasi instagram proof jika ada
    if (instagramProof && typeof instagramProof === 'string') {
      // Check if it's a valid data URL
      if (!instagramProof.startsWith('data:image/')) {
        console.log('❌ Invalid instagram proof format')
        return NextResponse.json(
          {
            success: false,
            message: 'Format bukti follow Instagram tidak valid'
          },
          { status: 400 }
        )
      }
      
      // Check size of base64 data (roughly 25MB limit in base64)
      if (instagramProof.length > 33554432) { // 32MB in characters
        console.log('❌ Instagram proof too large:', instagramProof.length)
        return NextResponse.json(
          {
            success: false,
            message: 'Gambar bukti follow Instagram terlalu besar. Kompres gambar terlebih dahulu.'
          },
          { status: 400 }
        )
      }
    }

    // Validasi payment proof size (500KB limit)
    if (paymentProof && typeof paymentProof === 'string') {
      // Rough calculation: base64 is ~33% larger than original, so 500KB = ~666KB base64
      const maxBase64Size = 683000; // ~500KB in base64
      if (paymentProof.length > maxBase64Size) {
        console.log('❌ Payment proof too large:', paymentProof.length)
        return NextResponse.json(
          {
            success: false,
            message: 'Bukti pembayaran terlalu besar. Maksimal 500KB.'
          },
          { status: 400 }
        )
      }
    }

    console.log('🔍 Finding existing registration...')
    
    // Cari registrasi yang sudah ada berdasarkan ID
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        id: registrationId
      },
      include: {
        activity: {
          select: {
            id: true,
            title: true,
            startDate: true,
            location: true,
            maxParticipants: true,
            registrationOpen: true,
            registrationStartDate: true,
            registrationDeadline: true,
            _count: {
              select: { registrations: true }
            }
          }
        }
      }
    })

    if (!existingRegistration) {
      console.log('❌ Registration not found:', registrationId)
      return NextResponse.json(
        {
          success: false,
          message: 'Data pendaftaran tidak ditemukan. Silakan mulai ulang dari sesi 1.'
        },
        { status: 404 }
      )
    }

    console.log('✅ Found existing registration:', {
      id: existingRegistration.id,
      fullName: existingRegistration.fullName,
      email: existingRegistration.email,
      currentStatus: existingRegistration.status
    })

    // Validasi bahwa registration dalam status yang benar untuk step 2
    const step1Completed = existingRegistration.step1Completed
    const step2Completed = existingRegistration.step2Completed
    
    if (!step1Completed || step2Completed) {
      console.log('❌ Invalid registration step status for step 2:', {
        step1Completed,
        step2Completed
      })
      return NextResponse.json(
        {
          success: false,
          message: step2Completed 
            ? 'Pendaftaran Anda sudah selesai sebelumnya.' 
            : 'Step 1 belum diselesaikan. Silakan mulai ulang dari sesi 1.'
        },
        { status: 400 }
      )
    }

    const activity = existingRegistration.activity
    if (!activity) {
      console.log('❌ Activity not found for registration:', registrationId)
      return NextResponse.json(
        {
          success: false,
          message: 'Kegiatan tidak ditemukan'
        },
        { status: 404 }
      )
    }

    console.log('🔍 Double-checking activity and slot availability for step 2...')
    
    // Double-check apakah kegiatan masih terbuka dan ada slot
    const now = new Date()
    const isAutoOpenTime = activity.registrationStartDate ? now >= new Date(activity.registrationStartDate) : true
    const isWithinDeadline = activity.registrationDeadline ? now <= new Date(activity.registrationDeadline) : true
    const isRegistrationOpen = activity.registrationOpen || (isAutoOpenTime && isWithinDeadline)
    
    console.log('📅 Step 2 time check:', {
      now: now.toISOString(),
      registrationStartDate: activity.registrationStartDate,
      registrationDeadline: activity.registrationDeadline,
      isAutoOpenTime,
      isWithinDeadline,
      manuallyOpen: activity.registrationOpen,
      finalStatus: isRegistrationOpen
    })
    
    if (!isRegistrationOpen) {
      console.log('❌ Registration is closed during step 2')
      return NextResponse.json(
        {
          success: false,
          message: 'Pendaftaran untuk kegiatan ini sudah ditutup. Tidak dapat menyelesaikan pendaftaran.'
        },
        { status: 400 }
      )
    }

    // Additional deadline check
    if (activity.registrationDeadline && now > new Date(activity.registrationDeadline)) {
      console.log('❌ Registration deadline passed during step 2:', activity.registrationDeadline)
      const deadlineDate = new Date(activity.registrationDeadline).toLocaleDateString('id-ID')
      return NextResponse.json(
        {
          success: false,
          message: `Batas waktu pendaftaran sudah berakhir pada ${deadlineDate}. Tidak dapat menyelesaikan pendaftaran.`
        },
        { status: 400 }
      )
    }

    console.log('✅ Activity still open, updating registration with step 2 data using transaction...')
    
    // Update registrasi dengan data sesi 2 menggunakan transaction untuk final validation
    const updatedRegistration = await prisma.$transaction(async (tx) => {
      console.log('🔒 Starting step 2 transaction...')
      
      // Final recheck untuk memastikan registration masih valid
      const finalRegistrationCheck = await tx.registration.findUnique({
        where: { id: registrationId },
        include: {
          activity: {
            select: {
              id: true,
              startDate: true,
              _count: { select: { registrations: true } }
            }
          }
        }
      })

      const finalStep1Completed = finalRegistrationCheck?.step1Completed
      const finalStep2Completed = finalRegistrationCheck?.step2Completed

      if (!finalRegistrationCheck || !finalStep1Completed || finalStep2Completed) {
        console.log('❌ Registration status changed during step 2:', {
          found: !!finalRegistrationCheck,
          step1Completed: finalStep1Completed,
          step2Completed: finalStep2Completed
        })
        throw new Error('INVALID_STATUS')
      }

      // Final check untuk event yang sudah dimulai
      const eventStartTime = new Date(finalRegistrationCheck.activity.startDate).getTime()
      if (now.getTime() > eventStartTime) {
        console.log('❌ Event already started during step 2')
        throw new Error('EVENT_STARTED')
      }

      console.log('✅ Final validations passed, updating registration...')
      
      // Update dengan data step 2
      const updated = await tx.registration.update({
        where: {
          id: registrationId
        },
        data: {
          instagramHandle,
          instagramProof,
          motivation: motivation || null,
          specialRequest: specialRequest || null,
          paymentMethod,
          paymentProof,
          // Step 2 sudah selesai
          step2Completed: true,
          // Status PENDING menandakan pendaftaran lengkap dan menunggu approval
          status: 'PENDING',
          updatedAt: new Date()
        },
        include: {
          activity: {
            select: {
              title: true,
              startDate: true,
              location: true
            }
          }
        }
      })

      console.log('✅ Registration updated successfully in step 2 transaction:', updated.id)
      return updated
    })

    console.log('✅ Step 2 Registration completed successfully:', updatedRegistration.id)

    return NextResponse.json({
      success: true,
      message: `Pendaftaran berhasil diselesaikan! Terima kasih ${updatedRegistration.fullName}, data lengkap Anda sudah tersimpan dan menunggu persetujuan admin.`,
      data: {
        registrationId: updatedRegistration.id,
        fullName: updatedRegistration.fullName,
        email: updatedRegistration.email,
        activity: updatedRegistration.activity?.title || 'Unknown Activity',
        status: updatedRegistration.status,
        completedSteps: 2
      }
    }, { status: 200 })

  } catch (error) {
    console.error('❌ Error completing step 2 registration:', error)
    
    let errorMessage = 'Gagal menyelesaikan pendaftaran sesi 2'
    let statusCode = 500
    
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
      
      // Handle transaction-specific errors
      if (error.message === 'INVALID_STATUS') {
        errorMessage = 'Status pendaftaran tidak valid. Mungkin Step 1 belum diselesaikan atau Step 2 sudah pernah diselesaikan.'
        statusCode = 400
      } else if (error.message === 'EVENT_STARTED') {
        errorMessage = 'Kegiatan sudah dimulai. Tidak dapat menyelesaikan pendaftaran.'
        statusCode = 400
      } else if (error.message.includes('Record to update not found')) {
        errorMessage = 'Data pendaftaran tidak ditemukan'
        statusCode = 404
      } else if (error.message.includes('Foreign key constraint')) {
        errorMessage = 'Referensi kegiatan tidak valid'
        statusCode = 400
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: statusCode }
    )
  }
}