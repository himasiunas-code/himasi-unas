# Setup Database PostgreSQL + Prisma untuk Sistem Pendaftaran HIMASI

## 📋 Overview

Sistem database ini dibuat khusus untuk mengelola pendaftaran kegiatan HIMASI UNAS. Fitur utama meliputi:
- ✅ Manajemen kegiatan/event
- ✅ Sistem pendaftaran peserta  
- ✅ Upload screenshot bukti follow Instagram
- ✅ Validasi form dan file
- ✅ Status approval (pending, approved, rejected)

## 🗄️ Database Schema

### Model Activity
- **id**: Unique identifier
- **title**: Judul kegiatan
- **slug**: URL-friendly identifier
- **description**: Deskripsi singkat
- **content**: Konten detail (HTML)
- **image**: URL gambar poster
- **category**: Kategori (Workshop, Seminar, Competition)
- **startDate**: Tanggal mulai
- **endDate**: Tanggal selesai  
- **location**: Lokasi kegiatan
- **maxParticipants**: Maksimal peserta
- **currentParticipants**: Jumlah peserta saat ini
- **registrationOpen**: Status pendaftaran terbuka/tutup
- **registrationDeadline**: Batas waktu pendaftaran
- **requiresApproval**: Perlu approval admin atau otomatis
- **isPublished**: Status publikasi

### Model Registration
- **id**: Unique identifier
- **activityId**: Reference ke Activity
- **email**: Email peserta (unique per activity)
- **fullName**: Nama lengkap
- **phone**: Nomor HP
- **yearClass**: Tahun angkatan (2020, 2021, dst)
- **faculty**: Fakultas
- **major**: Jurusan
- **instagramProof**: URL screenshot bukti follow IG
- **instagramHandle**: Username Instagram
- **status**: Status (PENDING, APPROVED, REJECTED, ATTENDED, ABSENT)
- **motivation**: Motivasi mengikuti (optional)
- **specialRequest**: Permintaan khusus (optional)

## 🚀 Setup Instructions

### 1. Prerequisites
```bash
# Pastikan sudah ada PostgreSQL database
# Bisa local atau cloud (Railway, Supabase, Neon, dll)
```

### 2. Environment Setup
```bash
# Copy dan edit .env file
cp .env.example .env

# Update DATABASE_URL dengan kredensial database Anda
DATABASE_URL="postgresql://username:password@host:port/database_name"
```

### 3. Database Migration
```bash
# Generate Prisma Client
npm run db:generate

# Run database migration
npm run db:migrate

# Seed sample data
npm run db:seed
```

### 4. Development
```bash
# Start development server
npm run dev

# Open Prisma Studio (optional)
npm run db:studio
```

## 🛠️ Available Scripts

- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema tanpa migration files
- `npm run db:reset` - Reset database
- `npm run db:seed` - Seed sample data
- `npm run db:studio` - Open Prisma Studio GUI

## 📱 Frontend Integration

### Halaman Pendaftaran
- **URL**: `/pendaftaran`
- **Component**: `RegistrationForm.tsx`
- **Features**:
  - Form validation
  - File upload untuk screenshot
  - Preview image
  - Progress indicators
  - Error handling

### Halaman Kegiatan  
- **URL**: `/kegiatan`
- **Component**: `Pendaftaran.tsx`
- **Features**:
  - Countdown timer
  - Status dinamis (waiting, open, closed)
  - Tombol daftar yang adaptive

## 🔗 API Endpoints

### Activities
```typescript
// GET /api/activities
// Ambil semua kegiatan
const activities = await fetch('/api/activities?published=true')

// GET /api/activities/[slug]  
// Ambil detail kegiatan berdasarkan slug
const activity = await fetch('/api/activities/workshop-nextjs-2024')
```

### Registrations
```typescript
// POST /api/registrations
// Submit pendaftaran baru
const response = await fetch('/api/registrations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    activityId: 'activity-id',
    email: 'user@example.com',
    fullName: 'John Doe',
    phone: '08123456789',
    yearClass: '2020',
    faculty: 'FTKI',
    major: 'Sistem Informasi',
    instagramHandle: '@johndoe',
    // instagramProof akan diupload terpisah
  })
})

// GET /api/registrations
// Ambil pendaftaran (untuk admin)
const registrations = await fetch('/api/registrations?activityId=xxx')
```

## 📂 File Structure

```
app/
├── pendaftaran/
│   └── page.tsx              # Halaman pendaftaran
├── api/
│   ├── activities/
│   │   ├── route.ts          # CRUD activities
│   │   └── [slug]/route.ts   # Get activity by slug
│   └── registrations/
│       └── route.ts          # CRUD registrations

components/shared/
├── Registration/
│   └── RegistrationForm.tsx  # Form pendaftaran
└── Kegiatan/
    └── Pendaftaran.tsx       # Status & tombol daftar

prisma/
├── schema.prisma             # Database schema
├── seed.ts                   # Sample data
└── migrations/               # Migration files

lib/
└── prisma.ts                 # Prisma Client instance
```

## 🎯 Usage Example

```typescript
// Import Prisma Client
import { prisma } from '@/lib/prisma'

// Create new activity
const activity = await prisma.activity.create({
  data: {
    title: "Workshop React",
    slug: "workshop-react-2024", 
    description: "Belajar React dari dasar",
    startDate: new Date('2024-10-15'),
    registrationOpen: true,
    maxParticipants: 50
  }
})

// Submit registration
const registration = await prisma.registration.create({
  data: {
    activityId: activity.id,
    email: "user@example.com",
    fullName: "John Doe",
    phone: "08123456789",
    yearClass: "2020",
    faculty: "FTKI", 
    major: "Sistem Informasi",
    instagramHandle: "@johndoe"
  }
})

// Get activity with registrations
const activityWithStats = await prisma.activity.findUnique({
  where: { slug: "workshop-react-2024" },
  include: {
    registrations: true,
    _count: { select: { registrations: true } }
  }
})
```

## 🔒 Security & Validation

### Form Validation
- Email format validation
- Phone number format check
- Required fields validation
- File type & size validation (images only, max 5MB)

### Database Constraints
- Unique constraint pada (activityId + email)
- Status enum validation
- Data type validation

### File Upload Security
- File type restriction (JPG, JPEG, PNG only)
- File size limit (5MB)
- Safe file handling

## 🚀 Deployment Checklist

### Environment Variables
```env
DATABASE_URL="postgresql://user:pass@host:port/db"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="secure-random-string"
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_ALLOWED_FILE_TYPES="image/jpeg,image/jpg,image/png"
```

### Database Setup
```bash
# Production migration
npx prisma migrate deploy

# Seed production data (optional)
npm run db:seed
```

### File Storage
- Setup cloud storage (Cloudinary, AWS S3, dll) untuk production
- Update upload logic untuk menggunakan cloud storage
- Implement proper image optimization

## 📞 Support

Jika ada pertanyaan atau masalah:
1. Cek error di console browser
2. Periksa database connection
3. Pastikan environment variables sudah benar
4. Cek Prisma Studio untuk debug database

---

**Created for HIMASI UNAS Registration System**