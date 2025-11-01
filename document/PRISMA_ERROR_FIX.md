# 🔧 Solusi Error Prisma Permission

## 🚨 Error yang Dialami
```
EPERM: operation not permitted, rename 'query_engine-windows.dll.node.tmp25692' -> 'query_engine-windows.dll.node'
```

## 💡 Solusi Cepat

### Opsi 1: Manual Fix (Recommended)
```bash
# 1. Stop semua proses Node.js yang berjalan
# Tekan Ctrl+C di terminal yang menjalankan npm/dev server

# 2. Hapus folder Prisma cache
rmdir /s /q node_modules\.prisma

# 3. Restart terminal sebagai Administrator
# Klik kanan Command Prompt > Run as Administrator

# 4. Generate ulang
cd C:\Projek\himasi-unas
npx prisma generate

# 5. Jalankan build
npm run build
```

### Opsi 2: Gunakan Static Build (No Prisma)
```bash
# Jalankan build script alternatif yang tidak butuh Prisma
./build-hostinger-static.bat
```

### Opsi 3: PowerShell Administrator
```powershell
# Buka PowerShell sebagai Administrator
# Jalankan command berikut:
cd C:\Projek\himasi-unas
Remove-Item -Recurse -Force node_modules\.prisma -ErrorAction SilentlyContinue
npm run db:generate
npm run build
```

## 🎯 Rekomendasi untuk Hostinger

**Gunakan `build-hostinger-static.bat`** karena:
- ✅ Tidak butuh Prisma client generation
- ✅ Pure static export yang cocok untuk shared hosting
- ✅ PHP backend untuk database operations
- ✅ Lebih cepat dan reliable

## 📋 Langkah Selanjutnya

1. **Jalankan static build:**
   ```bash
   ./build-hostinger-static.bat
   ```

2. **Upload hasil build:**
   - Folder `hostinger-upload` berisi semua file siap upload
   - Follow petunjuk di `DEPLOYMENT_INSTRUCTIONS.md`

3. **Setup database di Hostinger:**
   - Buat MySQL database
   - Import `database-setup.sql`
   - Update `config.php` dengan credentials

## ⚡ Keuntungan Static Build

- 🚀 **Loading cepat** (static files)
- 💰 **Hemat resource** (no Node.js server)
- 🔒 **Lebih aman** (no server-side vulnerabilities)
- 🎯 **Perfect untuk Hostinger** shared hosting