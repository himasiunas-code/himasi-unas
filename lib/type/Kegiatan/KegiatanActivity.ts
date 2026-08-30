// Tipe data kegiatan pendaftaran aktif saat ini
export interface Activity {
  id: string;
  title: string;
  description: string;
  image: string | null;
  startDate: string;
  maxParticipants: number;
  registrationDeadline: string | null;
  registrationStartDate?: string | null;
  registrationOpen: boolean;
  currentParticipants: number;
  mahasiswaCount?: number;
  pelajarCount?: number;
}
