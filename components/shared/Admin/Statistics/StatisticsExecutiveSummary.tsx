import { TrendingUp } from 'lucide-react'
import { formatCurrency } from './utils'
import { Statistics } from './types'

interface StatisticsExecutiveSummaryProps {
  stats: Statistics
}

// Komponen kartu ringkasan eksekutif untuk pimpinan / pengurus harian HIMASI
export default function StatisticsExecutiveSummary({ stats }: StatisticsExecutiveSummaryProps) {
  const conversionRate =
    stats.totalRegistrations > 0
      ? (stats.approvedRegistrations / stats.totalRegistrations) * 100
      : 0

  const popularPayment =
    stats.paymentMethodStats.bca > stats.paymentMethodStats.dana ? 'BCA' : 'DANA'

  return (
    <div className="bg-linear-to-br from-[#4B061A] to-[#6B0B2A] rounded-xl shadow-sm p-6 text-white">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2" />
        Ringkasan Executive
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="opacity-90">Total pendaftar:</p>
          <p className="text-xl font-bold">{stats.totalRegistrations} orang</p>
        </div>
        <div>
          <p className="opacity-90">Pendapatan terkonfirmasi:</p>
          <p className="text-xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
        </div>
        <div>
          <p className="opacity-90">Tingkat konversi:</p>
          <p className="text-xl font-bold">{conversionRate.toFixed(1)}%</p>
        </div>
        <div>
          <p className="opacity-90">Metode pembayaran terpopuler:</p>
          <p className="text-xl font-bold">{popularPayment}</p>
        </div>
      </div>
    </div>
  )
}
