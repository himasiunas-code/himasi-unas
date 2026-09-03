import { CheckCircle, Clock, XCircle } from 'lucide-react'

// Helper fungsi untuk warna badge status pendaftaran
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return 'text-green-600 bg-green-100'
    case 'PENDING':
      return 'text-yellow-600 bg-yellow-100'
    case 'REJECTED':
      return 'text-red-600 bg-red-100'
    case 'ATTENDED':
      return 'text-blue-600 bg-blue-100'
    case 'ABSENT':
      return 'text-gray-600 bg-gray-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

// Helper fungsi untuk ikon status pendaftaran
export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return <CheckCircle className="w-4 h-4" />
    case 'PENDING':
      return <Clock className="w-4 h-4" />
    case 'REJECTED':
      return <XCircle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}
