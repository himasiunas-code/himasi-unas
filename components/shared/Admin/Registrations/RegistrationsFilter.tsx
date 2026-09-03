import { Search } from 'lucide-react'
import { statusOptions } from './types'

interface RegistrationsFilterProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  filteredCount: number
  totalCount: number
}

// Komponen pencarian dan filter status pendaftaran
export default function RegistrationsFilter({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  filteredCount,
  totalCount,
}: RegistrationsFilterProps) {
  return (
    <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6 mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Input pencarian */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
            <input
              type="text"
              placeholder="Cari nama, email, atau kegiatan..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4B061A] focus:border-[#4B061A] transition-all duration-200"
            />
          </div>
        </div>

        {/* Dropdown pilihan status */}
        <div className="sm:w-48 text-black">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4B061A] focus:border-[#4B061A] transition-all duration-200"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ringkasan jumlah hasil pencarian */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Menampilkan <span className="font-semibold text-gray-900">{filteredCount}</span> dari{' '}
          <span className="font-semibold text-gray-900">{totalCount}</span> pendaftaran
        </div>
        <div className="hidden sm:block text-xs text-gray-400">
          Update terakhir: {new Date().toLocaleTimeString('id-ID')}
        </div>
      </div>
    </div>
  )
}
