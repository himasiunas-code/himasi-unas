# Setup Neon PostgreSQL untuk HIMASI UNAS

## 🚀 Panduan Lengkap Setup Neon Database

### 1. Buat Akun Neon

1. **Kunjungi**: [https://neon.tech](https://neon.tech)
2. **Sign up** dengan GitHub atau email
3. **Verifikasi email** Anda

### 2. Buat Project Database

1. **Klik "Create Project"** di dashboard
2. **Isi detail project**:
   ```
   Project Name: himasi-unas-registration
   Database Name: himasi_registration
   Region: ap-southeast-1 (Singapore) - untuk Indonesia
   PostgreSQL Version: 15
   ```
3. **Klik "Create Project"**

### 3. Dapatkan Connection String

Setelah project dibuat, Anda akan melihat **Connection Details**:

```bash
# Example (ganti dengan yang asli dari dashboard Anda)
postgresql://username:password@ep-cool-name-123456.ap-southeast-1.aws.neon.tech/himasi_registration?sslmode=require
```

**📋 Copy connection string ini!**

### 4. Update Environment Variables

1. **Edit file `.env`** di root project:
   ```env
   DATABASE_URL="postgresql://username:password@ep-cool-name-123456.ap-southeast-1.aws.neon.tech/himasi_registration?sslmode=require"
   ```

2. **Ganti** `username`, `password`, dan `endpoint` dengan yang dari dashboard Neon Anda

### 5. Setup Database

```bash
# 1. Generate Prisma Client
npm run db:generate

# 2. Run migration ke Neon
npm run db:migrate

# 3. Seed sample data
npm run db:seed

# 4. Test koneksi
npm run db:studio
```

### 6. Verifikasi Setup

1. **Buka Prisma Studio**: `npm run db:studio`
2. **Cek apakah tables sudah terbuat**:
   - activities
   - registrations
   - admins
3. **Cek apakah sample data sudah ada**

### 7. Test Aplikasi

```bash
# Start development server
npm run dev

# Test endpoints:
# http://localhost:3000/kegiatan
# http://localhost:3000/pendaftaran
```

## 🌟 Keunggulan Neon

- ✅ **Serverless** - Auto-scaling, bayar sesuai usage
- ✅ **Fast** - Connection pooling built-in
- ✅ **Free Tier** - 512MB storage, 1GB transfer/month
- ✅ **Branching** - Database branches seperti Git
- ✅ **Auto-backup** - Point-in-time recovery
- ✅ **Global** - Multi-region support

## 💰 Pricing

### Free Tier (Hobby)
- **Storage**: 512 MB
- **Compute**: 1 vCPU, 256 MB RAM
- **Data Transfer**: 5 GB/month
- **Projects**: 1 project
- **Databases**: 10 databases per project

### Pro Tier ($19/month)
- **Storage**: 20 GB included
- **Compute**: Unlimited usage
- **Data Transfer**: 100 GB/month
- **Projects**: Unlimited
- **Advanced features**: Branching, Read replicas

## 🔧 Advanced Configuration

### Connection Pooling (Recommended untuk Production)

Neon menyediakan 2 jenis connection string:

1. **Direct Connection** (untuk migrations):
   ```env
   DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname"
   ```

2. **Pooled Connection** (untuk aplikasi):
   ```env
   DATABASE_URL="postgresql://username:password@ep-xxx-pooler.region.aws.neon.tech/dbname?pgbouncer=true"
   ```

### Environment Variables untuk Production

```env
# Production
DATABASE_URL="postgresql://username:password@ep-xxx-pooler.region.aws.neon.tech/himasi_registration?sslmode=require&pgbouncer=true"

# Migration (direct connection)  
DIRECT_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/himasi_registration?sslmode=require"
```

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## 📊 Monitoring & Maintenance

### Neon Console Features
- **Query Analytics** - Monitor performance
- **Connection Stats** - Track usage
- **Storage Usage** - Monitor storage
- **Backup & Restore** - Point-in-time recovery

### Prisma Studio
```bash
# Open database GUI
npm run db:studio
```

### Database Commands
```bash
# Reset database (CAREFUL!)
npm run db:reset

# Push schema changes
npm run db:push

# View migration status
npx prisma migrate status
```

## 🚀 Deployment ke Vercel

1. **Deploy ke Vercel**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Set Environment Variables di Vercel**:
   - Masuk ke Vercel Dashboard
   - Pilih project Anda
   - Settings > Environment Variables
   - Add:
     - `DATABASE_URL`
     - `NEXTAUTH_SECRET`
     - `NEXTAUTH_URL`

3. **Auto-deploy dengan Git**:
   - Connect repository ke Vercel
   - Setiap push ke main branch akan auto-deploy

## 🔒 Security Best Practices

1. **Jangan commit `.env`** ke Git
2. **Use strong passwords** untuk database
3. **Rotate secrets** secara berkala
4. **Monitor access logs** di Neon console
5. **Use connection pooling** untuk production

## ❓ Troubleshooting

### Connection Issues
```bash
# Test connection
npx prisma db pull

# If fails, check:
# 1. DATABASE_URL format
# 2. Network connectivity
# 3. Neon project status
```

### Migration Issues
```bash
# Reset and remigrate
npm run db:reset
npm run db:migrate
```

### Performance Issues
- Use connection pooling (`pgbouncer=true`)
- Monitor query performance di Neon console
- Consider read replicas untuk heavy read loads

---

## 📞 Support

- **Neon Docs**: [https://neon.tech/docs](https://neon.tech/docs)
- **Prisma Docs**: [https://prisma.io/docs](https://prisma.io/docs)
- **Discord**: Neon Community Discord