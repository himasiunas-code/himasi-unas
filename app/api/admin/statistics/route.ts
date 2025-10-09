import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Ambil semua data registrasi
    const registrations = await prisma.registration.findMany({
      select: {
        id: true,
        status: true,
        paymentMethod: true,
        paymentProof: true,
        faculty: true,
        yearClass: true,
        createdAt: true,
        updatedAt: true
      }
    })

    const totalRegistrations = registrations.length
    const registrationFee = 30000 // Rp 30.000 per pendaftar

    // Hitung statistik status
    const pendingRegistrations = registrations.filter(r => r.status === 'PENDING').length
    const approvedRegistrations = registrations.filter(r => r.status === 'APPROVED').length
    const rejectedRegistrations = registrations.filter(r => r.status === 'REJECTED').length
    
    // Hitung statistik kehadiran
    const attendedRegistrations = registrations.filter(r => r.status === 'ATTENDED').length
    const absentRegistrations = registrations.filter(r => r.status === 'ABSENT').length

    // Hitung statistik pembayaran
    const bcaPayments = registrations.filter(r => r.paymentMethod === 'bca' && r.paymentProof).length
    const danaPayments = registrations.filter(r => r.paymentMethod === 'dana' && r.paymentProof).length
    const unpaidRegistrations = registrations.filter(r => !r.paymentProof).length

    // Total pendapatan (hanya yang sudah bayar)
    const totalRevenue = (bcaPayments + danaPayments) * registrationFee

    // Statistik fakultas
    const facultyCount: { [key: string]: number } = {}
    registrations.forEach(r => {
      if (r.faculty) {
        facultyCount[r.faculty] = (facultyCount[r.faculty] || 0) + 1
      }
    })
    const facultyStats = Object.entries(facultyCount)
      .map(([faculty, count]) => ({ faculty, count }))
      .sort((a, b) => b.count - a.count)

    // Statistik angkatan
    const yearClassCount: { [key: string]: number } = {}
    registrations.forEach(r => {
      if (r.yearClass) {
        yearClassCount[r.yearClass] = (yearClassCount[r.yearClass] || 0) + 1
      }
    })
    const yearClassStats = Object.entries(yearClassCount)
      .map(([yearClass, count]) => ({ yearClass, count }))
      .sort((a, b) => parseInt(b.yearClass) - parseInt(a.yearClass))

    // Statistik pendapatan per bulan (untuk 6 bulan terakhir)
    const revenueByMonth = []
    const now = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      
      const monthRegistrations = registrations.filter(r => {
        const createdDate = new Date(r.createdAt)
        return createdDate >= monthDate && createdDate < nextMonthDate && r.paymentProof
      })

      const monthRevenue = monthRegistrations.length * registrationFee
      
      revenueByMonth.push({
        month: monthDate.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue,
        registrations: monthRegistrations.length
      })
    }

    // Aktivitas terbaru (10 terakhir)
    const recentActivity: Array<{
      id: string
      type: 'registration' | 'approval' | 'payment'
      message: string
      timestamp: string
    }> = []
    
    const sortedRegistrations = registrations
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)

    sortedRegistrations.forEach(reg => {
      let activityType: 'registration' | 'approval' | 'payment' = 'registration'
      let message = ''

      if (reg.paymentProof && reg.status === 'APPROVED') {
        activityType = 'approval'
        message = `Pendaftar ${reg.id.slice(-8)} telah disetujui dengan pembayaran ${reg.paymentMethod?.toUpperCase()}`
      } else if (reg.paymentProof) {
        activityType = 'payment'
        message = `Pembayaran ${reg.paymentMethod?.toUpperCase()} diterima dari pendaftar ${reg.id.slice(-8)}`
      } else {
        activityType = 'registration'
        message = `Pendaftar baru ${reg.id.slice(-8)} mendaftar`
      }

      recentActivity.push({
        id: reg.id,
        type: activityType,
        message,
        timestamp: reg.updatedAt.toISOString()
      })
    })

    const statistics = {
      totalRegistrations,
      totalRevenue,
      pendingRegistrations,
      approvedRegistrations,
      rejectedRegistrations,
      attendedRegistrations,
      absentRegistrations,
      paymentMethodStats: {
        bca: bcaPayments,
        dana: danaPayments,
        unpaid: unpaidRegistrations
      },
      revenueByMonth,
      facultyStats,
      yearClassStats,
      recentActivity
    }

    return NextResponse.json({
      success: true,
      statistics
    })

  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil data statistik'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}