import Image from 'next/image'
import { Check, X, Eye, Trash2, User } from 'lucide-react'
import { Registration } from './types'

interface RegistrationCardProps {
  registration: Registration
  index: number
  actionLoading: string | null
  onImageClick: (src: string) => void
  onUpdateStatus: (id: string, status: string, reason?: string) => void
  onOpenRejectionModal: (id: string, fullName: string) => void
  onDelete: (id: string) => void
}

// Helper penentu warna badge status pendaftaran
export const getRegistrationStatusColor = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return 'bg-green-100 text-green-800'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'REJECTED':
      return 'bg-red-100 text-red-800'
    case 'ATTENDED':
      return 'bg-blue-100 text-blue-800'
    case 'ABSENT':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Komponen kartu informasi pendaftar kegiatan beserta aksi verifikasinya
export default function RegistrationCard({
  registration,
  index,
  actionLoading,
  onImageClick,
  onUpdateStatus,
  onOpenRejectionModal,
  onDelete,
}: RegistrationCardProps) {
  const isLoading = actionLoading === registration.id

  return (
    <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Kolom Kiri: Informasi Utama Pendaftar */}
        <div className="flex-1 space-y-4">
          {/* Nomor Urut Pendaftar */}
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-[#4B061A] text-white text-sm font-bold">
              {index + 1}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              Pendaftar #{index + 1}
            </span>
          </div>

          {/* Bagian Foto Bukti dan Data Personal */}
          <div className="flex items-start gap-4">
            {/* Bukti Portal Mahasiswa */}
            <div className="shrink-0">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1 font-medium">Bukti Portal</div>
                {registration.studentPortalProof || registration.instagramProof ? (
                  <div className="relative group">
                    <Image
                      src={(registration.studentPortalProof || registration.instagramProof)!}
                      alt={`Bukti portal mahasiswa ${registration.fullName}`}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-lg object-cover border-2 border-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                      onClick={() => onImageClick((registration.studentPortalProof || registration.instagramProof)!)}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const sibling = e.currentTarget.nextElementSibling as HTMLElement
                        if (sibling) sibling.style.display = 'flex'
                      }}
                    />
                    <div className="hidden h-16 w-16 rounded-lg bg-gray-300 items-center justify-center border-2 border-gray-200">
                      <User className="h-8 w-8 text-gray-500" />
                    </div>
                    {/* Overlay saat hover */}
                    <div
                      className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 cursor-pointer"
                      onClick={() => onImageClick((registration.studentPortalProof || registration.instagramProof)!)}
                    >
                      <Eye className="h-4 w-4 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-gray-300 flex items-center justify-center border-2 border-gray-200">
                    <User className="h-8 w-8 text-gray-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Informasi Biodata Pendaftar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {registration.fullName}
                  </h3>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm text-gray-600">{registration.phone}</p>
                    {registration.npm && (
                      <p className="text-sm text-gray-600">NPM: {registration.npm}</p>
                    )}
                    {registration.yearClass && (
                      <p className="text-sm font-semibold text-[#4B061A]">
                        Angkatan: {registration.yearClass}
                      </p>
                    )}
                    {registration.email && (
                      <p className="text-xs text-gray-400">{registration.email}</p>
                    )}
                  </div>
                </div>

                {/* Badge Status */}
                <div className="shrink-0 ml-4">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRegistrationStatusColor(
                      registration.status
                    )}`}
                  >
                    {registration.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rincian Tambahan: Kegiatan dan Bukti Portal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            {/* Info Kegiatan */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Kegiatan</h4>
              <p className="text-sm text-gray-900 font-medium">{registration.activity.title}</p>
            </div>

            {/* Info Bukti Portal Mahasiswa */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Portal Mahasiswa</h4>
              {registration.studentPortalProof || registration.instagramProof ? (
                <p className="text-xs text-green-600 flex items-center">
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Bukti portal mahasiswa sudah diupload
                </p>
              ) : (
                <p className="text-xs text-red-600 flex items-center">
                  <X className="w-3.5 h-3.5 mr-1" />
                  Bukti portal mahasiswa belum diupload
                </p>
              )}
            </div>

            {/* Waktu Pendaftaran */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Waktu Pendaftaran</h4>
              <div className="text-sm text-gray-900">
                <div>
                  {new Date(registration.createdAt).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <div className="text-gray-600">
                  Pukul{' '}
                  {new Date(registration.createdAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}{' '}
                  WIB
                </div>
              </div>
            </div>

            {/* Terakhir Diupdate */}
            {registration.updatedAt !== registration.createdAt && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Terakhir Diupdate</h4>
                <div className="text-sm text-gray-900">
                  <div>{new Date(registration.updatedAt).toLocaleDateString('id-ID')}</div>
                  <div className="text-gray-600">
                    Pukul{' '}
                    {new Date(registration.updatedAt).toLocaleTimeString('id-ID')}{' '}
                    WIB
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Alasan Penolakan Jika Berstatus REJECTED */}
          {registration.rejectedReason && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-red-700 mb-2">Alasan Penolakan</h4>
              <p className="text-sm text-red-900 bg-red-50 p-3 rounded-md border border-red-200">
                {registration.rejectedReason}
              </p>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Tombol Aksi Verifikasi */}
        <div className="flex lg:flex-col gap-2 lg:items-end">
          {registration.status === 'PENDING' && (
            <div className="flex gap-2">
              <button
                onClick={() => onUpdateStatus(registration.id, 'APPROVED')}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Approve"
              >
                <Check className="w-4 h-4 mr-1" />
                Setujui
              </button>
              <button
                onClick={() => onOpenRejectionModal(registration.id, registration.fullName)}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Reject"
              >
                <X className="w-4 h-4 mr-1" />
                Tolak
              </button>
            </div>
          )}

          {registration.status === 'APPROVED' && (
            <div className="flex gap-2">
              <button
                onClick={() => onUpdateStatus(registration.id, 'ATTENDED')}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Mark as Attended"
              >
                <Check className="w-4 h-4 mr-1" />
                Hadir
              </button>
              <button
                onClick={() => onUpdateStatus(registration.id, 'ABSENT')}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Mark as Absent"
              >
                <X className="w-4 h-4 mr-1" />
                Tidak Hadir
              </button>
            </div>
          )}

          <button
            onClick={() => onDelete(registration.id)}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-2 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Delete"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
            ) : (
              <Trash2 className="w-4 h-4 mr-1" />
            )}
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}
