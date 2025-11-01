# Solusi Race Condition pada Sistem Pendaftaran HIMASI

## Masalah yang Diselesaikan

Sebelumnya terdapat masalah race condition pada sistem pendaftaran 2-sesi dimana:

1. **Skenario Masalah:**
   - Slot tersisa 1/4 (misal)
   - User A menyelesaikan Step 1 → slot menjadi 2/4 
   - User B juga menyelesaikan Step 1 → slot menjadi 3/4
   - User C juga menyelesaikan Step 1 → slot menjadi 4/4
   - User D mencoba Step 1 → seharusnya ditolak, tapi jika bersamaan bisa lolos
   - User A, B, C, D semua bisa menyelesaikan Step 2 karena tidak ada validasi slot di Step 2
   - Hasil: Overbooked (lebih dari 4 peserta)

## Solusi yang Diimplementasikan

### 1. **Atomic Slot Reservation di Step 1**

**File yang diubah:** `app/api/registrations/step1/route.ts`

**Perubahan utama:**
- Menggunakan **database transaction** untuk memastikan slot check dan registration creation bersifat atomik
- Re-check slot availability di dalam transaksi untuk mencegah race condition
- Menambahkan field `step1Completed` dan `step2Completed` untuk tracking progress

```typescript
// Gunakan database transaction untuk memastikan slot check dan registration creation atomik
const registration = await prisma.$transaction(async (tx) => {
  // Re-check slot availability dalam transaksi
  const currentActivity = await tx.activity.findUnique({
    where: { id: activity.id },
    include: { _count: { select: { registrations: true } } }
  })

  // Final check untuk maksimal peserta dalam transaksi
  if (currentActivity.maxParticipants && currentActivity._count.registrations >= currentActivity.maxParticipants) {
    throw new Error('SLOT_FULL')
  }

  // Buat pendaftaran dengan slot ter-reserve
  const newRegistration = await tx.registration.create({
    data: {
      // ... data fields
      step1Completed: true,  // Slot reserved
      step2Completed: false, // Step 2 belum selesai
    }
  })

  return newRegistration
})
```

### 2. **Validasi Ganda di Step 2**

**File yang diubah:** `app/api/registrations/step2/route.ts`

**Perubahan utama:**
- Validasi bahwa registration berada dalam status yang benar (step1Completed = true, step2Completed = false)
- Re-check activity status dan deadline di Step 2
- Menggunakan transaction untuk final validation sebelum update

```typescript
// Validasi status registration
if (!step1Completed || step2Completed) {
  return NextResponse.json({
    success: false,
    message: step2Completed 
      ? 'Pendaftaran Anda sudah selesai sebelumnya.' 
      : 'Step 1 belum diselesaikan. Silakan mulai ulang dari sesi 1.'
  }, { status: 400 })
}

// Re-check activity status
const isRegistrationOpen = activity.registrationOpen || (isAutoOpenTime && isWithinDeadline)
if (!isRegistrationOpen) {
  return NextResponse.json({
    success: false,
    message: 'Pendaftaran untuk kegiatan ini sudah ditutup.'
  }, { status: 400 })
}
```

### 3. **Timeout Mechanism untuk Slot Reservation**

**File baru:** `app/api/registrations/cleanup/route.ts`

**Fitur:**
- Endpoint untuk membersihkan registrasi yang tidak selesai dalam 30 menit
- GET endpoint untuk monitoring registrasi yang tidak selesai
- POST endpoint dengan authorization untuk cleanup otomatis

```typescript
// Cari registrasi yang step1Completed = true tapi step2Completed = false
// dan sudah dibuat lebih dari 30 menit
const timeoutMinutes = 30
const timeoutDate = new Date(Date.now() - timeoutMinutes * 60 * 1000)

const incompleteRegistrations = await prisma.registration.findMany({
  where: {
    step1Completed: true,
    step2Completed: false,
    createdAt: { lt: timeoutDate }
  }
})

// Delete registrasi yang expired
const deleteResult = await prisma.registration.deleteMany({
  where: { id: { in: incompleteRegistrations.map(r => r.id) } }
})
```

### 4. **Enhanced Error Handling di Frontend**

**File yang diubah:** `components/shared/Registration/RegistrationForm.tsx`

**Perubahan:**
- Error handling yang lebih spesifik untuk berbagai skenario
- Auto-reset form jika terjadi masalah status
- Informasi slot reservation yang jelas untuk user

```typescript
// Handle specific error cases in Step 1
if (error.message.includes('slot kegiatan sudah penuh')) {
  errorTitle = '😔 Slot Sudah Penuh'
  errorMessage = 'Maaf, slot kegiatan sudah penuh tepat saat Anda mendaftar.'
} else if (error.message.includes('sudah terdaftar')) {
  errorTitle = '📧 Email Sudah Terdaftar'
}

// Handle specific error cases in Step 2  
if (error.message.includes('status tidak valid')) {
  errorTitle = '🔄 Perlu Mulai Ulang'
  // Auto-reset form to step 1
  setTimeout(() => {
    setCurrentStep(1)
    setRegistrationId(null) 
    setStep1Completed(false)
  }, 5000)
}
```

### 5. **Automated Cleanup Scripts**

**File baru:** 
- `cleanup-registrations.sh` (Linux/macOS)
- `cleanup-registrations.bat` (Windows)

**Fungsi:**
- Script untuk menjalankan cleanup secara otomatis via cron job atau Task Scheduler
- Monitoring dan logging cleanup results
- Configurable via environment variables

### 6. **Database Schema Updates**

**File yang diubah:** `prisma/schema.prisma`

**Perubahan:**
```prisma
model Registration {
  // ... existing fields
  step1Completed  Boolean  @default(false)  // Track Step 1 completion
  step2Completed  Boolean  @default(false)  // Track Step 2 completion
  // ... other fields
}
```

## Cara Kerja Sistem Baru

### Flow Normal:
1. **User mulai Step 1** → Mengisi data pribadi & akademik
2. **Submit Step 1** → Database transaction check slot + create registration dengan `step1Completed = true`
3. **Slot ter-reserve** → Slot berkurang, user punya 30 menit untuk Step 2
4. **User mulai Step 2** → Validasi `step1Completed = true && step2Completed = false`
5. **Submit Step 2** → Update registration dengan `step2Completed = true`, status = 'PENDING'

### Handling Race Condition:
1. **Multiple users submit Step 1 bersamaan** → Database transaction memastikan hanya user yang pertama dapat slot terakhir
2. **User lain ditolak** → Error "Slot sudah penuh" dengan pesan yang jelas
3. **Timeout protection** → Registrasi yang tidak selesai dalam 30 menit otomatis dihapus

### Automated Maintenance:
1. **Cron job/Task Scheduler** → Jalankan cleanup script setiap 15 menit
2. **Cleanup process** → Hapus registrasi expired, kembalikan slot ke pool
3. **Monitoring** → Log aktivitas cleanup untuk tracking

## Setup Cleanup Automation

### Linux/macOS (Cron):
```bash
# Edit crontab
crontab -e

# Tambahkan line berikut untuk cleanup setiap 15 menit
*/15 * * * * /path/to/himasi-unas/cleanup-registrations.sh >> /var/log/himasi-cleanup.log 2>&1
```

### Windows (Task Scheduler):
1. Buka Task Scheduler
2. Create Basic Task
3. Set trigger: Daily, repeat every 15 minutes
4. Set action: Start program `cleanup-registrations.bat`

### Environment Variables:
```bash
SITE_URL=https://your-domain.com
CLEANUP_API_KEY=your-secure-api-key
```

## Monitoring dan Debugging

### Check Incomplete Registrations:
```bash
curl "https://your-domain.com/api/registrations/cleanup"
```

### Manual Cleanup:
```bash
curl -X POST \
  -H "Authorization: Bearer your-api-key" \
  "https://your-domain.com/api/registrations/cleanup"
```

### Database Query untuk Monitoring:
```sql
-- Check registrations yang stuck di Step 1
SELECT 
  id, email, fullName, createdAt, updatedAt,
  step1Completed, step2Completed, status
FROM registrations 
WHERE step1Completed = true AND step2Completed = false
ORDER BY createdAt DESC;

-- Check slot utilization
SELECT 
  a.title,
  a.maxParticipants,
  COUNT(r.id) as current_registrations,
  (a.maxParticipants - COUNT(r.id)) as available_slots
FROM activities a
LEFT JOIN registrations r ON a.id = r.activityId
WHERE a.isPublished = true
GROUP BY a.id, a.title, a.maxParticipants;
```

## Benefits dari Solusi Ini

1. **✅ Race Condition Resolved** - Atomic transactions mencegah double booking
2. **✅ Slot Management** - Slot ter-reserve dengan proper cleanup
3. **✅ User Experience** - Error messages yang jelas dan helpful
4. **✅ System Reliability** - Auto-recovery dari incomplete registrations  
5. **✅ Monitoring** - Tools untuk tracking dan debugging issues
6. **✅ Scalability** - Dapat handle concurrent users dengan aman

## Testing Scenarios

Untuk testing solusi ini:

1. **Test Race Condition** - Multiple users submit Step 1 bersamaan saat slot tinggal 1
2. **Test Timeout** - Submit Step 1, tunggu 30+ menit, coba Step 2
3. **Test Cleanup** - Buat registrasi incomplete, jalankan cleanup manual
4. **Test Error Handling** - Berbagai skenario error di frontend
5. **Test Recovery** - Reset form otomatis saat status error

Solusi ini memastikan sistem pendaftaran HIMASI dapat handle concurrent users dengan aman dan memberikan user experience yang baik.