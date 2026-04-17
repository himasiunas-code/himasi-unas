import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Statistik | Admin HIMASI',
  description: 'Dashboard statistik dan analytics HIMASI UNAS',
  robots: {
    index: false,
    follow: false,
  },
}

export default function StatisticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}