export interface Partnership {
  name: string
  logo: string
  category: 'Sponsor' | 'Media Partner' | 'Collaboration'
  startDate?: string
  endDate?: string
}

// Partnership yang sedang berlangsung
export const activePartnerships: Partnership[] = [
//   {
//     name: 'Zenith',
//     logo: '/image/Kerja-sama/Sponsor/Zenith.png',
//     category: 'Sponsor',
//     startDate: '2025-01-01',
//     endDate: '2025-12-31'
//   },
]

// Riwayat Partnership yang sudah selesai
export const pastPartnerships: Partnership[] = [
  {
    name: 'Zenith Academy',
    logo: '/image/Kerja-sama/Sponsor/Zenith.png',
    category: 'Sponsor',
    startDate: '2025-01-01',
    endDate: '2025-12-31'
  },
]
