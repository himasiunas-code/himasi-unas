import { Check, Clock, X, User, UserX } from 'lucide-react'

interface StatusBadgeProps {
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ATTENDED' | 'ABSENT'
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function StatusBadge({ status, showIcon = true, size = 'md' }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return {
          label: 'Disetujui',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: Check
        }
      case 'PENDING':
        return {
          label: 'Menunggu',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock
        }
      case 'REJECTED':
        return {
          label: 'Ditolak',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: X
        }
      case 'ATTENDED':
        return {
          label: 'Hadir',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: User
        }
      case 'ABSENT':
        return {
          label: 'Tidak Hadir',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: UserX
        }
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Clock
        }
    }
  }

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs'
      case 'lg':
        return 'px-3 py-1 text-sm'
      default:
        return 'px-2.5 py-0.5 text-xs'
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon
  const sizeClasses = getSizeClasses(size)

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${config.color} ${sizeClasses}`}>
      {showIcon && <Icon className={`${size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} mr-1`} />}
      {config.label}
    </span>
  )
}

interface ActionButtonProps {
  variant: 'approve' | 'reject' | 'attend' | 'absent' | 'delete' | 'view'
  onClick: () => void
  disabled?: boolean
  size?: 'sm' | 'md'
  tooltip?: string
}

export function ActionButton({ 
  variant, 
  onClick, 
  disabled = false, 
  size = 'md',
  tooltip 
}: ActionButtonProps) {
  const getVariantConfig = (variant: string) => {
    switch (variant) {
      case 'approve':
        return {
          icon: Check,
          color: 'text-green-600 hover:text-green-900',
          label: 'Setujui'
        }
      case 'reject':
        return {
          icon: X,
          color: 'text-red-600 hover:text-red-900',
          label: 'Tolak'
        }
      case 'attend':
        return {
          icon: User,
          color: 'text-blue-600 hover:text-blue-900',
          label: 'Mark Hadir'
        }
      case 'absent':
        return {
          icon: UserX,
          color: 'text-gray-600 hover:text-gray-900',
          label: 'Mark Tidak Hadir'
        }
      case 'delete':
        return {
          icon: X,
          color: 'text-red-600 hover:text-red-900',
          label: 'Hapus'
        }
      default:
        return {
          icon: Clock,
          color: 'text-gray-600 hover:text-gray-900',
          label: 'Action'
        }
    }
  }

  const config = getVariantConfig(variant)
  const Icon = config.icon
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip || config.label}
      className={`${config.color} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
    >
      <Icon className={iconSize} />
    </button>
  )
}