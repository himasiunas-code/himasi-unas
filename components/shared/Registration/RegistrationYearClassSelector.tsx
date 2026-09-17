import { Calendar, AlertCircle } from 'lucide-react'
import { ActivityStatus, FormData, FormErrors } from './types'

interface RegistrationYearClassSelectorProps {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  errors: FormErrors
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
  activityStatus: ActivityStatus | null
}

export default function RegistrationYearClassSelector({
  formData,
  setFormData,
  errors,
  setErrors,
  activityStatus,
}: RegistrationYearClassSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        <Calendar className="w-4 h-4 inline mr-2 text-[#4B061A]" />
        Tahun Angkatan <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 gap-4">
        {(['2024', '2025'] as const).map((year) => {
          const isSelected = formData.yearClass === year
          const isFull = year === '2024' ? activityStatus?.isFull2024 : activityStatus?.isFull2025
          const remaining =
            year === '2024'
              ? (activityStatus?.remaining2024 ?? 5)
              : (activityStatus?.remaining2025 ?? 5)
          const maxSlot =
            year === '2024'
              ? (activityStatus?.maxParticipants2024 ?? 5)
              : (activityStatus?.maxParticipants2025 ?? 5)

          return (
            <button
              type="button"
              key={year}
              disabled={isFull}
              onClick={() => {
                if (isFull) return
                setFormData((prev) => ({ ...prev, yearClass: year }))
                if (errors.yearClass) {
                  setErrors((prev) => ({ ...prev, yearClass: '' }))
                }
              }}
              className={`py-4 px-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                isFull
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-75'
                  : isSelected
                  ? 'bg-linear-to-r from-[#4B061A] to-[#8B1C3B] text-white border-[#4B061A] shadow-md scale-[1.02] cursor-pointer'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isFull
                      ? 'border-gray-300 bg-gray-200'
                      : isSelected
                      ? 'border-white bg-white'
                      : 'border-gray-400'
                  }`}
                >
                  {isSelected && !isFull && <div className="w-2.5 h-2.5 rounded-full bg-[#4B061A]" />}
                </div>
                <span className="font-bold text-base md:text-lg">Angkatan {year}</span>
              </div>

              {/* Indikator Kuota / Sisa Slot */}
              <div>
                {isFull ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-red-100 text-red-700 border border-red-200">
                    Kuota Penuh (0/{maxSlot})
                  </span>
                ) : (
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      isSelected
                        ? 'bg-white/25 text-white'
                        : 'bg-green-100 text-green-800 border border-green-200'
                    }`}
                  >
                    Sisa {remaining} dari {maxSlot} slot
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
      {errors.yearClass && (
        <p className="text-red-500 text-xs flex items-center mt-1">
          <AlertCircle className="w-3.5 h-3.5 mr-1" />
          {errors.yearClass}
        </p>
      )}
    </div>
  )
}
