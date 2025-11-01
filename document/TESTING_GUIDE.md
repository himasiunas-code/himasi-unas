# 🧪 Testing Panduan Pendaftaran dengan Neon Database

## Server Status ✅
Server Next.js sudah running di: **http://localhost:3000**

## 🔍 Manual Testing Steps

### 1. **Test Database Connection**
```bash
# Buka Prisma Studio untuk melihat data di Neon
npm run db:studio
```
- Buka http://localhost:5555
- Pastikan tables `activities`, `registrations`, `admins` terlihat
- Cek apakah sample data dari seed sudah ada

### 2. **Test Halaman Kegiatan**
1. **Buka**: http://localhost:3000/kegiatan
2. **Cek countdown timer** dan status pendaftaran
3. **Status yang mungkin**:
   - ⏳ **Waiting**: Belum dibuka (tombol disabled)
   - ✅ **Open**: Pendaftaran terbuka (tombol "Daftar Sekarang" aktif)  
   - ❌ **Closed**: Sudah ditutup (tombol disabled)

### 3. **Test Form Pendaftaran**
1. **Klik "Daftar Sekarang"** (jika status open)
2. **URL**: http://localhost:3000/pendaftaran
3. **Isi form dengan data test**:
   ```
   Email: test@example.com
   Nama: John Doe Test
   No HP: 08123456789
   Tahun Angkatan: 2020
   Fakultas: FTKI
   Jurusan: Sistem Informasi
   Instagram: @johndoe
   Upload: Screenshot IG (JPG/PNG, max 5MB)
   ```
4. **Klik "Kirim Pendaftaran"**

### 4. **Verifikasi Data Tersimpan**

#### A. Via Prisma Studio
1. **Buka**: http://localhost:5555
2. **Pilih table**: `Registration`
3. **Cek**: Data pendaftaran baru muncul
4. **Verifikasi**: Semua field terisi dengan benar

#### B. Via API Endpoint
```bash
# Test GET activities
curl http://localhost:3000/api/activities

# Test GET registrations  
curl http://localhost:3000/api/registrations
```

## 📊 Expected Results

### ✅ **Sukses Indicators:**
1. **Form submission**: Loading → Success message
2. **Database**: Data muncul di Prisma Studio  
3. **API**: Endpoint return success response
4. **Neon**: Data tersimpan di cloud database

### ❌ **Possible Issues & Solutions:**

#### **1. "No activity available for registration"**
```bash
# Solution: Cek apakah ada activity dengan registrationOpen=true
npm run db:studio
# Atau update activity via studio
```

#### **2. "Registration is closed"**  
```bash
# Solution: Update activity.registrationOpen = true di Prisma Studio
```

#### **3. "Email already registered"**
```bash
# Solution: Gunakan email berbeda untuk test
```

#### **4. Database connection error**
```bash
# Solution: Cek DATABASE_URL di .env
# Pastikan Neon database accessible
```

## 🎯 **Complete Test Scenario**

### Test Case 1: **Pendaftaran Sukses**
```
1. Buka /kegiatan → Status "Open" ✅
2. Klik "Daftar Sekarang" → Form terbuka ✅  
3. Isi semua field required → Validasi pass ✅
4. Upload screenshot → File accepted ✅
5. Submit → Loading → Success message ✅
6. Cek Prisma Studio → Data tersimpan ✅
```

### Test Case 2: **Validasi Form**  
```
1. Submit form kosong → Error messages ✅
2. Email invalid format → Validation error ✅
3. File > 5MB → Size error ✅
4. File bukan image → Type error ✅
```

### Test Case 3: **Duplicate Registration**
```
1. Daftar dengan email sama 2x → Error "already registered" ✅
```

## 🔧 **Development Tools**

### **Prisma Studio** (Database GUI)
```bash
npm run db:studio
# http://localhost:5555
```

### **API Testing**
```bash
# Get all activities
curl http://localhost:3000/api/activities?published=true

# Get specific activity  
curl http://localhost:3000/api/activities/workshop-nextjs-2024

# Get registrations
curl http://localhost:3000/api/registrations

# Submit registration (POST)
curl -X POST http://localhost:3000/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "activityId": "activity-id-here",
    "email": "test@example.com", 
    "fullName": "Test User",
    "phone": "08123456789",
    "yearClass": "2020",
    "faculty": "FTKI",
    "major": "Sistem Informasi",
    "instagramHandle": "@testuser"
  }'
```

## 🌐 **Production Testing (Neon)**

Untuk memastikan production ready:

1. **Deploy ke Vercel** dengan environment variables
2. **Test dengan production URL**
3. **Monitor Neon dashboard** untuk connection stats
4. **Load test** dengan multiple registrations

## 📞 **Debug Checklist**

Jika ada masalah:

- [ ] ✅ Neon database connection working
- [ ] ✅ Environment variables correct  
- [ ] ✅ Prisma Client generated
- [ ] ✅ Sample data seeded
- [ ] ✅ Next.js server running
- [ ] ✅ API endpoints responding
- [ ] ✅ Form validation working
- [ ] ✅ Data persisting to Neon

---

**🚀 Ready to test! Start with step 1 and work through each test case.**