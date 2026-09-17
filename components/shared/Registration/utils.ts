import confetti from 'canvas-confetti'
import { RegistrationStatus } from './types'

// Helper untuk menghitung status pendaftaran dari data kegiatan secara instan
export function computeRegistrationStatus(act: any): RegistrationStatus {
  if (!act) return 'no-activity'
  const now = new Date()
  const eventStartTime = new Date(act.startDate).getTime()

  if (now.getTime() > eventStartTime) {
    return 'closed'
  }

  const isAllFull =
    act.isOverallFull ??
    ((act.isFull2024 && act.isFull2025) ||
      (act.maxParticipants && act.maxParticipants > 0 && act.currentParticipants >= act.maxParticipants))

  if (isAllFull) {
    return 'full'
  }

  const isAutoOpenTime = act.registrationStartDate
    ? now >= new Date(act.registrationStartDate)
    : true
  const isWithinDeadline = act.registrationDeadline
    ? now <= new Date(act.registrationDeadline)
    : true

  const isOpen = act.registrationOpen || (isAutoOpenTime && isWithinDeadline)

  if (!isOpen) {
    return !isAutoOpenTime ? 'not-started' : 'closed'
  }
  return 'open'
}

// Efek confetti selebrasi saat pendaftaran berhasil
export function triggerConfetti() {
  try {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4B061A', '#8B1C3B', '#FFD700', '#FF6B6B', '#4ECDC4'],
    })
  } catch (err) {
    console.error('Confetti error:', err)
  }
}
