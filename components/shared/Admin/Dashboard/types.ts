// Definisi tipe data statistik untuk panel dashboard admin
export interface AdminStats {
  overview: {
    totalActivities: number
    publishedActivities: number
    totalRegistrations: number
    recentRegistrations: number
  }
  registrationsByStatus: Array<{
    status: string
    count: number
  }>
  registrationTrend: Array<{
    date: string
    count: number
  }>
  topActivities: Array<{
    id: string
    title: string
    slug: string
    registrationCount: number
    maxParticipants: number | null
    registrationOpen: boolean
  }>
  latestRegistrations: Array<{
    id: string
    fullName: string
    email: string
    status: string
    createdAt: string
    activityTitle: string
    activitySlug: string
  }>
}
