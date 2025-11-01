# 🚀 Deployment Guide - HIMASI UNAS Website dengan Chatbot

## 📋 Langkah-langkah Deploy ke Netlify

### 1. Persiapkan File untuk Deploy

Pastikan semua file berikut ada di repository Anda:

✅ **Frontend Files:**
- `next.config.ts` - Configured for static export
- `package.json` - Includes export script
- `app/`, `components/`, `lib/`, `constants/` - Next.js application files

✅ **Netlify Configuration:**
- `netlify.toml` - Build and redirect configuration
- `netlify/functions/chat.js` - Serverless chatbot function

✅ **Git Configuration:**
- `.gitignore` - Excludes unnecessary files

### 2. Upload ke GitHub (jika belum)

```bash
# Initialize git (jika belum)
git init
git add .
git commit -m "Add Netlify chatbot configuration"

# Push ke GitHub repository Anda
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 3. Deploy ke Netlify

#### Opsi A: Melalui Git (Recommended)
1. Buka [netlify.com](https://netlify.com)
2. Login dengan GitHub account
3. Klik "New site from Git"
4. Pilih repository `himasi-unas`
5. Build settings akan otomatis terdeteksi dari `netlify.toml`:
   - **Build command:** `npm run build && npm run export`
   - **Publish directory:** `out`
6. Klik "Deploy site"

#### Opsi B: Manual Upload (Drag & Drop)
1. Build website locally:
   ```bash
   npm run build
   npm run export
   ```
2. Compress folder `out/` menjadi zip
3. Upload ke Netlify via drag & drop

### 4. Test Chatbot

Setelah deploy berhasil:
1. Buka website Anda
2. Klik ikon chat floating di kanan bawah
3. Test dengan pertanyaan:
   - "Apa itu HIMASI UNAS?"
   - "Bagaimana cara bergabung?"
   - "Apa saja kegiatan HIMASI?"

### 5. Troubleshooting

#### Jika chatbot tidak berfungsi:

1. **Check browser console** (F12 → Console):
   - Lihat error messages
   - Check API calls ke `/.netlify/functions/chat`

2. **Check Netlify Function logs**:
   - Go to Netlify dashboard → Functions → chat
   - Check logs untuk error messages

3. **Common Issues:**

   **Issue:** 404 Function not found
   ```
   Solution: Pastikan folder netlify/functions/chat.js ada dan 
   netlify.toml includes redirects from /api/* to /.netlify/functions/*
   ```

   **Issue:** CORS Error
   ```
   Solution: Headers sudah dikonfigurasi di chat.js, tapi pastikan
   browser tidak cache old responses. Try hard refresh (Ctrl+Shift+R)
   ```

   **Issue:** Function timeout
   ```
   Solution: Netlify free functions timeout 10s. Code kita ringan,
   tapi check function logs untuk performance issues
   ```

### 6. Custom Domain (Optional)

Jika ingin menggunakan domain sendiri:
1. Netlify dashboard → Domain settings
2. Add custom domain
3. Update DNS records sesuai instruksi Netlify

## 🔧 Development vs Production

### Local Development:
- Frontend: `http://localhost:3000`
- Backend: Flask server di `http://localhost:5000`
- API calls: `/api/chat` → `http://localhost:5000/api/chat`

### Production (Netlify):
- Frontend: Static files served dari CDN
- Backend: Netlify Functions (serverless)
- API calls: `/api/chat` → `/.netlify/functions/chat`

## 📚 FAQ Data Management

FAQ data ada di `netlify/functions/chat.js` dalam array `faqs`. 
Untuk update FAQ:

1. Edit file `netlify/functions/chat.js`
2. Modify array `faqs`
3. Commit dan push ke GitHub
4. Netlify akan auto-deploy changes

## ⚡ Performance Tips

1. **Image Optimization:** Use `next/image` untuk optimisasi otomatis
2. **Lazy Loading:** Components sudah configured untuk lazy loading
3. **Static Export:** Website fully static = very fast loading
4. **CDN:** Netlify provides global CDN automatically

## 🔒 Security Notes

1. **No API Keys:** Chatbot tidak butuh API keys eksternal
2. **CORS:** Configured untuk allow all origins (public website)
3. **Serverless:** No persistent server = reduced attack surface
4. **Static Export:** No server-side vulnerabilities

## 🎯 Next Steps

1. **Analytics:** Add Google Analytics atau Netlify Analytics
2. **SEO:** Add proper meta tags dan Open Graph
3. **PWA:** Convert ke Progressive Web App
4. **Advanced Chat:** Integrate dengan AI services (OpenAI, etc.)

---

💡 **Tips:** Bookmark Netlify dashboard untuk monitoring dan logs. 
Netlify free tier cukup untuk website ini dengan traffic normal.