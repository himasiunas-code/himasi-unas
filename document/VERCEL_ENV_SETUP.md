# 🔧 Environment Variables untuk Vercel

## Required Environment Variables di Vercel Dashboard

Buka: https://vercel.com/dashboard → Project → Settings → Environment Variables

### 1. Database Configuration
```
DATABASE_URL = postgresql://neondb_owner:npg_KsuNwTPfe9X7@ep-lucky-dew-a1l98odf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 2. NextAuth Configuration
```
NEXTAUTH_URL = https://your-vercel-app.vercel.app
NEXTAUTH_SECRET = your-nextauth-secret-key-change-this
```

### 3. File Upload Configuration
```
NEXT_PUBLIC_MAX_FILE_SIZE = 5242880
NEXT_PUBLIC_ALLOWED_FILE_TYPES = image/jpeg,image/jpg,image/png
```

### 4. Build Configuration (Optional)
```
PRISMA_GENERATE_DATAPROXY = true
```

## ⚠️ Important Notes:

1. **NEXTAUTH_URL** harus diupdate dengan URL production Vercel Anda
2. **DATABASE_URL** harus sama dengan yang ada di file .env lokal
3. Set environment variables untuk **Production**, **Preview**, dan **Development**
4. Setelah menambah env vars, **redeploy** aplikasi

## 🚀 Steps to Fix Database Connection:

1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. **Add** semua environment variables di atas
3. **Redeploy** aplikasi di Vercel
4. **Test** koneksi database pada URL production

## 🔍 Debug Commands:

Jika masih error, cek logs:
```bash
vercel logs https://your-app.vercel.app
```