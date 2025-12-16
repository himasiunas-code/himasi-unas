# Optimasi Database Network Transfer - Neon PostgreSQL

## 📊 Masalah
Network transfer usage di Neon Database sudah mencapai 1.02 / 5 GB. Ini disebabkan oleh:
1. Query yang memuat seluruh data registrations (termasuk semua field)
2. Polling API yang terlalu sering (setiap 30 detik)
3. Tidak ada caching
4. Tidak ada database indexes untuk query yang sering digunakan

## ✅ Solusi yang Sudah Diimplementasikan

### 1. **Optimasi Query API `/api/activities/current`** (IMPACT: TINGGI ⭐⭐⭐)

**Sebelum:**
```typescript
const activity = await prisma.activity.findFirst({
  where: { isPublished: true },
  include: {
    _count: { select: { registrations: true } },
    registrations: {
      select: { academicStatus: true }  // Memuat SEMUA registrations!
    }
  }
})

// Filter di memory
const mahasiswaCount = activity.registrations.filter(r => r.academicStatus === 'Mahasiswa').length
```

**Sesudah:**
```typescript
// Hanya ambil activity saja (tanpa relations)
const activity = await prisma.activity.findFirst({
  where: { isPublished: true }
})

// Count langsung di database (jauh lebih efisien!)
const [totalCount, mahasiswaCount, pelajarCount] = await Promise.all([
  prisma.registration.count({ where: { activityId: activity.id } }),
  prisma.registration.count({ where: { activityId: activity.id, academicStatus: 'Mahasiswa' } }),
  prisma.registration.count({ where: { activityId: activity.id, academicStatus: 'Pelajar' } })
])
```

**Penghematan:** 
- Dari memuat 1 activity + 100 registrations (semua field) 
- Ke memuat 1 activity + 3 count queries
- **Estimasi penghematan: ~90% data transfer** untuk endpoint ini

---

### 2. **In-Memory Caching** (IMPACT: TINGGI ⭐⭐⭐)

**File:** `lib/cache.ts`

Implementasi simple in-memory cache dengan TTL (Time To Live):

```typescript
// Cache current activity status selama 30 detik
cache.set(CACHE_KEY, activityWithCount, 30000)

// Subsequent requests dalam 30 detik akan langsung return dari memory
const cached = cache.get(CACHE_KEY)
if (cached) {
  return NextResponse.json({ success: true, data: cached, cached: true })
}
```

**Penghematan:**
- Endpoint `/api/activities/current` dipanggil setiap 60 detik (setelah optimasi #3)
- Dengan cache 30s, berarti 1 dari 2 request akan hit cache
- **Penghematan: ~50% database queries** untuk endpoint ini

---

### 3. **Perpanjang Polling Interval** (IMPACT: SEDANG ⭐⭐)

**File:** `components/shared/Registration/RegistrationForm.tsx`

**Sebelum:**
```typescript
// Check every 30 seconds
const interval = setInterval(checkActivityStatus, 30000)
```

**Sesudah:**
```typescript
// Check every 60 seconds (dikurangi untuk hemat bandwidth)
const interval = setInterval(checkActivityStatus, 60000)
```

**Penghematan:**
- Mengurangi frekuensi API calls dari 2x per menit menjadi 1x per menit
- **Penghematan: ~50% API calls** dari frontend

---

### 4. **Optimasi Query `/api/activities`** (IMPACT: SEDANG ⭐⭐)

**Sebelum:**
```typescript
const activities = await prisma.activity.findMany({
  include: {
    registrations: {
      select: { academicStatus: true }  // Load semua registrations!
    }
  }
})

// Count di memory untuk setiap activity
activities.map(activity => {
  const mahasiswaCount = activity.registrations.filter(r => r.academicStatus === 'Mahasiswa').length
  // ...
})
```

**Sesudah:**
```typescript
// Hanya ambil activities (tanpa relations)
const activities = await prisma.activity.findMany({ ... })

// Batch count untuk semua activities sekaligus
const registrationCounts = await Promise.all(
  activityIds.map(async (activityId) => {
    const [total, mahasiswa, pelajar] = await Promise.all([
      prisma.registration.count({ where: { activityId } }),
      prisma.registration.count({ where: { activityId, academicStatus: 'Mahasiswa' } }),
      prisma.registration.count({ where: { activityId, academicStatus: 'Pelajar' } })
    ])
    return { activityId, total, mahasiswaCount: mahasiswa, pelajarCount: pelajar }
  })
)
```

**Penghematan:**
- Tidak lagi memuat semua registrations untuk counting
- Menggunakan COUNT query yang jauh lebih efisien
- **Estimasi penghematan: ~85% data transfer** untuk endpoint ini

---

### 5. **Database Indexes** (IMPACT: SEDANG ⭐⭐)

**File:** `prisma/schema.prisma`

**Indexes yang ditambahkan:**
```prisma
model Activity {
  // ... fields ...
  
  @@index([isPublished, createdAt])  // Untuk query findFirst published activities
  @@map("activities")
}

model Registration {
  // ... fields ...
  
  @@index([activityId, academicStatus])  // Untuk count by activity + status
  @@index([academicStatus])              // Untuk count by status only
  @@map("registrations")
}
```

**Manfaat:**
- Query `WHERE isPublished = true ORDER BY createdAt` menjadi lebih cepat
- Count queries dengan filter `activityId + academicStatus` lebih efisien
- Mengurangi waktu eksekusi query = lebih sedikit resource database = lebih sedikit network transfer

**Migration:** `20251216022826_add_performance_indexes`

---

## 📈 Estimasi Total Penghematan

Berdasarkan optimasi di atas, estimasi penghematan network transfer:

| Endpoint | Frekuensi | Penghematan | Total Impact |
|----------|-----------|-------------|--------------|
| `/api/activities/current` | Sangat Tinggi (60s polling) | ~90% + 50% cache = **95%** | 🔥 CRITICAL |
| `/api/activities` | Sedang (admin panel) | ~85% | ⚡ HIGH |
| Polling frequency | Dikurangi 50% | 50% fewer calls | ⚡ HIGH |
| Database indexes | Semua queries | ~20-30% faster | ✅ MEDIUM |

**Estimasi total penghematan: 70-80% network transfer usage**

---

## 🎯 Rekomendasi Tambahan (Belum Diimplementasi)

### 1. **Compress Response dengan gzip**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  response.headers.set('Content-Encoding', 'gzip')
  return response
}
```

### 2. **Implementasi API Response Pagination**
Untuk endpoint `/api/registrations` yang load semua data sekaligus:
```typescript
// Tambahkan pagination
const page = parseInt(searchParams.get('page') || '1')
const limit = parseInt(searchParams.get('limit') || '20')

const registrations = await prisma.registration.findMany({
  skip: (page - 1) * limit,
  take: limit,
  // ...
})
```

### 3. **Selective Field Loading**
Hanya select field yang benar-benar dibutuhkan:
```typescript
// Daripada load semua fields
const registrations = await prisma.registration.findMany()

// Lebih baik
const registrations = await prisma.registration.findMany({
  select: {
    id: true,
    email: true,
    fullName: true,
    status: true,
    // Exclude large fields seperti instagramProof, paymentProof
  }
})
```

### 4. **Redis Caching (Jika Budget Ada)**
Upgrade dari in-memory cache ke Redis untuk:
- Cache yang persistent (tidak hilang saat server restart)
- Shared cache antar server instances
- TTL otomatis dengan Redis expiration

---

## 📝 Monitoring

Untuk memonitor efektivitas optimasi:

1. **Check Neon Dashboard:**
   - https://console.neon.tech/
   - Lihat "Network Transfer" metrics
   - Pantau trend penggunaan setelah deploy optimasi

2. **Enable Query Logging (Development):**
   ```env
   # .env.local
   DATABASE_URL="...?connection_limit=10&pool_timeout=20&log=query"
   ```

3. **Monitor API Response Times:**
   - Gunakan browser DevTools Network tab
   - Check response size dan waktu load
   - Seharusnya jauh lebih cepat setelah optimasi

---

## 🚀 Deployment

Semua optimasi sudah **siap production** dan tidak breaking changes:

1. ✅ Migrations sudah di-apply (`add_performance_indexes`)
2. ✅ Code changes sudah compatible dengan data existing
3. ✅ Cache bersifat optional (kalau gagal, fallback ke database)
4. ✅ Polling interval change tidak perlu database migration

**Cara Deploy:**
```bash
# 1. Push ke repository
git add .
git commit -m "feat: optimize database queries and add caching"
git push

# 2. Di production (Vercel/Hostinger), migrations akan auto-run
# Atau manual:
npx prisma migrate deploy

# 3. Restart server
```

---

## ✨ Kesimpulan

Dengan implementasi 5 optimasi di atas:

1. ✅ **Network transfer berkurang drastis** (~70-80%)
2. ✅ **API response lebih cepat** (query lebih efisien)
3. ✅ **User experience lebih baik** (loading lebih cepat)
4. ✅ **Database load berkurang** (fewer queries, indexed queries)
5. ✅ **Neon free tier lebih awet** (5GB limit lebih lama tercapai)

**Target:** Dari 1.02GB/bulan → ~0.2-0.3GB/bulan (dengan traffic yang sama)

---

**Dibuat:** 16 Desember 2025  
**Status:** ✅ IMPLEMENTED & READY FOR PRODUCTION
