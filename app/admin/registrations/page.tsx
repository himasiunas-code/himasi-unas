'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Users,
  Search,
  Filter,
  Download,
  Check,
  X,
  Eye,
  Trash2,
  ChevronDown,
  RefreshCw,
  User
} from 'lucide-react'

interface Registration {
  id: string
  fullName: string
  email: string
  phone: string
  yearClass?: string
  faculty?: string
  major?: string
  instagramProof?: string
  instagramHandle?: string
  motivation?: string
  specialRequest?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ATTENDED' | 'ABSENT'
  createdAt: string
  updatedAt: string
  activity: {
    id: string
    title: string
    slug: string
  }
  reason?: string
}

const statusOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'ATTENDED', label: 'Attended' },
  { value: 'ABSENT', label: 'Absent' }
]

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedImage) {
        setSelectedImage(null)
      }
    }

    if (selectedImage) {
      document.addEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'hidden' // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [selectedImage])

  useEffect(() => {
    fetchRegistrations()
  }, [])

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

  const updateRegistrationStatus = async (id: string, status: string, reason?: string) => {
    setActionLoading(id)
    try {
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, reason })
      })

      if (response.ok) {
        await fetchRegistrations()
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

  const deleteRegistration = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pendaftaran ini?')) {
      return
    }

    setActionLoading(id)
    try {
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: 'DELETE'
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

  const getStatusColor = (status: string) => {
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

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = registration.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registration.activity.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === '' || registration.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const exportToCSV = () => {
    const headers = ['Nama Lengkap', 'Email', 'Telepon', 'Kegiatan', 'Status', 'Tanggal Daftar']
    const csvData = [
      headers,
      ...filteredRegistrations.map(reg => [
        reg.fullName,
        reg.email,
        reg.phone,
        reg.activity.title,
        reg.status,
        new Date(reg.createdAt).toLocaleDateString('id-ID')
      ])
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `registrations_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B061A]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Pendaftaran</h1>
            <p className="mt-2 text-gray-600">Lihat dan kelola semua pendaftaran kegiatan HIMASI</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={fetchRegistrations}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={exportToCSV}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#4B061A] to-[#6B0B2A] hover:from-[#3A0514] hover:to-[#5A0B24] transition-all duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
              <input
                type="text"
                placeholder="Cari nama, email, atau kegiatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4B061A] focus:border-[#4B061A] transition-all duration-200"
              />
            </div>
          </div>
          <div className="sm:w-48 text-black">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4B061A] focus:border-[#4B061A] transition-all duration-200"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Menampilkan <span className="font-semibold text-gray-900">{filteredRegistrations.length}</span> dari <span className="font-semibold text-gray-900">{registrations.length}</span> pendaftaran
          </div>
          <div className="hidden sm:block text-xs text-gray-400">
            Update terakhir: {new Date().toLocaleTimeString('id-ID')}
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
          <div className="space-y-4">
            {filteredRegistrations.map((registration) => (
              <div key={registration.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Left Section - Main Info */}
                  <div className="flex-1 space-y-4">
                    {/* Header with Photo and Basic Info */}
                    <div className="flex items-start gap-4">
                      {/* Instagram Follow Proof */}
                      <div className="flex-shrink-0">
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1 font-medium">Bukti Follow IG</div>
                          {registration.instagramProof ? (
                            <div className="relative group">
                              <img
                                src={registration.instagramProof}
                                alt={`Bukti follow Instagram ${registration.fullName}`}
                                className="h-16 w-16 rounded-lg object-cover border-2 border-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                                onClick={() => setSelectedImage(registration.instagramProof!)}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                  const sibling = e.currentTarget.nextElementSibling as HTMLElement
                                  if (sibling) {
                                    sibling.style.display = 'flex'
                                  }
                                }}
                              />
                              <div className="hidden h-16 w-16 rounded-lg bg-gray-300 items-center justify-center border-2 border-gray-200">
                                <User className="h-8 w-8 text-gray-500" />
                              </div>
                              {/* Hover overlay */}
                              <div 
                                className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 cursor-pointer"
                                onClick={() => setSelectedImage(registration.instagramProof!)}
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

                      {/* Basic Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {registration.fullName}
                            </h3>
                            <div className="mt-1 space-y-1">
                              <p className="text-sm text-gray-600">{registration.email}</p>
                              <p className="text-sm text-gray-600">{registration.phone}</p>
                              <p className="text-sm text-gray-600">
                                {registration.yearClass} - {registration.faculty}
                              </p>
                              {registration.major && (
                                <p className="text-sm text-gray-600">Jurusan: {registration.major}</p>
                              )}
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex-shrink-0 ml-4">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(registration.status)}`}>
                              {registration.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      {/* Activity Info */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Kegiatan</h4>
                        <p className="text-sm text-gray-900 font-medium">{registration.activity.title}</p>
                      </div>

                      {/* Instagram Info */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Instagram</h4>
                        {registration.instagramHandle && (
                          <p className="text-sm text-gray-900 mb-1">{registration.instagramHandle}</p>
                        )}
                        {registration.instagramProof ? (
                          <p className="text-xs text-green-600 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Bukti follow sudah diupload
                          </p>
                        ) : (
                          <p className="text-xs text-red-600 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Bukti follow belum diupload
                          </p>
                        )}
                      </div>

                      {/* Registration Time */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Waktu Pendaftaran</h4>
                        <div className="text-sm text-gray-900">
                          <div>{new Date(registration.createdAt).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</div>
                          <div className="text-gray-600">
                            Pukul {new Date(registration.createdAt).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })} WIB
                          </div>
                        </div>
                      </div>

                      {/* Last Updated */}
                      {registration.updatedAt !== registration.createdAt && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Terakhir Diupdate</h4>
                          <div className="text-sm text-gray-900">
                            <div>{new Date(registration.updatedAt).toLocaleDateString('id-ID')}</div>
                            <div className="text-gray-600">
                              Pukul {new Date(registration.updatedAt).toLocaleTimeString('id-ID')} WIB
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Motivation */}
                    {registration.motivation && (
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Motivasi</h4>
                        <p className="text-sm text-gray-900 bg-white p-3 rounded-md border">
                          {registration.motivation}
                        </p>
                      </div>
                    )}

                    {/* Special Request */}
                    {registration.specialRequest && (
                      <div className="pt-2">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Permintaan Khusus</h4>
                        <p className="text-sm text-gray-900 bg-white p-3 rounded-md border">
                          {registration.specialRequest}
                        </p>
                      </div>
                    )}

                    {/* Rejection Reason */}
                    {registration.reason && (
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-red-700 mb-2">Alasan Penolakan</h4>
                        <p className="text-sm text-red-900 bg-red-50 p-3 rounded-md border border-red-200">
                          {registration.reason}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex lg:flex-col gap-2 lg:items-end">
                    {registration.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateRegistrationStatus(registration.id, 'APPROVED')}
                          disabled={actionLoading === registration.id}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Approve"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Setujui
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Alasan penolakan (opsional):')
                            updateRegistrationStatus(registration.id, 'REJECTED', reason || undefined)
                          }}
                          disabled={actionLoading === registration.id}
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
                          onClick={() => updateRegistrationStatus(registration.id, 'ATTENDED')}
                          disabled={actionLoading === registration.id}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Mark as Attended"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Hadir
                        </button>
                        <button
                          onClick={() => updateRegistrationStatus(registration.id, 'ABSENT')}
                          disabled={actionLoading === registration.id}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Mark as Absent"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Tidak Hadir
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => deleteRegistration(registration.id)}
                      disabled={actionLoading === registration.id}
                      className="inline-flex items-center px-3 py-2 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Delete"
                    >
                      {actionLoading === registration.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                      ) : (
                        <Trash2 className="w-4 h-4 mr-1" />
                      )}
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>        {filteredRegistrations.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada pendaftaran</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter ? 'Tidak ada hasil yang sesuai dengan filter.' : 'Belum ada pendaftaran yang masuk.'}
            </p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && typeof document !== 'undefined' ? createPortal(
        <div 
          className="fixed inset-0 bg-white/90 flex items-center justify-center"
          style={{ 
            zIndex: 999999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedImage(null)
              }}
              className="absolute top-4 right-4 z-50 text-black/90 hover:text-black/10"
              title="Tutup (ESC)"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Image */}
            <img
              src={selectedImage}
              alt="Bukti follow Instagram - Full size"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>,
        document.body
      ) : null}
    </div>
  )
}