# Fitur Email Persetujuan dan Penolakan Pendaftaran

## Overview
Fitur ini secara otomatis mengirimkan email kepada pendaftar ketika status pendaftaran mereka diubah oleh admin menjadi APPROVED (disetujui) atau REJECTED (ditolak).

## Fitur Utama

### 1. Email Persetujuan
- **Trigger**: Ketika admin menyetujui pendaftaran (status → APPROVED)
- **Konten Email**:
  - Ucapan selamat dengan desain yang menarik
  - Detail kegiatan (nama, tanggal, lokasi)
  - Langkah-langkah selanjutnya yang harus dilakukan peserta
  - Link kontak WhatsApp untuk bantuan

### 2. Email Penolakan dengan Alasan
- **Trigger**: Ketika admin menolak pendaftaran (status → REJECTED)
- **Modal Input Alasan**: 
  - Admin wajib memasukkan alasan penolakan
  - Maksimal 500 karakter
  - Interface yang user-friendly dengan warning message
- **Konten Email**:
  - Pemberitahuan penolakan yang sopan
  - Detail kegiatan yang ditolak
  - Alasan penolakan (jika diisi admin)
  - Motivasi untuk ikut kegiatan lain di masa depan
  - Link kontak dan Instagram HIMASI

### 3. Tampilan Alasan Penolakan
- Alasan penolakan ditampilkan di halaman admin
- Styling khusus dengan background merah muda
- Hanya muncul untuk pendaftaran dengan status REJECTED

## Technical Implementation

### Files yang Dimodifikasi/Dibuat:

1. **`lib/email-service.ts`** (Baru)
   - Class EmailService untuk mengelola pengiriman email
   - Template HTML yang responsive dan menarik
   - Method sendApprovalEmail() dan sendRejectionEmail()

2. **`app/api/admin/registrations/[id]/route.ts`**
   - Integrasi dengan EmailService
   - Pengiriman email otomatis setelah update status berhasil
   - Error handling untuk email tanpa menggagalkan update status

3. **`app/admin/registrations/page.tsx`**
   - Modal untuk input alasan penolakan
   - State management untuk modal
   - Tampilan alasan penolakan di list pendaftaran
   - Handle ESC key untuk menutup modal

### Database Schema
Menggunakan field yang sudah ada:
- `rejectedReason` - menyimpan alasan penolakan
- `approvedAt` - timestamp persetujuan
- `approvedBy` - admin yang menyetujui

## Template Email

### Email Persetujuan
- Header hijau dengan icon centang
- Ucapan selamat personal
- Detail kegiatan dengan format yang rapi
- Checklist langkah selanjutnya
- Contact button untuk WhatsApp

### Email Penolakan  
- Header oranye/kuning dengan icon info
- Tone yang sopan dan supportive
- Penjelasan bahwa masih ada kesempatan lain
- Alasan penolakan (jika ada) dalam box terpisah
- Link ke WhatsApp dan Instagram

## Environment Variables
Menggunakan konfigurasi email yang sama dengan contact form:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## User Experience

### Admin Flow:
1. Admin melihat pendaftaran PENDING
2. Untuk **Persetujuan**: Klik "Setujui" → Email otomatis terkirim
3. Untuk **Penolakan**: Klik "Tolak" → Modal muncul → Input alasan → Email terkirim

### Peserta Flow:
1. Mendaftar kegiatan
2. Menunggu persetujuan admin
3. Menerima email pemberitahuan sesuai keputusan admin
4. Follow up sesuai instruksi di email

## Error Handling
- Email error tidak menggagalkan update status
- Log error email ke console untuk debugging
- Success message kepada admin setelah email terkirim
- Validation input alasan penolakan

## Security & Performance
- Email service menggunakan connection verification
- Template HTML di-sanitize
- Rate limiting inherent dari SMTP provider
- Async email sending untuk performa yang baik

## Future Enhancements
- Email template customization per kegiatan
- Email tracking dan delivery status
- Reminder email untuk kegiatan yang akan datang
- Bulk actions dengan email notification