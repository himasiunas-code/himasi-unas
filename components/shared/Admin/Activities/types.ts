// Definisi data entitas kegiatan HIMASI UNAS
export interface Activity {
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

// Data input formulir tambah/edit kegiatan
export interface ActivityFormData {
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

// Nilai awal formulir kegiatan
export const initialFormData: ActivityFormData = {
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
  isPublished: true,
  registrationOpen: true,
}
