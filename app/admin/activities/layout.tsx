import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kegiatan Admin | HIMASI UNAS',
  description: 'Halaman admin untuk mengelola kegiatan HIMASI UNAS.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminActivitiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
