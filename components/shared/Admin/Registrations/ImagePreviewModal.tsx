'use client'

import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X } from 'lucide-react'

interface ImagePreviewModalProps {
  imageUrl: string | null
  onClose: () => void
}

// Modal tampilan penuh untuk melihat bukti follow Instagram peserta
export default function ImagePreviewModal({ imageUrl, onClose }: ImagePreviewModalProps) {
  if (!imageUrl || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="fixed inset-0 bg-white/90 flex items-center justify-center"
      style={{
        zIndex: 999999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      onClick={onClose}
    >
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {/* Tombol tutup modal */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="absolute top-4 right-4 z-50 text-black/90 hover:text-black/10 transition-colors"
          title="Tutup (ESC)"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Gambar ukuran penuh */}
        <Image
          src={imageUrl}
          alt="Bukti follow Instagram - Full size"
          width={800}
          height={600}
          className="max-w-full max-h-full object-contain"
          style={{ width: 'auto', height: 'auto' }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>,
    document.body
  )
}
