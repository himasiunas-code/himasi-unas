import { RefreshCw, Eye, Download } from 'lucide-react'

interface RegistrationsHeaderProps {
  onRefresh: () => void
  onOpenPreview: () => void
  onExportExcel: () => void
}

// Komponen header panel kelola pendaftaran: judul, deskripsi, dan tombol aksi ekspor/preview
export default function RegistrationsHeader({
  onRefresh,
  onOpenPreview,
  onExportExcel,
}: RegistrationsHeaderProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Pendaftaran</h1>
          <p className="mt-2 text-gray-600">Lihat dan kelola semua pendaftaran kegiatan HIMASI</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={onRefresh}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={onOpenPreview}
            className="inline-flex items-center px-4 py-2 border border-[#4B061A] rounded-lg shadow-sm text-sm font-medium text-[#4B061A] bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <Eye className="w-4 h-4 mr-2" />
            Lihat Data
          </button>
          <button
            onClick={onExportExcel}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-linear-to-r from-[#4B061A] to-[#6B0B2A] hover:from-[#3A0514] hover:to-[#5A0B24] transition-all duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </button>
        </div>
      </div>
    </div>
  )
}
