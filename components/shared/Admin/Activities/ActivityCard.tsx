import Image from 'next/image'
import { Calendar, Users, Settings, Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity } from './types'

interface ActivityCardProps {
  activity: Activity
  onEdit: (activity: Activity) => void
  onDelete: (id: string) => void
}

// Komponen kartu kegiatan individual: menampilkan foto, rincian kuota, status, dan tombol aksi
export default function ActivityCard({ activity, onEdit, onDelete }: ActivityCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Gambar banner kegiatan */}
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

        {/* Konten detail kegiatan */}
        <div className="flex-1 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                {activity.title}
              </h3>
              <p className="text-gray-600 mb-3 text-sm md:text-base">{activity.description}</p>

              {/* Tag kategori & status */}
              <div className="flex flex-wrap gap-2 mb-3">
                {activity.category && (
                  <Badge variant="secondary" className="text-xs">
                    {activity.category}
                  </Badge>
                )}
                <Badge
                  variant={activity.isPublished ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {activity.isPublished ? 'Published' : 'Draft'}
                </Badge>
                <Badge
                  variant={activity.registrationOpen ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {activity.registrationOpen ? 'Open' : 'Closed'}
                </Badge>
              </div>
            </div>

            {/* Tombol aksi Edit & Hapus */}
            <div className="flex gap-2 mt-2 sm:mt-0 sm:ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(activity)}
                className="flex-1 sm:flex-none"
              >
                <Edit className="h-4 w-4 sm:mr-0" />
                <span className="ml-2 sm:hidden">Edit</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(activity.id)}
                className="text-red-600 hover:text-red-700 flex-1 sm:flex-none"
              >
                <Trash2 className="h-4 w-4 sm:mr-0" />
                <span className="ml-2 sm:hidden">Delete</span>
              </Button>
            </div>
          </div>

          {/* Metadata: tanggal, peserta, lokasi, dan batas pendaftaran */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {new Date(activity.startDate).toLocaleDateString('id-ID')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400 shrink-0" />
              <span>
                {activity.currentParticipants}
                {activity.maxParticipants ? `/${activity.maxParticipants}` : ''}
                {(activity.maxParticipantsMahasiswa || activity.maxParticipantsPelajar) && (
                  <span className="ml-2 text-xs text-gray-500 font-medium">
                    (🎓 2024: {activity.count2024 ?? activity.mahasiswaCount ?? 0}/{activity.maxParticipantsMahasiswa || 5} | 🎓 2025:{' '}
                    {activity.count2025 ?? activity.pelajarCount ?? 0}/{activity.maxParticipantsPelajar || 5})
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
                <span className="truncate">
                  Deadline: {new Date(activity.registrationDeadline).toLocaleDateString('id-ID')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
