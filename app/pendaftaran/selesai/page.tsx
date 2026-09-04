import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
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

export default async function PendaftaranSelesaiPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('reg_success_token')?.value

  // Server-side guard: jika tidak ada cookie pendaftaran berhasil, redirect langsung ke /pendaftaran
  if (!token) {
    redirect('/pendaftaran')
  }

  return <RegistrationSuccessContent />
}
