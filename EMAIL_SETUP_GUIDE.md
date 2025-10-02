# Setup Email Contact Form - HIMASI UNAS

## 📧 Konfigurasi Email

Form "Kirim Pesan Cepat" sudah terintegrasi dengan sistem email otomatis. Berikut cara setup-nya:

### 1. Environment Variables

Tambahkan konfigurasi berikut ke file `.env.local` Anda:

```bash
# SMTP Server Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Contact Email (email tujuan)
CONTACT_EMAIL=himasi@unas.ac.id
```

### 2. Setup Gmail (Recommended)

#### Langkah-langkah:
1. **Aktifkan 2-Factor Authentication** di akun Gmail Anda
2. Pergi ke **Google Account Settings** → **Security** → **2-Step Verification**
3. Scroll ke bawah dan pilih **App passwords**
4. Pilih **Mail** dan **Other (custom name)**, beri nama "HIMASI Website"
5. Copy **App Password** yang di-generate
6. Gunakan App Password sebagai `SMTP_PASS` (bukan password Gmail biasa)

#### File .env.local example untuk Gmail:
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=himasi.website@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
CONTACT_EMAIL=himasi@unas.ac.id
```

### 3. Provider Email Lain

#### Outlook/Hotmail:
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

#### Yahoo Mail:
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

#### Custom SMTP:
Hubungi hosting provider untuk detail SMTP server.

### 4. Fitur Email System

#### ✅ Yang akan dikirim ke CONTACT_EMAIL:
- **Template profesional** dengan branding HIMASI UNAS
- **Semua detail form**: Nama, Email, Telepon, Subjek, Pesan
- **Format yang rapi** dengan styling HTML
- **Reply-to address** otomatis ke email pengirim
- **Timestamp** pengiriman

#### ✅ Konfirmasi ke pengirim:
- **Email konfirmasi otomatis** ke user yang mengirim
- **Ringkasan pesan** yang telah dikirim
- **Informasi waktu respon** (1x24 jam)
- **Template profesional** dengan branding

### 5. Testing

#### Local Testing:
1. Pastikan environment variables sudah diset
2. Jalankan `npm run dev`
3. Akses halaman `/hubungi-kami`
4. Coba isi form dan kirim
5. Cek email di CONTACT_EMAIL dan email pengirim

#### Production:
1. Set environment variables di hosting (Vercel/Netlify)
2. Deploy aplikasi
3. Test form di production

### 6. Troubleshooting

#### Error "Authentication failed":
- Pastikan menggunakan App Password, bukan password biasa
- Cek 2FA sudah aktif di Gmail

#### Email tidak terkirim:
- Cek environment variables
- Cek logs di console/hosting
- Pastikan SMTP settings benar

#### Email masuk ke spam:
- Setup SPF/DKIM records di domain
- Gunakan email domain sendiri sebagai pengirim

### 7. Customization

File API: `app/api/contact/route.ts`

Anda bisa customize:
- Template email HTML
- Validasi form
- Email subjects
- Error handling
- Auto-reply messages

### 8. Security

#### Best Practices:
- Jangan commit `.env.local` ke git
- Gunakan App Password, bukan password utama
- Implement rate limiting untuk prevent spam
- Validasi input di server-side
- Gunakan HTTPS di production

### 9. Monitoring

- Monitor email delivery rates
- Log error untuk debugging
- Setup alerts untuk failed emails
- Track form submission analytics

---

**Form sudah siap digunakan!** 🎉

User bisa langsung:
- Isi form di halaman `/hubungi-kami`
- Otomatis terkirim ke email tujuan
- Terima konfirmasi di email mereka
- Tim HIMASI bisa langsung reply