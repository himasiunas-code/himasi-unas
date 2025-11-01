# 🚀 Vercel Auto-Deployment & Custom Domain

## 🔄 Setup Auto-Deploy dari GitHub

### 1. Connect Git Repository
1. Buka: https://vercel.com/catwis-projects/himasi-unas
2. **Settings** → **Git Repository**
3. **Connect to GitHub**: `CatwisBot/himasi-unas`
4. **Production Branch**: `master`

### 2. Workflow Setelah Connected
```bash
# 1. Edit code di local
git add .
git commit -m "Update feature"
git push origin master

# 2. Vercel auto-deploy (30-60 detik)
# 3. Website live dengan perubahan terbaru!
```

## 🌐 Custom Domain Setup

### Option A: Domain Hostinger (Sudah Punya)
```
Domain: himasi-unas.org (contoh)

DNS Settings di Hostinger:
┌──────────────────────────────────┐
│ Type  │ Name │ Value             │
├───────┼──────┼───────────────────┤
│ CNAME │ www  │ cname.vercel-dns.com │
│ A     │ @    │ 76.76.19.61       │
└──────────────────────────────────┘
```

**Langkah:**
1. **Vercel Dashboard** → **Domains** → **Add Domain**
2. Input: `himasi-unas.org` dan `www.himasi-unas.org`
3. **Copy DNS records** yang diberikan Vercel
4. **Hostinger hPanel** → **DNS Zone** → **Add Records**
5. **Tunggu 24 jam** untuk propagasi

### Option B: Vercel Subdomain (Gratis & Instant)
```
Available: himasi-unas.vercel.app
```

**Langkah:**
1. **Vercel Dashboard** → **Domains**
2. **Add**: `himasi-unas.vercel.app`
3. **Langsung aktif!** ✅

### Option C: Domain Gratis
```
Providers: Freenom (.tk, .ml, .ga)
           Dot.tk, No-IP, dll
```

## 📊 Current Setup Status

### ✅ Completed
- [x] Vercel deployment: https://himasi-unas-qln5uxokf-catwis-projects.vercel.app
- [x] Database: Neon PostgreSQL connected
- [x] Environment variables configured
- [x] Admin panel working

### 🔄 Next Steps
- [ ] Connect GitHub for auto-deploy
- [ ] Setup custom domain
- [ ] Configure production URL in NEXTAUTH_URL

## 🎯 Commands Reference

### Deploy Commands
```bash
# Manual deploy (current method)
vercel --prod

# Auto deploy (after Git connection)
git push origin master  # Auto triggers deployment
```

### Domain Commands
```bash
# List current domains
vercel domains

# Add domain
vercel domains add himasi-unas.org

# Remove domain  
vercel domains rm old-domain.com
```

## 🔧 Environment Variables Update

Setelah custom domain aktif, update:
```env
NEXTAUTH_URL=https://himasi-unas.org  # atau domain Anda
```

## 🚀 Production Checklist

### Before Going Live:
- [ ] Test all features (admin, registration, chatbot)
- [ ] Verify database connectivity
- [ ] Check file uploads working
- [ ] Test mobile responsiveness
- [ ] Verify SEO meta tags
- [ ] Setup analytics (optional)

### After Domain Setup:
- [ ] Update NEXTAUTH_URL environment variable
- [ ] Test admin login with new domain
- [ ] Verify all API endpoints working
- [ ] Check SSL certificate active
- [ ] Update any hardcoded URLs in code

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Domain Setup**: https://vercel.com/docs/concepts/projects/domains
- **GitHub Integration**: https://vercel.com/docs/git-integrations