import { Metadata } from 'next'
import RegistrationSuccessContent from '@/components/shared/Registration/RegistrationSuccessContent'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Pendaftaran Selesai | HIMASI UNAS',
  description: 'Terima kasih telah mendaftar kegiatan HIMASI UNAS',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/pendaftaran/selesai',
  },
}

export default function PendaftaranSelesaiPage() {
  return <RegistrationSuccessContent />
}
