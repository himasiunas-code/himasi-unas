// Definisi data statistik analytics dan keuangan kegiatan HIMASI
export interface Statistics {
  totalRegistrations: number
  totalRevenue: number
  pendingRegistrations: number
  approvedRegistrations: number
  rejectedRegistrations: number
  attendedRegistrations: number
  absentRegistrations: number
  paymentMethodStats: {
    bca: number
    dana: number
    unpaid: number
  }
  revenueByMonth: Array<{
    month: string
    revenue: number
    registrations: number
  }>
  facultyStats: Array<{
    faculty: string
    count: number
  }>
  yearClassStats: Array<{
    yearClass: string
    count: number
  }>
  recentActivity: Array<{
    id: string
    type: 'registration' | 'approval' | 'payment'
    message: string
    timestamp: string
  }>
}
