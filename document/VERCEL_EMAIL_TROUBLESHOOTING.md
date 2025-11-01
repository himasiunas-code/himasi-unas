# Troubleshooting Email Contact Form di Vercel

## 🔍 Masalah Umum dan Solusi

### 1. Email tidak terkirim di production (Vercel)

#### Kemungkinan Penyebab:
- Environment variables tidak ter-set di Vercel
- SMTP credentials salah atau expired
- Nodemailer tidak kompatibel dengan serverless functions

#### Solusi:

**A. Verifikasi Environment Variables di Vercel:**
1. Buka dashboard Vercel → Project Settings → Environment Variables
2. Pastikan semua variable ada:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   CONTACT_EMAIL=himasiunas@gmail.com
   ```
3. Set untuk Environment: Production, Preview, Development
4. Redeploy aplikasi setelah menambah environment variables

**B. Cek Function Logs di Vercel:**
1. Buka dashboard Vercel → Functions tab
2. Klik pada function `/api/contact`
3. Lihat Real-time logs saat testing form
4. Periksa error message untuk debugging

### 2. Gmail Authentication Error

#### Error: "Username and Password not accepted"

**Solusi:**
1. Pastikan menggunakan **App Password**, bukan password Gmail biasa
2. Setup 2-Factor Authentication di Gmail
3. Generate App Password: Gmail Settings → Security → 2-Step Verification → App passwords
4. Gunakan App Password (16 karakter) sebagai `SMTP_PASS`

### 3. Error "Invalid login" atau "Connection timeout"

**Solusi Alternative - Gmail OAuth2:**

Jika App Password tidak bekerja, gunakan OAuth2:

```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.SMTP_USER,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  },
});
```

### 4. Provider Email Alternative

#### Menggunakan SendGrid (Recommended untuk production):

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: process.env.CONTACT_EMAIL,
  from: process.env.SMTP_USER,
  subject: 'Contact Form',
  html: htmlTemplate,
};

await sgMail.send(msg);
```

#### Menggunakan Resend (Modern alternative):

```javascript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: process.env.SMTP_USER,
  to: process.env.CONTACT_EMAIL,
  subject: 'Contact Form',
  html: htmlTemplate,
});
```

### 5. Debugging Steps

#### Step 1: Test Local
```bash
npm run dev
# Test form di http://localhost:3000/hubungi-kami
```

#### Step 2: Check Environment Variables
Tambahkan log di API route:
```javascript
console.log('Environment check:', {
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_USER: process.env.SMTP_USER,
  hasPassword: !!process.env.SMTP_PASS
});
```

#### Step 3: Test SMTP Connection
```javascript
// Test koneksi sebelum send email
await transporter.verify();
console.log('SMTP connection successful');
```

#### Step 4: Check Vercel Logs
```bash
# Install Vercel CLI
npm i -g vercel

# Login dan check logs
vercel login
vercel logs [deployment-url]
```

### 6. Alternative Solutions

#### A. Using Webhook Service (Zapier/Make)
1. Create webhook di Zapier/Make
2. Forward form data ke webhook
3. Webhook kirim email otomatis

#### B. Using EmailJS (Client-side)
```javascript
import emailjs from '@emailjs/browser';

await emailjs.send(
  'service_id',
  'template_id',
  formData,
  'public_key'
);
```

#### C. Using Formspree/Netlify Forms
- Redirect form ke service external
- Tidak perlu setup SMTP server

### 7. Production-Ready Email Setup

#### Recommended Stack:
1. **SendGrid** - Reliable, good free tier
2. **Resend** - Modern, developer-friendly
3. **Amazon SES** - Scalable, cost-effective
4. **Mailgun** - Feature-rich

#### Environment Setup:
```bash
# Vercel Environment Variables
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
CONTACT_EMAIL=himasiunas@gmail.com
```

### 8. Security Best Practices

- Jangan expose credentials di client-side
- Gunakan API keys dengan minimal permissions
- Implement rate limiting untuk prevent spam
- Validate email addresses server-side
- Use HTTPS di production
- Monitor email delivery rates

---

## 🔧 Quick Fix Commands

```bash
# Redeploy after env changes
vercel --prod

# Check function logs
vercel logs --follow

# Test local dengan production env
vercel env pull .env.local
npm run dev
```

## 📞 Bantuan Lebih Lanjut

Jika masih bermasalah:
1. Check Vercel function logs
2. Test dengan curl/Postman
3. Gunakan alternative email service
4. Contact Vercel support untuk serverless issues