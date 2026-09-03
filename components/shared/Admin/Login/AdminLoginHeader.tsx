import Image from 'next/image'

// Komponen header login admin: menampilkan logo HIMASI, logo FTKI, dan judul panel
export default function AdminLoginHeader() {
  return (
    <div>
      {/* Logo organisasi */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-3">
          <Image
            src="/icon/HIMASI.png"
            alt="HIMASI Logo"
            width={48}
            height={48}
            className="h-12 w-auto"
          />
          <Image
            src="/icon/FTKI.png"
            alt="FTKI Logo"
            width={48}
            height={48}
            className="h-12 w-auto"
          />
        </div>
      </div>

      {/* Judul dan deskripsi halaman */}
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Admin HIMASI
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Masukkan password untuk mengakses panel admin
      </p>

      {/* Badge versi panel manajemen */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Management Panel v2.0
        </div>
      </div>
    </div>
  )
}
