import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ActivitiesHeaderProps {
  onOpenCreateDialog: () => void
}

// Komponen header manajemen kegiatan: judul, deskripsi, dan tombol buat kegiatan baru
export default function ActivitiesHeader({ onOpenCreateDialog }: ActivitiesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manajemen Kegiatan</h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">Kelola kegiatan HIMASI UNAS</p>
      </div>

      <Button
        onClick={onOpenCreateDialog}
        className="bg-[#4B061A] hover:bg-[#3A0514] text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        Buat Kegiatan Baru
      </Button>
    </div>
  )
}
