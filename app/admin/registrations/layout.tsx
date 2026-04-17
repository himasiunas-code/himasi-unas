import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pendaftaran Admin | HIMASI UNAS',
  description: 'Halaman admin untuk mengelola pendaftaran kegiatan HIMASI UNAS.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminRegistrationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
