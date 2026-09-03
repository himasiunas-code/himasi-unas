'use client'

import { useState, useEffect } from 'react'
import {
  Activity,
  ActivityFormData,
  initialFormData,
  ActivitiesHeader,
  ActivityFormDialog,
  ActivitiesList,
} from '@/components/shared/Admin/Activities'
import { DashboardLoading } from '@/components/shared/Admin/Dashboard'

// Halaman utama Manajemen Kegiatan Admin HIMASI UNAS
export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [formData, setFormData] = useState<ActivityFormData>(initialFormData)
  const [submitting, setSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  // Muat data kegiatan saat komponen pertama kali dibuka
  useEffect(() => {
    fetchActivities()
  }, [])

  // Fungsi pengambil seluruh data kegiatan dari API
  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activities')
      if (!response.ok) throw new Error('Failed to fetch activities')
      const data = await response.json()
      setActivities(data.activities || [])
    } catch (err) {
      setError('Gagal memuat daftar kegiatan.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Handler submit formulir tambah / edit kegiatan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      let imageUrl = formData.image

      // Upload gambar jika ada file baru yang dipilih
      if (imageFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', imageFile)
        uploadFormData.append('type', 'activity-image')

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          imageUrl = uploadResult.data?.url || uploadResult.url
        } else {
          const errorResult = await uploadResponse.json()
          throw new Error(`Upload gagal: ${errorResult.message}`)
        }
      }

      // Siapkan payload data kegiatan dengan zona waktu WIB
      const activityData = {
        ...formData,
        image: imageUrl,
        maxParticipants: Number(formData.maxParticipants),
        maxParticipantsMahasiswa: Number(formData.maxParticipantsMahasiswa) || null,
        maxParticipantsPelajar: Number(formData.maxParticipantsPelajar) || null,
        registrationDeadline: formData.registrationDeadline
          ? `${formData.registrationDeadline}T23:59:59+07:00`
          : '',
        registrationStartDate: formData.registrationStartDate
          ? `${formData.registrationStartDate}T09:00:00+07:00`
          : '',
      }

      const url = editingActivity
        ? `/api/activities/${editingActivity.id}`
        : '/api/activities'
      const method = editingActivity ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || errorData.error || 'Gagal menyimpan kegiatan')
      }

      // Reset form dan refresh data kegiatan
      resetDialog()
      fetchActivities()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan kegiatan')
    } finally {
      setSubmitting(false)
    }
  }

  // Buka dialog untuk edit kegiatan
  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity)
    setFormData({
      title: activity.title,
      description: activity.description,
      content: activity.content || '',
      category: activity.category || '',
      startDate: activity.startDate.split('T')[0],
      endDate: activity.endDate?.split('T')[0] || '',
      location: activity.location || '',
      maxParticipants: activity.maxParticipants || 0,
      maxParticipantsMahasiswa: activity.maxParticipantsMahasiswa || 0,
      maxParticipantsPelajar: activity.maxParticipantsPelajar || 0,
      registrationDeadline: activity.registrationDeadline?.split('T')[0] || '',
      registrationStartDate: activity.registrationStartDate?.split('T')[0] || '',
      requiresApproval: activity.requiresApproval,
      isPublished: activity.isPublished,
      registrationOpen: activity.registrationOpen,
      image: activity.image,
    })
    setImagePreview(activity.image || '')
    setIsDialogOpen(true)
  }

  // Hapus kegiatan berdasarkan ID
  const handleDelete = async (id: string) => {
    if (
      !confirm(
        'Apakah Anda yakin ingin menghapus kegiatan ini? Semua data pendaftaran terkait juga akan terhapus.'
      )
    ) {
      return
    }

    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Gagal menghapus kegiatan')
      }

      fetchActivities()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus kegiatan')
    }
  }

  // Handle pemilihan berkas gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Reset form dialog ke keadaan awal
  const resetDialog = () => {
    setFormData(initialFormData)
    setEditingActivity(null)
    setImageFile(null)
    setImagePreview('')
    setIsDialogOpen(false)
  }

  // Loading state
  if (loading) {
    return <DashboardLoading />
  }

  return (
    <div className="container mx-auto py-4 md:py-6 px-4 text-black">
      {/* Header panel manajemen kegiatan */}
      <ActivitiesHeader onOpenCreateDialog={() => setIsDialogOpen(true)} />

      {/* Pesan error jika terjadi kendala */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Dialog formulir tambah / edit kegiatan */}
      <ActivityFormDialog
        isOpen={isDialogOpen}
        onClose={resetDialog}
        editingActivity={editingActivity}
        formData={formData}
        setFormData={setFormData}
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        submitting={submitting}
        error={error}
        onSubmit={handleSubmit}
      />

      {/* Daftar kegiatan atau status kosong */}
      <ActivitiesList
        activities={activities}
        onOpenCreateDialog={() => setIsDialogOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}