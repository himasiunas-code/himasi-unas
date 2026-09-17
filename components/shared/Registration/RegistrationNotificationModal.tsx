import { useRouter } from 'next/navigation'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

interface RegistrationNotificationModalProps {
  show: boolean
  onClose: () => void
  type: 'success' | 'error'
  title: string
  message: string
}

export default function RegistrationNotificationModal({
  show,
  onClose,
  type,
  title,
  message,
}: RegistrationNotificationModalProps) {
  const router = useRouter()

  if (!show) return null

  const handleAction = () => {
    onClose()
    if (type === 'success') {
      router.push('/pendaftaran/selesai')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className={`relative max-w-md w-full p-6 rounded-3xl shadow-2xl transform transition-all ${
          type === 'success'
            ? 'bg-linear-to-br from-green-50 to-emerald-50 border-2 border-green-200'
            : 'bg-linear-to-br from-red-50 to-rose-50 border-2 border-red-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleAction}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center mb-4">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md ${
              type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {type === 'success' ? (
              <CheckCircle className="w-8 h-8" />
            ) : (
              <AlertCircle className="w-8 h-8" />
            )}
          </div>
        </div>

        <h3
          className={`text-xl font-bold text-center mb-2 ${
            type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}
        >
          {title}
        </h3>

        <p
          className={`text-center text-sm mb-6 ${
            type === 'success' ? 'text-green-700' : 'text-red-700'
          }`}
        >
          {message}
        </p>

        <div className="flex justify-center">
          <button
            onClick={handleAction}
            className={`px-6 py-2.5 rounded-xl font-semibold text-white transition-all shadow-md cursor-pointer ${
              type === 'success'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {type === 'success' ? 'Lanjut ke Halaman Selesai →' : 'Tutup'}
          </button>
        </div>
      </div>
    </div>
  )
}
