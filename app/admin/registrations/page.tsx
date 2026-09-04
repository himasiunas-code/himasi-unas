'use client'

import { useEffect, useState } from 'react'
import {
  Registration,
  RejectionModalState,
  RegistrationsHeader,
  RegistrationsFilter,
  RegistrationsList,
  ImagePreviewModal,
  RejectionModal,
  DataPreviewModal,
  exportRegistrationsToExcel,
} from '@/components/shared/Admin/Registrations'
import { DashboardLoading } from '@/components/shared/Admin/Dashboard'

// Halaman utama Kelola Pendaftaran Admin HIMASI UNAS
export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [rejectionModal, setRejectionModal] = useState<RejectionModalState>({
    isOpen: false,
    registrationId: '',
    fullName: '',
  })
  const [rejectionReason, setRejectionReason] = useState('')

  // Event listener tombol ESC untuk menutup semua modal yang sedang aktif
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (rejectionModal.isOpen) {
          closeRejectionModal()
        } else if (selectedImage) {
          setSelectedImage(null)
        } else if (showPreview) {
          setShowPreview(false)
        }
      }
    }

    if (selectedImage || rejectionModal.isOpen || showPreview) {
      document.addEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [selectedImage, rejectionModal.isOpen, showPreview])

  // Muat data pendaftaran saat komponen pertama kali dibuka
  useEffect(() => {
    fetchRegistrations()
  }, [])

  // Fungsi pengambil seluruh data pendaftaran dari API
  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/registrations')
      if (response.ok) {
        const data = await response.json()
        setRegistrations(data.registrations || [])
      }
    } catch (error) {
      console.error('Error fetching registrations:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fungsi pembaruan status pendaftaran (Approved, Rejected, Attended, Absent)
  const updateRegistrationStatus = async (id: string, status: string, reason?: string) => {
    setActionLoading(id)
    try {
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, reason }),
      })

      if (response.ok) {
        await fetchRegistrations()
        if (status === 'APPROVED') {
          alert('Pendaftaran disetujui dan email persetujuan telah dikirim!')
        } else if (status === 'REJECTED') {
          alert('Pendaftaran ditolak dan email pemberitahuan telah dikirim!')
        }
      } else {
        alert('Gagal mengupdate status')
      }
    } catch (error) {
      console.error('Error updating registration:', error)
      alert('Terjadi error saat mengupdate status')
    } finally {
      setActionLoading(null)
    }
  }

  // Membuka modal input penolakan pendaftaran
  const openRejectionModal = (id: string, fullName: string) => {
    setRejectionModal({
      isOpen: true,
      registrationId: id,
      fullName,
    })
    setRejectionReason('')
  }

  // Menutup modal penolakan pendaftaran
  const closeRejectionModal = () => {
    setRejectionModal({
      isOpen: false,
      registrationId: '',
      fullName: '',
    })
    setRejectionReason('')
  }

  // Mengirim aksi tolak pendaftaran disertai alasan ke API
  const handleRejectWithReason = async () => {
    if (!rejectionReason.trim()) {
      alert('Silakan masukkan alasan penolakan')
      return
    }

    await updateRegistrationStatus(
      rejectionModal.registrationId,
      'REJECTED',
      rejectionReason.trim()
    )
    closeRejectionModal()
  }

  // Menghapus data pendaftaran secara permanen
  const deleteRegistration = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pendaftaran ini?')) {
      return
    }

    setActionLoading(id)
    try {
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchRegistrations()
      } else {
        alert('Gagal menghapus pendaftaran')
      }
    } catch (error) {
      console.error('Error deleting registration:', error)
      alert('Terjadi error saat menghapus pendaftaran')
    } finally {
      setActionLoading(null)
    }
  }

  // Filter daftar pendaftaran berdasarkan kata kunci pencarian dan status
  const filteredRegistrations = registrations.filter((registration) => {
    const query = searchTerm.toLowerCase().trim()
    const matchesSearch =
      query === '' ||
      registration.fullName.toLowerCase().includes(query) ||
      (registration.email && registration.email.toLowerCase().includes(query)) ||
      (registration.npm && registration.npm.includes(query)) ||
      (registration.phone && registration.phone.includes(query)) ||
      (registration.yearClass && registration.yearClass.includes(query)) ||
      registration.activity.title.toLowerCase().includes(query)
    const matchesStatus = statusFilter === '' || registration.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Unduh dokumen rekap Excel
  const handleExportExcel = () => {
    exportRegistrationsToExcel(filteredRegistrations)
  }

  // Tampilkan loading spinner saat memuat data awal
  if (loading) {
    return <DashboardLoading />
  }

  return (
    <div className="space-y-6">
      {/* Header panel kelola pendaftaran */}
      <RegistrationsHeader
        onRefresh={fetchRegistrations}
        onOpenPreview={() => setShowPreview(true)}
        onExportExcel={handleExportExcel}
      />

      {/* Filter pencarian dan status */}
      <RegistrationsFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        filteredCount={filteredRegistrations.length}
        totalCount={registrations.length}
      />

      {/* Daftar kartu pendaftaran peserta */}
      <RegistrationsList
        registrations={filteredRegistrations}
        actionLoading={actionLoading}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onImageClick={(src) => setSelectedImage(src)}
        onUpdateStatus={updateRegistrationStatus}
        onOpenRejectionModal={openRejectionModal}
        onDelete={deleteRegistration}
      />

      {/* Modal zoom bukti follow Instagram */}
      <ImagePreviewModal
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      {/* Modal konfirmasi penolakan pendaftaran */}
      <RejectionModal
        modalState={rejectionModal}
        reason={rejectionReason}
        onReasonChange={setRejectionReason}
        actionLoading={actionLoading}
        onClose={closeRejectionModal}
        onSubmit={handleRejectWithReason}
      />

      {/* Modal pratinjau tabel pendaftaran */}
      <DataPreviewModal
        isOpen={showPreview}
        registrations={filteredRegistrations}
        onClose={() => setShowPreview(false)}
        onExportExcel={handleExportExcel}
      />
    </div>
  )
}