import { Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Activity } from './types'
import ActivityCard from './ActivityCard'

interface ActivitiesListProps {
  activities: Activity[]
  onOpenCreateDialog: () => void
  onEdit: (activity: Activity) => void
  onDelete: (id: string) => void
}

// Komponen daftar kegiatan: menampilkan kumpulan kartu kegiatan atau status kosong
export default function ActivitiesList({
  activities,
  onOpenCreateDialog,
  onEdit,
  onDelete,
}: ActivitiesListProps) {
  return (
    <div className="grid gap-4 md:gap-6">
      {activities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Kegiatan</h3>
            <p className="text-gray-600 text-center mb-4">
              Mulai buat kegiatan pertama untuk HIMASI UNAS
            </p>
            <Button
              onClick={onOpenCreateDialog}
              className="bg-[#4B061A] hover:bg-[#3A0514] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Buat Kegiatan Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  )
}
