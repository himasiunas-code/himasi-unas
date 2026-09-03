'use client'

import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { RejectionModalState } from './types'

interface RejectionModalProps {
  modalState: RejectionModalState
  reason: string
  onReasonChange: (value: string) => void
  actionLoading: string | null
  onClose: () => void
  onSubmit: () => void
}

// Modal input alasan penolakan pendaftaran
export default function RejectionModal({
  modalState,
  reason,
  onReasonChange,
  actionLoading,
  onClose,
  onSubmit,
}: RejectionModalProps) {
  if (!modalState.isOpen || typeof document === 'undefined') return null

  const isSubmitting = actionLoading === modalState.registrationId

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      style={{ zIndex: 999998 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header modal */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Tolak Pendaftaran</h3>
            <p className="text-sm text-gray-600 mt-1">{modalState.fullName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form input alasan penolakan */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alasan Penolakan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="Jelaskan alasan mengapa pendaftaran ini ditolak..."
              className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{reason.length}/500 karakter</p>
          </div>

          {/* Kotak peringatan notifikasi email */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <div className="flex items-start">
              <div className="shrink-0">
                <svg
                  className="w-5 h-5 text-yellow-400 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-2">
                <p className="text-sm text-yellow-800">
                  Alasan penolakan akan dikirim ke email pendaftar. Pastikan alasan yang diberikan
                  jelas dan konstruktif.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tombol aksi */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            disabled={!reason.trim() || isSubmitting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Menolak...
              </div>
            ) : (
              'Tolak Pendaftaran'
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
