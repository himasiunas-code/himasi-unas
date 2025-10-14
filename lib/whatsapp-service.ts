export interface WhatsAppMessage {
  target: string // Phone number with country code
  message: string
}

export interface FontteResponse {
  status: boolean
  message?: string
  data?: Record<string, unknown>
}

export class WhatsAppService {
  private readonly apiUrl = 'https://api.fonnte.com/send'
  private readonly token: string

  constructor() {
    this.token = process.env.FONNTE_TOKEN || ''
    
    if (!this.token) {
      throw new Error('FONNTE_TOKEN environment variable is required')
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters
    let cleaned = phone.replace(/\D/g, '')
    
    // If starts with 0, replace with 62 (Indonesia country code)
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1)
    }
    
    // If doesn't start with country code, add 62
    if (!cleaned.startsWith('62')) {
      cleaned = '62' + cleaned
    }
    
    return cleaned
  }

  async sendMessage(phoneNumber: string, message: string): Promise<boolean> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber)
      
      const payload = {
        target: formattedPhone,
        message: message,
        countryCode: '62' // Indonesia
      }

      console.log('Sending WhatsApp message to:', formattedPhone)
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': this.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result: FontteResponse = await response.json()
      
      if (!response.ok) {
        console.error('Fonnte API error:', result)
        return false
      }

      if (result.status) {
        console.log('WhatsApp message sent successfully:', result.message)
        return true
      } else {
        console.error('Fonnte API returned error:', result.message)
        return false
      }
      
    } catch (error) {
      console.error('Error sending WhatsApp message:', error)
      return false
    }
  }

  async sendApprovalMessage(phoneNumber: string, fullName: string, activityTitle: string): Promise<boolean> {
    const message = `🎉 *PENDAFTARAN ANDA TELAH DISETUJUI*

Halo ${fullName}!👋

Selamat! Pendaftaran Anda untuk kegiatan *${activityTitle}* telah resmi disetujui oleh tim admin HIMASI UNAS.

📝 *Langkah Selanjutnya:*
• Anda akan segera bergabung dalam grup WhatsApp peserta untuk mendapatkan informasi terbaru.
• Pantau terus media sosial HIMASI UNAS agar tidak ketinggalan update dan pengumuman penting.
• Jika ada pertanyaan atau kendala, silakan hubungi admin HIMASI melalui kontak resmi yang tersedia.

Terima kasih atas antusiasme dan partisipasi Anda!
Kami tidak sabar menantikan kehadiran Anda dalam kegiatan ini 🤝


*HIMASI UNAS*
Himpunan Mahasiswa Sistem Informasi
*Universitas Nasional – Jakarta*
#HIMASIUNAS #Indofood #MahasiswaAktif #SistemInformasi`

    return await this.sendMessage(phoneNumber, message)
  }

  async sendRejectionMessage(phoneNumber: string, fullName: string, activityTitle: string, reason: string): Promise<boolean> {
    const message = `❌ *PENDAFTARAN TIDAK DISETUJUI*

Halo ${fullName},

Terima kasih atas ketertarikan dan partisipasi Anda dalam kegiatan *${activityTitle}*. Namun, setelah dilakukan peninjauan, kami belum dapat menyetujui pendaftaran Anda pada kesempatan ini.

📋 *Alasan Penolakan:*
${reason}

💡 *Saran & Kesempatan Berikutnya:*
• Anda tetap berpeluang untuk mendaftar pada kegiatan HIMASI UNAS selanjutnya.
• Pastikan seluruh syarat dan ketentuan kegiatan dipenuhi sesuai waktu yang telah ditentukan.
• Jika Anda memerlukan klarifikasi atau memiliki pertanyaan lebih lanjut, silakan menghubungi admin HIMASI melalui kontak resmi.

Kami sangat menghargai semangat Anda, dan semoga dapat bergabung di kegiatan kami berikutnya 🙏

---
*HIMASI UNAS*
Himpunan Mahasiswa Sistem Informasi
*Universitas Nasional – Jakarta*
#HIMASIUNAS #Indofood #MahasiswaAktif #SistemInformasi`

    return await this.sendMessage(phoneNumber, message)
  }
}

// Export singleton instance
export const whatsappService = new WhatsAppService()