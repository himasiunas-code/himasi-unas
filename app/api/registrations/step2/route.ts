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
            title: true,
            startDate: true,
            location: true
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

    console.log('✅ Updating registration with step 2 data...')
    
    // Update registrasi dengan data sesi 2
    const updatedRegistration = await prisma.registration.update({
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
        // Status tetap PENDING tapi sekarang lengkap
        status: 'PENDING'
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
      
      if (error.message.includes('Record to update not found')) {
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