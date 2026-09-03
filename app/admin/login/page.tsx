import {
  AdminLoginHeader,
  AdminLoginForm,
  AdminLoginFooter,
} from '@/components/shared/Admin/Login'

// Halaman utama Login Admin HIMASI UNAS
export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header login dengan logo dan judul */}
        <AdminLoginHeader />

        {/* Formulir autentikasi password admin */}
        <AdminLoginForm />

        {/* Footer hak cipta */}
        <AdminLoginFooter />
      </div>
    </div>
  )
}