'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'

// Komponen formulir login admin: menangani input password, autentikasi, dan status loading
export default function AdminLoginForm() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Handler pengiriman form login ke API autentikasi admin
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Delay sejenak sebelum redirect ke dashboard
          setTimeout(() => {
            router.push('/admin/dashboard')
            router.refresh()
          }, 500)
        } else {
          setError('Login gagal. Silakan coba lagi.')
        }
      } else {
        const data = await response.json()
        setError(data.error || 'Password salah')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Terjadi error saat login. Periksa koneksi internet Anda.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {/* Input password admin */}
      <div>
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4B061A] focus:border-[#4B061A] focus:z-10 sm:text-sm transition-all duration-200"
            placeholder="Masukkan password admin"
          />
          {/* Tombol toggle lihat/sembunyikan password */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Pesan error validasi/autentikasi */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <div className="flex">
            <div className="shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <div className="text-sm text-red-700 font-medium">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tombol aksi submit login */}
      <div>
        <button
          type="submit"
          disabled={loading || !password}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-linear-to-r from-[#4B061A] to-[#6B0B2A] hover:from-[#3A0514] hover:to-[#5A0B24] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B061A] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Memverifikasi...
            </div>
          ) : (
            <div className="flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              Masuk ke Admin Panel
            </div>
          )}
        </button>
      </div>
    </form>
  )
}
