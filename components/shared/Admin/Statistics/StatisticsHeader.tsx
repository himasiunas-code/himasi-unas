import { RefreshCw, Download } from 'lucide-react'

interface StatisticsHeaderProps {
  onRefresh: () => void
  onExport: () => void
  refreshing: boolean
}

// Komponen header halaman statistik: judul, tombol refresh, dan ekspor laporan CSV
export default function StatisticsHeader({
  onRefresh,
  onExport,
  refreshing,
}: StatisticsHeaderProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistik & Analytics</h1>
          <p className="mt-2 text-gray-600">Dashboard analytics dan laporan keuangan HIMASI</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={onExport}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-linear-to-r from-[#4B061A] to-[#6B0B2A] hover:from-[#3A0514] hover:to-[#5A0B24] transition-all duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>
    </div>
  )
}
