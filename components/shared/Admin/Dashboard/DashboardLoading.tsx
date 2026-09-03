// Komponen loading spinner saat memuat data statistik dashboard
export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B061A]"></div>
    </div>
  )
}
