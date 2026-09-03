import { CreditCard, Smartphone, Clock } from 'lucide-react'
import { formatCurrency } from './utils'
import { Statistics } from './types'

interface StatisticsPaymentMethodsProps {
  stats: Statistics
}

// Komponen rincian dan grafik persentase metode pembayaran pendaftaran
export default function StatisticsPaymentMethods({ stats }: StatisticsPaymentMethodsProps) {
  const bcaPercentage =
    stats.totalRegistrations > 0
      ? ((stats.paymentMethodStats.bca / stats.totalRegistrations) * 100).toFixed(1)
      : '0.0'
  const danaPercentage =
    stats.totalRegistrations > 0
      ? ((stats.paymentMethodStats.dana / stats.totalRegistrations) * 100).toFixed(1)
      : '0.0'

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <CreditCard className="w-5 h-5 mr-2 text-[#4B061A]" />
        Metode Pembayaran
      </h3>
      <div className="space-y-4">
        {/* BCA */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <CreditCard className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <span className="font-medium text-blue-900">Transfer BCA</span>
              <p className="text-xs text-blue-600">
                {formatCurrency(stats.paymentMethodStats.bca * 30000)}
              </p>
            </div>
          </div>
          <span className="text-xl font-bold text-blue-900">{stats.paymentMethodStats.bca}</span>
        </div>

        {/* DANA */}
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center">
            <Smartphone className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <span className="font-medium text-green-900">DANA E-wallet</span>
              <p className="text-xs text-green-600">
                {formatCurrency(stats.paymentMethodStats.dana * 30000)}
              </p>
            </div>
          </div>
          <span className="text-xl font-bold text-green-900">{stats.paymentMethodStats.dana}</span>
        </div>

        {/* Belum Bayar */}
        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-red-600 mr-3" />
            <div>
              <span className="font-medium text-red-900">Belum Bayar</span>
              <p className="text-xs text-red-600">
                Potensi: {formatCurrency(stats.paymentMethodStats.unpaid * 30000)}
              </p>
            </div>
          </div>
          <span className="text-xl font-bold text-red-900">{stats.paymentMethodStats.unpaid}</span>
        </div>
      </div>

      {/* Progress Bar Persentase */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>BCA</span>
            <span>{bcaPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${bcaPercentage}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-sm">
            <span>DANA</span>
            <span>{danaPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${danaPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
