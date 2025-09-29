# 🚀 Build HIMASI UNAS untuk Hostinger

## 📋 Checklist Deployment

### Phase 1: Preparation
- [ ] Update next.config.ts untuk static export
- [ ] Setup database (MySQL di Hostinger atau external)
- [ ] Prepare environment variables
- [ ] Test build locally

### Phase 2: Build Process
```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npm run db:generate

# 3. Build for production
npm run build

# 4. Export static files
npm run export
```

### Phase 3: Upload Files
- [ ] Login ke Hostinger hPanel
- [ ] Buka File Manager → public_html/
- [ ] Upload semua isi folder 'out/'
- [ ] Upload PHP backend files
- [ ] Setup .htaccess untuk routing

### Phase 4: Database Setup
- [ ] Create MySQL database di Hostinger
- [ ] Update connection string
- [ ] Run migrations (manual SQL)
- [ ] Seed initial data

### Phase 5: Testing
- [ ] Test homepage loading
- [ ] Test admin panel login
- [ ] Test registration form
- [ ] Test chatbot functionality
- [ ] Test image uploads
- [ ] Test responsive design

## 🔧 Files to Modify Before Build

### 1. next.config.ts
```typescript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};
```

### 2. Database Migration for MySQL
Convert Prisma schema from PostgreSQL to MySQL if using Hostinger DB.

### 3. API Routes Adaptation
Since static export doesn't support API routes, convert to:
- PHP backend files
- Or external API service

## 📊 Expected Results

✅ **Static Website**: Fast loading, SEO-friendly
✅ **Admin Panel**: Functional with database
✅ **Registration**: Working with file uploads
✅ **Chatbot**: PHP backend responding
✅ **Responsive**: Mobile-friendly design

## 💰 Cost Breakdown
- Hostinger Hosting: $2-4/month
- Domain: $10-15/year
- SSL: FREE
- **Total: ~$35-65/year**

## 🚀 Performance Expectations
- **Loading Speed**: 1-3 seconds
- **Uptime**: 99.9%
- **Storage**: 100GB+ (Hostinger)
- **Bandwidth**: Unlimited