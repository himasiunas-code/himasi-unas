import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard Admin | HIMASI UNAS',
  description: 'Dashboard admin untuk pengelolaan data HIMASI UNAS.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
