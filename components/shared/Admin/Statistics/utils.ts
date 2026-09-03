import { Statistics } from './types'

// Format angka ke format mata uang Rupiah (IDR)
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

// Fungsi pembantu untuk mengunduh rekap statistik ke file CSV
export const exportStatisticsToCsv = (stats: Statistics) => {
  const reportData = {
    'Total Pendaftar': stats.totalRegistrations,
    'Total Pendapatan': formatCurrency(stats.totalRevenue),
    'Status Pending': stats.pendingRegistrations,
    'Status Approved': stats.approvedRegistrations,
    'Status Rejected': stats.rejectedRegistrations,
    Hadir: stats.attendedRegistrations,
    'Tidak Hadir': stats.absentRegistrations,
    'Pembayaran BCA': stats.paymentMethodStats.bca,
    'Pembayaran DANA': stats.paymentMethodStats.dana,
    'Belum Bayar': stats.paymentMethodStats.unpaid,
    'Tanggal Generate': new Date().toLocaleDateString('id-ID'),
  }

  const csvContent = Object.entries(reportData)
    .map(([key, value]) => `${key},${value}`)
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute(
    'download',
    `statistics_report_${new Date().toISOString().split('T')[0]}.csv`
  )
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
