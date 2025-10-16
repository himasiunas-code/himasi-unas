# Admin Panel Documentation

## Overview
Admin panel telah berhasil dibuat untuk mengelola registrasi dan melihat statistik website HIMASI. Panel ini dilengkapi dengan autentikasi sederhana dan antarmuka yang user-friendly.

## Fitur Utama

### 1. Dashboard Admin (`/admin/dashboard`)
- **Overview Statistics**: Total kegiatan, total pendaftar, pendaftar 7 hari terakhir, kegiatan published
- **Status Pendaftaran**: Breakdown berdasarkan status (PENDING, APPROVED, REJECTED, ATTENDED, ABSENT)
- **Top Kegiatan**: Kegiatan dengan pendaftar terbanyak
- **Pendaftaran Terbaru**: Tabel 10 pendaftaran terbaru dengan detail lengkap

### 2. Kelola Pendaftaran (`/admin/registrations`)
- **Filter & Search**: Cari berdasarkan nama, email, atau kegiatan
- **Status Management**: 
  - Approve/Reject pendaftaran PENDING
  - Mark attendance untuk peserta APPROVED
  - Delete pendaftaran
- **Export CSV**: Export data pendaftaran ke file CSV
- **Bulk Operations**: Kelola multiple registrations

### 3. Autentikasi
- **Login Page** (`/admin/login`): Form login sederhana dengan password protection
- **Session Management**: Cookie-based session dengan middleware protection
- **Logout**: Secure logout functionality

## Struktur File

```
app/admin/
├── layout.tsx          # Admin layout dengan sidebar navigation
├── page.tsx           # Redirect ke dashboard
├── login/
│   └── page.tsx       # Halaman login admin panel
├── dashboard/
│   └── page.tsx       # Dashboard dengan statistik
└── registrations/
    └── page.tsx       # Kelola pendaftaran

app/api/admin/
├── auth/
│   └── route.ts       # API autentikasi admin
├── stats/
│   └── route.ts       # API statistik dashboard
└── registrations/
    └── [id]/
        └── route.ts   # API update/delete registrasi

middleware.ts          # Protection middleware untuk admin area
```

## API Endpoints

### Autentikasi
- `POST /api/admin/auth` - Login admin
- `GET /api/admin/auth` - Check authentication status
- `DELETE /api/admin/auth` - Logout admin

### Statistik
- `GET /api/admin/stats` - Comprehensive statistics untuk dashboard

### Management
- `PATCH /api/admin/registrations/[id]` - Update status pendaftaran
- `DELETE /api/admin/registrations/[id]` - Delete pendaftaran
- `GET /api/registrations` - Get all registrations dengan filter

## Kredensial Login

**Password Admin**: `himasi#25gokilparah.`

## Update Terbaru (v2.1)

### 🔐 **Authentication Improvements**
- **Dynamic Profile Display**: Profil admin hanya muncul setelah login berhasil
- **Improved Logout**: Logout sekarang berfungsi dengan benar dan memberikan feedback
- **Session Management**: Pengecekan otomatis status authentication
- **Loading States**: Loading indicator saat proses login/logout

### 🎯 **User Experience Enhancements**
- **Conditional Rendering**: Navbar hanya menampilkan elemen yang relevan
- **Visual Feedback**: Loading spinners dan status indicators
- **Error Handling**: Pesan error yang lebih informatif
- **Responsive States**: Proper disabled states selama proses authentication

## Cara Menggunakan

### 1. Akses Admin Panel
1. Buka browser dan navigasi ke `/admin`
2. Akan otomatis redirect ke `/admin/login`
3. Masukkan password: `himasi2024`
4. Setelah login sukses, akan redirect ke dashboard

### 2. Dashboard
- Lihat overview statistik keseluruhan
- Monitor status pendaftaran
- Cek kegiatan dengan pendaftar terbanyak
- Review pendaftaran terbaru

### 3. Kelola Pendaftaran
1. Klik menu "Pendaftaran" di sidebar
2. Gunakan search box untuk mencari registrasi tertentu
3. Filter berdasarkan status pendaftaran
4. Untuk setiap pendaftaran:
   - **PENDING**: Bisa approve atau reject
   - **APPROVED**: Bisa mark sebagai attended/absent
   - **Semua status**: Bisa delete

### 4. Export Data
- Klik tombol "Export CSV" di halaman registrations
- File akan otomatis ter-download dengan format: `registrations_YYYY-MM-DD.csv`

## Security Features

### 1. Authentication
- Password-based authentication
- Secure cookie session management
- Auto logout after 24 jam

### 2. Middleware Protection
- Semua route `/admin/*` (kecuali `/admin/login`) terproteksi
- Auto redirect ke login jika belum authenticated
- Session validation untuk setiap request

### 3. API Security
- Admin API routes memerlukan valid session
- Input validation pada semua endpoints
- Error handling yang proper

## Responsive Design
- **Desktop**: Full sidebar navigation
- **Mobile**: Collapsible sidebar dengan overlay
- **Tablet**: Adaptive layout untuk semua ukuran screen

## Status Workflow

```
PENDING → APPROVED → ATTENDED
    ↓         ↓
REJECTED    ABSENT
```

### Status Descriptions:
- **PENDING**: Pendaftaran baru, menunggu approval
- **APPROVED**: Pendaftaran disetujui, peserta bisa hadir
- **REJECTED**: Pendaftaran ditolak (bisa diberi alasan)
- **ATTENDED**: Peserta hadir pada kegiatan
- **ABSENT**: Peserta tidak hadir pada kegiatan

## Customization Options

### 1. Ubah Password Admin
Edit file `app/api/admin/auth/route.ts`:
```typescript
const ADMIN_PASSWORD = 'password_baru'
```

### 2. Extend Session Duration
Edit file `app/api/admin/auth/route.ts`:
```typescript
maxAge: 60 * 60 * 24 * 7  // 7 hari
```

### 3. Tambah Navigation Menu
Edit file `app/admin/layout.tsx` di bagian `navigation` array.

## Future Enhancements

### Planned Features:
1. **Role-based Access Control**: Multiple admin levels
2. **Activity Management**: CRUD operations untuk kegiatan
3. **Email Notifications**: Auto email untuk approval/rejection
4. **Advanced Analytics**: Charts dan graphs untuk statistik
5. **Batch Operations**: Bulk approve/reject/delete
6. **Audit Log**: Track semua admin activities

### Database Considerations:
- Add `adminUsers` table untuk multiple admin accounts
- Add `auditLog` table untuk tracking admin actions
- Add indexes pada kolom yang sering di-query

## Troubleshooting

### Common Issues:

1. **Cannot access admin area**
   - Check middleware.ts is properly configured
   - Verify cookie settings in auth API
   - Clear browser cookies and try again

2. **Statistics not loading**
   - Check database connection
   - Verify Prisma schema is up to date
   - Run `npx prisma generate` if needed

3. **Login not working**
   - Verify password in auth/route.ts
   - Check console for API errors
   - Ensure cookies are enabled in browser

4. **Export CSV empty**
   - Check registrations API response format
   - Verify data exists in database
   - Check browser's download settings

## Performance Optimizations

### Implemented:
- Efficient database queries with Prisma
- Proper data pagination untuk large datasets
- Optimized images dengan Next.js Image component
- Minimal re-renders dengan proper React hooks

### Recommended:
- Add Redis caching untuk statistics
- Implement virtual scrolling untuk large tables
- Add database indexes untuk better query performance
- Use React Query untuk better data fetching

---

Admin panel sudah siap digunakan! Untuk memulai, jalankan `npm run dev` dan akses `/admin` di browser.