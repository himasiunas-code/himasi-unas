import { RefObject } from 'react'
import Image from 'next/image'
import { Upload, AlertCircle, CheckCircle, X } from 'lucide-react'
import { FormErrors } from './types'

interface RegistrationPortalProofUploadProps {
  previewUrl: string
  portalProof: File | null
  fileInputRef: RefObject<HTMLInputElement | null>
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeFile: () => void
  errors: FormErrors
}

export default function RegistrationPortalProofUpload({
  previewUrl,
  portalProof,
  fileInputRef,
  handleFileChange,
  removeFile,
  errors,
}: RegistrationPortalProofUploadProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        <Upload className="w-4 h-4 inline mr-2 text-[#4B061A]" />
        Screenshot Portal Mahasiswa UNAS <span className="text-red-500">*</span>
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 transition-all duration-200 hover:border-[#4B061A] bg-gray-50/60">
        {!previewUrl ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-3 shadow-xs border border-gray-200 text-[#4B061A]">
              <Upload className="w-6 h-6" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
              id="portalProof"
            />
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#4B061A] hover:bg-[#3A0514] text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-xs cursor-pointer"
              >
                Pilih Foto Screenshot Portal
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-2">
              Format: JPG, JPEG, PNG, atau WEBP (Maksimal 5MB)
            </p>
            <p className="text-gray-400 text-xs mt-0.5">
              Lampirkan tangkapan layar (SS) portal mahasiswa UNAS Anda
            </p>
          </div>
        ) : (
          <div className="relative max-w-xs mx-auto">
            <Image
              src={previewUrl}
              alt="Preview Screenshot Portal Mahasiswa"
              width={300}
              height={200}
              className="w-full max-h-48 object-contain rounded-xl shadow-md border border-gray-200 bg-white"
            />
            <button
              type="button"
              onClick={removeFile}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md transition-transform hover:scale-110 cursor-pointer"
              title="Hapus foto"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-center mt-2">
              <p className="text-xs text-green-700 font-medium flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5 mr-1 text-green-600" />
                {portalProof?.name || 'Screenshot berhasil dipilih'}
              </p>
            </div>
          </div>
        )}
      </div>
      {errors.portalProof && (
        <p className="text-red-500 text-xs flex items-center mt-1">
          <AlertCircle className="w-3.5 h-3.5 mr-1" />
          {errors.portalProof}
        </p>
      )}
    </div>
  )
}
