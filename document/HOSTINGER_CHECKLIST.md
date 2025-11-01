# ✅ Hostinger Upload Checklist

## 📦 Pre-Upload Preparation

### Step 1: Build Static Website
```bash
cd C:/Projek/himasi-unas
npm run build
npm run export
```
✅ **Check:** Folder `out/` created with all static files

### Step 2: Prepare Files for Upload

**Files dari folder `out/` (upload ke root public_html):**
- [ ] index.html
- [ ] favicon.ico  
- [ ] _next/ (folder dengan semua static assets)
- [ ] 404.html
- [ ] galeri.html
- [ ] struktur.html

**Additional Files (manual upload):**
- [ ] php-backend/chat.php → upload ke api/chat.php
- [ ] .htaccess → upload ke root

## 🌐 Hostinger Upload Steps

### Step 1: Access File Manager
1. [ ] Login ke Hostinger Control Panel
2. [ ] Go to File Manager
3. [ ] Navigate to your domain folder (usually `public_html`)

### Step 2: Clean Root Directory
4. [ ] Delete default Hostinger files (index.html, etc.) if any
5. [ ] Make sure directory is clean

### Step 3: Upload Static Files
6. [ ] Upload ALL files from `out/` folder to root
7. [ ] Verify folder structure:
   ```
   public_html/
   ├── index.html ✅
   ├── favicon.ico ✅
   ├── _next/ ✅
   ├── 404.html ✅
   ├── galeri.html ✅
   └── struktur.html ✅
   ```

### Step 4: Create API Backend
8. [ ] Create folder: `api`
9. [ ] Upload `php-backend/chat.php` to `api/chat.php`
10. [ ] Verify path: `public_html/api/chat.php` ✅

### Step 5: Upload Configuration
11. [ ] Upload `.htaccess` to root (`public_html/.htaccess`)
12. [ ] Verify .htaccess contains API routing rules ✅

### Step 6: Set File Permissions (if needed)
13. [ ] chat.php: 644 permissions
14. [ ] .htaccess: 644 permissions
15. [ ] All HTML files: 644 permissions

## 🧪 Testing Checklist

### Basic Website Test
- [ ] Visit `https://yourdomain.com` 
- [ ] Homepage loads correctly ✅
- [ ] Navigation menu works ✅
- [ ] Galeri page accessible ✅
- [ ] Struktur page accessible ✅
- [ ] Responsive design on mobile ✅

### Chatbot Functionality Test
- [ ] Floating chat icon visible (bottom right) ✅
- [ ] Click chat icon opens chat modal ✅
- [ ] Chat input field functional ✅
- [ ] Send button works ✅

### Chatbot Response Test
Test these questions:
- [ ] "Apa itu HIMASI UNAS?" → Should return org description ✅
- [ ] "Bagaimana cara bergabung?" → Should return join info ✅
- [ ] "Apa saja kegiatan?" → Should return activities list ✅
- [ ] "Kontak HIMASI" → Should return contact info ✅
- [ ] "Test random" → Should return default message ✅

### API Direct Test (Optional)
- [ ] Test API directly: `https://yourdomain.com/api/chat`
- [ ] POST request with JSON: `{"message": "test"}`
- [ ] Should return JSON response with answer ✅

## 🚨 Troubleshooting Common Issues

### Issue: Website shows Hostinger default page
**Solution:** 
- [ ] Ensure index.html is in public_html root
- [ ] Check if index.html was uploaded correctly
- [ ] Clear browser cache and refresh

### Issue: Chatbot gives 404 error
**Solutions to try:**
- [ ] Verify api/chat.php exists and has correct content
- [ ] Check .htaccess file uploaded and contains rewrite rules
- [ ] Try direct URL: `yourdomain.com/api/chat.php` instead of `/api/chat`

### Issue: Chat button not clickable
**Solutions:**
- [ ] Check browser console (F12) for JavaScript errors
- [ ] Verify all _next/ static files uploaded correctly
- [ ] Hard refresh page (Ctrl+Shift+R)

### Issue: PHP errors (500 Internal Server Error)
**Solutions:**
- [ ] Check PHP error logs in Hostinger Control Panel
- [ ] Verify chat.php file has correct PHP syntax
- [ ] Ensure PHP version is 7.4+ (check in Hostinger settings)

## 📱 Mobile Testing Checklist

- [ ] Website responsive on phone ✅
- [ ] Chat icon not overlapping other elements ✅
- [ ] Chat modal fits screen properly ✅
- [ ] Keyboard doesn't hide chat input ✅
- [ ] Chat scrolling works smoothly ✅

## 🔒 Security Verification

- [ ] HTTPS working (SSL certificate active) ✅
- [ ] .htaccess security headers loading ✅
- [ ] No sensitive files exposed ✅
- [ ] PHP error display off in production ✅

## 📊 Performance Check

- [ ] Page load time < 3 seconds ✅
- [ ] Chat response time < 1 second ✅
- [ ] Images optimized and loading fast ✅
- [ ] No console errors ✅

## ✨ Final Checklist

- [ ] Website fully functional ✅
- [ ] Chatbot responding correctly ✅
- [ ] Mobile experience smooth ✅
- [ ] All pages accessible ✅
- [ ] Contact information updated ✅
- [ ] Analytics tracking (if desired) ✅

## 📞 Support Information

If issues persist:
1. **Hostinger Support:** Check their documentation and live chat
2. **Browser Console:** F12 → Console tab for error details
3. **Network Tab:** F12 → Network tab to check failed requests
4. **PHP Error Logs:** Available in Hostinger Control Panel

---

**🎉 Congratulations!** 
Your HIMASI UNAS website with AI chatbot is now live on Hostinger!