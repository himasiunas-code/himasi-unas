import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Activity, ActivityFormData } from './types'

interface ActivityFormDialogProps {
  isOpen: boolean
  onClose: () => void
  editingActivity: Activity | null
  formData: ActivityFormData
  setFormData: React.Dispatch<React.SetStateAction<ActivityFormData>>
  imagePreview: string
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  submitting: boolean
  error: string
  onSubmit: (e: React.FormEvent) => void
}

// Dialog formulir tambah/edit kegiatan beserta upload foto dan pengaturan kuota
export default function ActivityFormDialog({
  isOpen,
  onClose,
  editingActivity,
  formData,
  setFormData,
  imagePreview,
  onImageChange,
  submitting,
  error,
  onSubmit,
}: ActivityFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[70vh] overflow-y-auto mx-4 md:mx-0">
        <DialogHeader>
          <DialogTitle>
            {editingActivity ? 'Edit Kegiatan' : 'Buat Kegiatan Baru'}
          </DialogTitle>
          <DialogDescription>
            {editingActivity
              ? 'Update informasi kegiatan. Data registrasi yang sudah ada akan tetap aman.'
              : 'Tambahkan kegiatan baru untuk HIMASI UNAS.'}
          </DialogDescription>
        </DialogHeader>

        {/* Peringatan auto-delete untuk kegiatan baru */}
        {!editingActivity && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Peringatan: Auto-Delete</h3>
                <div className="mt-1 text-sm text-red-700">
                  <p>
                    Membuat kegiatan baru akan <strong>menghapus semua kegiatan sebelumnya</strong> beserta
                    data pendaftarannya. Pastikan Anda yakin sebelum melanjutkan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Nama Kegiatan */}
          <div>
            <Label htmlFor="title">Nama Kegiatan *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Contoh: Workshop Web Development"
              required
            />
          </div>

          {/* Deskripsi Singkat */}
          <div>
            <Label htmlFor="description">Deskripsi Singkat *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Deskripsi singkat kegiatan..."
              rows={3}
              required
            />
          </div>

          {/* Konten Lengkap */}
          <div>
            <Label htmlFor="content">Konten Lengkap</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Konten lengkap kegiatan (markdown supported)..."
              rows={5}
            />
          </div>

          {/* Upload Foto Kegiatan */}
          <div>
            <Label htmlFor="image">Foto Kegiatan</Label>
            <div className="mt-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={onImageChange}
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

          {/* Kategori */}
          <div>
            <Label htmlFor="category">Kategori</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
              placeholder="Workshop, Seminar, Kompetisi, dll"
            />
          </div>

          {/* Tanggal Kegiatan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Tanggal Mulai *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">Tanggal Selesai</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>

          {/* Lokasi */}
          <div>
            <Label htmlFor="location">Lokasi</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="Contoh: Auditorium FTKI, Online via Zoom"
            />
          </div>

          {/* Maksimal Peserta */}
          <div>
            <Label htmlFor="maxParticipants">Maksimal Peserta (Total)</Label>
            <Input
              id="maxParticipants"
              type="number"
              value={formData.maxParticipants}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, maxParticipants: parseInt(e.target.value) || 0 }))
              }
              placeholder="0 = unlimited"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Total maksimal peserta (opsional jika menggunakan pembagian slot)
            </p>
          </div>

          {/* Pembagian Kuota Angkatan 2024 & 2025 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxParticipantsMahasiswa">Slot Angkatan 2024</Label>
              <Input
                id="maxParticipantsMahasiswa"
                type="number"
                value={formData.maxParticipantsMahasiswa}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    maxParticipantsMahasiswa: parseInt(e.target.value) || 0,
                  }))
                }
                placeholder="5"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="maxParticipantsPelajar">Slot Angkatan 2025</Label>
              <Input
                id="maxParticipantsPelajar"
                type="number"
                value={formData.maxParticipantsPelajar}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    maxParticipantsPelajar: parseInt(e.target.value) || 0,
                  }))
                }
                placeholder="5"
                min="0"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 -mt-2">
            Pembagian slot kuota khusus per angkatan (contoh: 5 slot untuk 2024, 5 slot untuk 2025).
          </p>

          {/* Periode Registrasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="registrationStartDate">Mulai Pendaftaran</Label>
              <Input
                id="registrationStartDate"
                type="date"
                value={formData.registrationStartDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, registrationStartDate: e.target.value }))
                }
              />
              <p className="text-xs text-gray-500 mt-1">Pendaftaran mulai pukul 09:00 WIB</p>
            </div>
            <div>
              <Label htmlFor="registrationDeadline">Batas Pendaftaran</Label>
              <Input
                id="registrationDeadline"
                type="date"
                value={formData.registrationDeadline}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, registrationDeadline: e.target.value }))
                }
              />
              <p className="text-xs text-gray-500 mt-1">Pendaftaran ditutup pukul 23:59 WIB</p>
            </div>
          </div>

          {/* Pengaturan Status Publikasi dan Registrasi */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-gray-900">Pengaturan Kegiatan</h3>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>💡 Penting:</strong> Kegiatan harus di-<strong>publikasikan</strong> agar
                muncul di halaman kegiatan website.
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
                  setFormData((prev) => ({ ...prev, isPublished: checked }))
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
                  setFormData((prev) => ({ ...prev, registrationOpen: checked }))
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
                  setFormData((prev) => ({ ...prev, requiresApproval: checked }))
                }
              />
            </div>
          </div>

          {/* Pesan Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Tombol Aksi */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto bg-[#4B061A] hover:bg-[#3A0514] text-white"
            >
              {submitting
                ? 'Menyimpan...'
                : editingActivity
                ? 'Update'
                : 'Buat Kegiatan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
