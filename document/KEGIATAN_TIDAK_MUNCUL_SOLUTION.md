# Panduan: Kegiatan Tidak Muncul di Halaman Kegiatan

## Masalah yang Sering Terjadi

Jika kegiatan yang sudah dibuat di admin panel tidak muncul di halaman kegiatan, kemungkinan besar masalahnya adalah:

**🔍 Kegiatan belum di-publikasikan** - Status `isPublished = false`

## Cara Mengecek dan Mengatasi

### 1. Melalui Admin Panel (Cara Termudah)

1. **Login ke Admin Panel**: `/admin`
2. **Masuk ke Manajemen Kegiatan**: `/admin/activities`
3. **Edit kegiatan** yang tidak muncul
4. **Pastikan toggle berikut aktif**:
   - ✅ **"Publikasikan Kegiatan"** - Agar muncul di halaman publik
   - ✅ **"Buka Pendaftaran"** - Agar peserta bisa mendaftar
5. **Klik "Update"**

### 2. Mengecek Status Kegiatan Manual

Jika perlu mengecek status semua kegiatan di database:

```typescript
// Buat file: check-activities.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkActivities() {
  const activities = await prisma.activity.findMany({
    include: { _count: { select: { registrations: true } } },
    orderBy: { createdAt: 'desc' }
  })

  activities.forEach((activity, index) => {
    console.log(`📋 Activity ${index + 1}:`)
    console.log(`   Title: ${activity.title}`)
    console.log(`   Published: ${activity.isPublished ? '✅ YES' : '❌ NO'}`)
    console.log(`   Registration Open: ${activity.registrationOpen ? '✅ YES' : '❌ NO'}`)
    console.log('')
  })

  await prisma.$disconnect()
}

checkActivities()
```

Jalankan dengan: `npx tsx check-activities.ts`

### 3. Fix Otomatis untuk Kegiatan Unpublished

```typescript
// Buat file: publish-activity.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function publishLatestActivity() {
  const unpublishedActivities = await prisma.activity.findMany({
    where: { isPublished: false },
    orderBy: { createdAt: 'desc' }
  })

  if (unpublishedActivities.length > 0) {
    const latest = unpublishedActivities[0]
    
    await prisma.activity.update({
      where: { id: latest.id },
      data: {
        isPublished: true,
        registrationOpen: true
      }
    })

    console.log(`✅ Published: ${latest.title}`)
  }

  await prisma.$disconnect()
}

publishLatestActivity()
```

Jalankan dengan: `npx tsx publish-activity.ts`

## Kenapa Masalah Ini Terjadi?

### 1. **Default Setting Lama**
Sebelumnya, kegiatan baru dibuat dengan `isPublished: false` secara default untuk keamanan.

### 2. **Setting Tersembunyi**
Pengaturan publikasi sempat disembunyikan di admin panel, sehingga admin tidak sadar harus mengaktifkannya.

### 3. **API Filter**
Halaman kegiatan hanya menampilkan kegiatan dengan `isPublished: true`:

```typescript
// /api/activities/current
const activity = await prisma.activity.findFirst({
  where: {
    isPublished: true  // ← Filter ini yang menyebabkan kegiatan tidak muncul
  }
})
```

## Pencegahan ke Depan

### 1. **Default Values Updated**
Sekarang kegiatan baru otomatis:
- ✅ `isPublished: true` - Langsung terpublikasi
- ✅ `registrationOpen: true` - Langsung terbuka untuk pendaftaran

### 2. **UI Improvement**
- Toggle pengaturan sekarang **visible** dan jelas
- Ada **peringatan** pentingnya publikasi kegiatan
- **Badge status** di daftar kegiatan untuk mudah identifikasi

### 3. **Visual Indicators**
Di admin panel sekarang ada badge:
- 🟢 **"Published"** - Kegiatan muncul di website
- 🔘 **"Draft"** - Kegiatan tidak muncul di website
- 🟢 **"Open"** - Pendaftaran terbuka
- 🔘 **"Closed"** - Pendaftaran tertutup

## Quick Reference

| Status | Muncul di Website | Bisa Daftar | Action |
|--------|------------------|-------------|---------|
| `isPublished: false` | ❌ | ❌ | Edit → Aktifkan "Publikasikan" |
| `isPublished: true, registrationOpen: false` | ✅ | ❌ | Edit → Aktifkan "Buka Pendaftaran" |
| `isPublished: true, registrationOpen: true` | ✅ | ✅ | Perfect! 🎉 |

## Troubleshooting Lanjutan

Jika kegiatan masih tidak muncul setelah dipublikasi:

1. **Refresh browser** - Cache mungkin belum update
2. **Cek jadwal** - Pastikan tanggal kegiatan belum lewat
3. **Cek deadline** - Pastikan deadline pendaftaran masih berlaku
4. **Restart server** - `npm run dev` ulang jika perlu

## Monitoring

Untuk memantau kegiatan yang aktif:
- **Admin Panel**: `/admin/activities` - Lihat status badge
- **Debug API**: `/api/activities/debug` - Detail semua kegiatan
- **Current API**: `/api/activities/current` - Kegiatan yang tampil di website

---

**💡 Tips**: Selalu pastikan toggle "Publikasikan Kegiatan" aktif sebelum save!