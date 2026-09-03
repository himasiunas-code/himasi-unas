// Definisi data pendaftaran kegiatan mahasiswa
export interface Registration {
  id: string
  fullName: string
  email: string
  phone: string
  npm?: string
  academicStatus?: string
  institution?: string
  faculty?: string
  major?: string
  instagramProof?: string
  instagramHandle?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ATTENDED' | 'ABSENT'
  createdAt: string
  updatedAt: string
  activity: {
    id: string
    title: string
    slug: string
  }
  rejectedReason?: string
}

// Opsi filter status pendaftaran
export const statusOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'ATTENDED', label: 'Attended' },
  { value: 'ABSENT', label: 'Absent' }
]

// State untuk modal penolakan pendaftaran
export interface RejectionModalState {
  isOpen: boolean
  registrationId: string
  fullName: string
}
