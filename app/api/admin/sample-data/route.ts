import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    // Create sample activity first
    const activity = await prisma.activity.upsert({
      where: { slug: 'sample-event' },
      update: {},
      create: {
        title: 'Event Sample HIMASI',
        slug: 'sample-event',
        description: 'Event sample untuk testing statistik',
        content: 'Content event sample',
        startDate: new Date(),
        location: 'FTKI UNAS',
        registrationOpen: true,
        isPublished: true,
      }
    })

    // Create sample registrations
    const sampleData = [
      {
        email: 'mahasiswa1@email.com',
        fullName: 'Mahasiswa Satu',
        phone: '081234567890',
        npm: '202312345678',
        yearClass: '2023',
        faculty: 'Teknologi Komunikasi dan Informatika',
        major: 'Sistem Informasi',
        paymentMethod: 'bca',
        paymentProof: 'base64_sample_bca_proof',
        status: 'APPROVED' as const,
        motivation: 'Ingin belajar lebih dalam'
      },
      {
        email: 'mahasiswa2@email.com',
        fullName: 'Mahasiswa Dua',
        phone: '081234567891',
        npm: '202212345678',
        yearClass: '2022',
        faculty: 'Teknologi Komunikasi dan Informatika',
        major: 'Teknik Informatika',
        paymentMethod: 'dana',
        paymentProof: 'base64_sample_dana_proof',
        status: 'ATTENDED' as const,
        motivation: 'Tertarik dengan teknologi'
      },
      {
        email: 'mahasiswa3@email.com',
        fullName: 'Mahasiswa Tiga',
        phone: '081234567892',
        npm: '202112345678',
        yearClass: '2021',
        faculty: 'Ekonomi dan Bisnis',
        major: 'Manajemen',
        paymentMethod: 'bca',
        paymentProof: 'base64_sample_bca_proof_2',
        status: 'APPROVED' as const,
        motivation: 'Ingin mengembangkan skill'
      },
      {
        email: 'mahasiswa4@email.com',
        fullName: 'Mahasiswa Empat',
        phone: '081234567893',
        npm: '202012345678',
        yearClass: '2020',
        faculty: 'Hukum',
        major: 'Ilmu Hukum',
        status: 'PENDING' as const,
        motivation: 'Penasaran dengan acara ini'
      },
      {
        email: 'mahasiswa5@email.com',
        fullName: 'Mahasiswa Lima',
        phone: '081234567894',
        npm: '201912345678',
        yearClass: '2019',
        faculty: 'Teknologi Komunikasi dan Informatika',
        major: 'Sistem Informasi',
        paymentMethod: 'dana',
        paymentProof: 'base64_sample_dana_proof_2',
        status: 'ABSENT' as const,
        motivation: 'Ingin bergabung dengan komunitas'
      }
    ]

    // Clear existing sample data
    await prisma.registration.deleteMany({
      where: { activityId: activity.id }
    })

    // Insert sample registrations
    for (const data of sampleData) {
      await prisma.registration.create({
        data: {
          ...data,
          activityId: activity.id
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Sample data berhasil dibuat',
      activity: activity.id,
      registrations: sampleData.length
    })

  } catch (error) {
    console.error('Error creating sample data:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal membuat sample data'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}