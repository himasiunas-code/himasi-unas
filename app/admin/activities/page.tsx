'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Calendar, Users, Settings, Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react'

interface Activity {
  id: string
  title: string
  slug: string
  description: string
  content?: string
  image?: string
  category?: string
  startDate: string
  endDate?: string
  location?: string
  maxParticipants?: number
  maxParticipantsMahasiswa?: number
  maxParticipantsPelajar?: number
  currentParticipants: number
  mahasiswaCount?: number
  pelajarCount?: number
  registrationOpen: boolean
  registrationDeadline?: string
  registrationStartDate?: string
  requiresApproval: boolean
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

interface ActivityFormData {
  title: string
  description: string
  content: string
  image?: string
  category: string
  startDate: string
  endDate: string
  location: string
  maxParticipants: number
  maxParticipantsMahasiswa: number
  maxParticipantsPelajar: number
  registrationDeadline: string
  registrationStartDate: string
  requiresApproval: boolean
  isPublished: boolean
  registrationOpen: boolean
}

const initialFormData: ActivityFormData = {
  title: '',
  description: '',
  content: '',
  category: '',
  startDate: '',
  endDate: '',
  location: '',
  maxParticipants: 0,
  maxParticipantsMahasiswa: 0,
  maxParticipantsPelajar: 0,
  registrationDeadline: '',
  registrationStartDate: '',
  requiresApproval: false,
  isPublished: true,  // Default: Published
  registrationOpen: true  // Default: Registration Open
}

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

  // Fetch activities
  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activities')
      if (!response.ok) throw new Error('Failed to fetch activities')
      const data = await response.json()
      setActivities(data.activities || [])
    } catch (err) {
      setError('Failed to load activities')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Upload image if selected, otherwise keep existing image
      let imageUrl = formData.image
      if (imageFile) {
        console.log('🖼️ Uploading new image file:', imageFile.name, imageFile.size)
        const uploadFormData = new FormData()
        uploadFormData.append('file', imageFile)
        uploadFormData.append('type', 'activity-image')

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        })

        console.log('📤 Upload response status:', uploadResponse.status)
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          console.log('✅ Upload successful:', uploadResult)
          imageUrl = uploadResult.data?.url || uploadResult.url
          console.log('🔗 New image URL set to:', imageUrl)
        } else {
          const errorResult = await uploadResponse.json()
          console.error('❌ Upload failed:', errorResult)
          throw new Error(`Upload failed: ${errorResult.message}`)
        }
      } else {
        console.log('📷 No new image selected, keeping existing image:', imageUrl)
      }

      // Submit activity data
      const activityData = {
        ...formData,
        image: imageUrl,
        maxParticipants: Number(formData.maxParticipants),
        maxParticipantsMahasiswa: Number(formData.maxParticipantsMahasiswa) || null,
        maxParticipantsPelajar: Number(formData.maxParticipantsPelajar) || null,
        // Set deadline to end of day (23:59:59) if provided
        registrationDeadline: formData.registrationDeadline 
          ? `${formData.registrationDeadline}T23:59:59` 
          : '',
        // Set start date to beginning of day (09:00:00) if provided
        registrationStartDate: formData.registrationStartDate 
          ? `${formData.registrationStartDate}T09:00:00` 
          : ''
      }

      console.log('🚀 Submitting activity data:', activityData)

      const url = editingActivity 
        ? `/api/activities/${editingActivity.id}` 
        : '/api/activities'
      
      const method = editingActivity ? 'PUT' : 'POST'
      console.log(`📡 ${method} request to:`, url)

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Activity save failed:', errorData)
        throw new Error(errorData.message || errorData.error || 'Failed to save activity')
      }

      const result = await response.json()
      console.log('✅ Activity saved successfully:', result)

      // Reset form and refresh data
      setFormData(initialFormData)
      setEditingActivity(null)
      setImageFile(null)
      setImagePreview('')
      setIsDialogOpen(false)
      fetchActivities()

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save activity')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle edit
  const handleEdit = (activity: Activity) => {
    console.log('✏️ Editing activity:', activity.title, 'Current image:', activity.image)
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
      image: activity.image
    })
    setImagePreview(activity.image || '')
    console.log('🖼️ Image preview set to:', activity.image || 'no image')
    setIsDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity? This will also delete all related registrations.')) {
      return
    }

    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete activity')
      }

      fetchActivities()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete activity')
    }
  }

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Reset dialog
  const resetDialog = () => {
    setFormData(initialFormData)
    setEditingActivity(null)
    setImageFile(null)
    setImagePreview('')
    setIsDialogOpen(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading activities...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-4 md:py-6 px-4 text-black">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manajemen Kegiatan</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">Kelola kegiatan HIMASI UNAS</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={resetDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 hidden">
              <Plus className="h-4 w-4 mr-2" />
              Buat Kegiatan Baru
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[70vh] overflow-y-auto mx-4 md:mx-0">
            <DialogHeader>
              <DialogTitle>
                {editingActivity ? 'Edit Kegiatan' : 'Buat Kegiatan Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingActivity 
                  ? 'Update informasi kegiatan. Data registrasi yang sudah ada akan tetap aman.'
                  : 'Tambahkan kegiatan baru untuk HIMASI UNAS.'
                }
              </DialogDescription>
            </DialogHeader>

            {/* Warning untuk kegiatan baru */}
            {!editingActivity && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Peringatan: Auto-Delete
                    </h3>
                    <div className="mt-1 text-sm text-red-700">
                      <p>
                        Membuat kegiatan baru akan <strong>menghapus semua kegiatan sebelumnya</strong> beserta data pendaftarannya. 
                        Pastikan Anda yakin sebelum melanjutkan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title">Nama Kegiatan *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Contoh: Workshop Web Development"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Deskripsi Singkat *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Deskripsi singkat kegiatan..."
                  rows={3}
                  required
                />
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">Konten Lengkap</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Konten lengkap kegiatan (markdown supported)..."
                  rows={5}
                />
              </div>

              {/* Image Upload */}
              <div>
                <Label htmlFor="image">Foto Kegiatan</Label>
                <div className="mt-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mb-2"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <Image 
                        src={imagePreview} 
                        alt="Preview" 
                        width={320}
                        height={160}
                        className="object-cover rounded-lg border w-full h-32 sm:h-40"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">Kategori</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Workshop, Seminar, Kompetisi, dll"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Tanggal Mulai *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Tanggal Selesai</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Contoh: Auditorium FTKI, Online via Zoom"
                />
              </div>

              {/* Max Participants */}
              <div>
                <Label htmlFor="maxParticipants">Maksimal Peserta (Total)</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 0 }))}
                  placeholder="0 = unlimited"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Total maksimal peserta (opsional jika menggunakan pembagian slot)</p>
              </div>

              {/* Slot Division */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxParticipantsMahasiswa">Slot Mahasiswa</Label>
                  <Input
                    id="maxParticipantsMahasiswa"
                    type="number"
                    value={formData.maxParticipantsMahasiswa}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxParticipantsMahasiswa: parseInt(e.target.value) || 0 }))}
                    placeholder="0 = tidak dibatasi"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="maxParticipantsPelajar">Slot Pelajar</Label>
                  <Input
                    id="maxParticipantsPelajar"
                    type="number"
                    value={formData.maxParticipantsPelajar}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxParticipantsPelajar: parseInt(e.target.value) || 0 }))}
                    placeholder="0 = tidak dibatasi"
                    min="0"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 -mt-2">Pembagian slot berdasarkan status akademik. Kosongkan jika tidak perlu pembagian.</p>

              {/* Registration Period */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="registrationStartDate">Mulai Pendaftaran</Label>
                  <Input
                    id="registrationStartDate"
                    type="date"
                    value={formData.registrationStartDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, registrationStartDate: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Pendaftaran mulai pukul 09:00 WIB</p>
                </div>
                <div>
                  <Label htmlFor="registrationDeadline">Batas Pendaftaran</Label>
                  <Input
                    id="registrationDeadline"
                    type="date"
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, registrationDeadline: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Pendaftaran ditutup pukul 23:59 WIB</p>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900">Pengaturan Kegiatan</h3>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>💡 Penting:</strong> Kegiatan harus di-<strong>publikasikan</strong> agar muncul di halaman kegiatan website.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Publikasikan Kegiatan</Label>
                    <p className="text-sm text-gray-600">Tampilkan kegiatan ini di halaman publik</p>
                  </div>
                  <Switch
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, isPublished: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Buka Pendaftaran</Label>
                    <p className="text-sm text-gray-600">Peserta bisa mendaftar kegiatan ini</p>
                  </div>
                  <Switch
                    checked={formData.registrationOpen}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, registrationOpen: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Perlu Approval</Label>
                    <p className="text-sm text-gray-600">Registrasi perlu disetujui admin</p>
                  </div>
                  <Switch
                    checked={formData.requiresApproval}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, requiresApproval: checked }))
                    }
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={resetDialog} className="w-full sm:w-auto">
                  Batal
                </Button>
                <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                  {submitting ? 'Menyimpan...' : (editingActivity ? 'Update' : 'Buat Kegiatan')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Activities List */}
      <div className="grid gap-4 md:gap-6">
        {activities.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Kegiatan</h3>
              <p className="text-gray-600 text-center mb-4">
                Mulai buat kegiatan pertama untuk HIMASI UNAS
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Buat Kegiatan Pertama
              </Button>
            </CardContent>
          </Card>
        ) : (
          activities.map((activity) => (
            <Card key={activity.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="w-full md:w-48 h-48 md:h-40 bg-gray-100 shrink-0">
                  {activity.image ? (
                    <Image 
                      src={activity.image} 
                      alt={activity.title}
                      width={192}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                        {activity.title}
                      </h3>
                      <p className="text-gray-600 mb-3 text-sm md:text-base">{activity.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {activity.category && (
                          <Badge variant="secondary" className="text-xs">{activity.category}</Badge>
                        )}
                        <Badge variant={activity.isPublished ? "default" : "secondary"} className="text-xs">
                          {activity.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Badge variant={activity.registrationOpen ? "default" : "secondary"} className="text-xs">
                          {activity.registrationOpen ? "Open" : "Closed"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-2 sm:mt-0 sm:ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(activity)}
                        className="flex-1 sm:flex-none"
                      >
                        <Edit className="h-4 w-4 sm:mr-0" />
                        <span className="ml-2 sm:hidden">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(activity.id)}
                        className="text-red-600 hover:text-red-700 flex-1 sm:flex-none"
                      >
                        <Trash2 className="h-4 w-4 sm:mr-0" />
                        <span className="ml-2 sm:hidden">Delete</span>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs md:text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span className="truncate">{new Date(activity.startDate).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400 shrink-0" />
                      <span>
                        {activity.currentParticipants}
                        {activity.maxParticipants ? `/${activity.maxParticipants}` : ''}
                        {(activity.maxParticipantsMahasiswa || activity.maxParticipantsPelajar) && (
                          <span className="ml-2 text-xs text-gray-500">
                            (👨‍🎓 {activity.mahasiswaCount || 0}/{activity.maxParticipantsMahasiswa || 0} | 
                            📚 {activity.pelajarCount || 0}/{activity.maxParticipantsPelajar || 0})
                          </span>
                        )}
                      </span>
                    </div>
                    {activity.location && (
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-gray-400 shrink-0" />
                        <span className="truncate">{activity.location}</span>
                      </div>
                    )}
                    {activity.registrationDeadline && (
                      <div className="flex items-center gap-2 text-orange-600">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span className="truncate">Deadline: {new Date(activity.registrationDeadline).toLocaleDateString('id-ID')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}