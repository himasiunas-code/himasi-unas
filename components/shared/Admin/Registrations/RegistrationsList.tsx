import { Users } from 'lucide-react'
import { Registration } from './types'
import RegistrationCard from './RegistrationCard'

interface RegistrationsListProps {
  registrations: Registration[]
  actionLoading: string | null
  searchTerm: string
  statusFilter: string
  onImageClick: (src: string) => void
  onUpdateStatus: (id: string, status: string, reason?: string) => void
  onOpenRejectionModal: (id: string, fullName: string) => void
  onDelete: (id: string) => void
}

// Komponen daftar pendaftaran: menampilkan kumpulan kartu pendaftar atau pesan kosong
export default function RegistrationsList({
  registrations,
  actionLoading,
  searchTerm,
  statusFilter,
  onImageClick,
  onUpdateStatus,
  onOpenRejectionModal,
  onDelete,
}: RegistrationsListProps) {
  return (
    <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
      <div className="space-y-4 p-6">
        {registrations.map((registration, index) => (
          <RegistrationCard
            key={registration.id}
            registration={registration}
            index={index}
            actionLoading={actionLoading}
            onImageClick={onImageClick}
            onUpdateStatus={onUpdateStatus}
            onOpenRejectionModal={onOpenRejectionModal}
            onDelete={onDelete}
          />
        ))}

        {/* Tampilan jika data pendaftaran tidak ditemukan */}
        {registrations.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada pendaftaran</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter
                ? 'Tidak ada hasil yang sesuai dengan filter.'
                : 'Belum ada pendaftaran yang masuk.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
