export interface FormData {
  fullName: string
  phone: string
  npm: string
  yearClass: '2024' | '2025' | ''
}

export interface FormErrors {
  [key: string]: string
}

export interface ActivityStatus {
  id: string
  title: string
  registrationOpen: boolean
  registrationStartDate: string | null
  registrationDeadline: string | null
  currentParticipants: number
  maxParticipants: number | null
  count2024?: number
  count2025?: number
  maxParticipants2024?: number
  maxParticipants2025?: number
  remaining2024?: number
  remaining2025?: number
  isFull2024?: boolean
  isFull2025?: boolean
}

export type RegistrationStatus =
  | 'loading'
  | 'open'
  | 'not-started'
  | 'closed'
  | 'full'
  | 'no-activity'

export interface RegistrationFormProps {
  initialActivity?: ActivityStatus | any
}

export interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}
