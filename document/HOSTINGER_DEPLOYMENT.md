# 🌐 Deployment ke Hostinger

## 📋 Opsi Deploy HIMASI UNAS Website di Hostinger

### **Opsi 1: Full Static dengan PHP Backend (Recommended untuk Hostinger)**

#### 1.1 Persiapan File

Hostinger mendukung PHP secara native, jadi kita gunakan PHP backend:

1. **Copy Smart PHP Backend:**
   ```
   chatbot-smart.php → upload ke root directory di Hostinger
   chatbot.php → backup (rename to chatbot-basic.php)
   ```

2. **Update API Route (Optional):**
   ```
   app/api/chat/route-hostinger.ts → ganti route.ts jika butuh hybrid approach
   ```

3. **Build Static Frontend:**
   ```bash
   npm run build
   npm run export
   ```

#### 1.2 File Structure untuk Upload ke Hostinger

```
public_html/
├── index.html (dari folder out/)
├── _next/ (static assets dari folder out/)
├── chatbot-smart.php (Smart learning backend)
├── chatbot-basic.php (Backup basic version)
├── chat_logs.txt (Will be created automatically)
├── .htaccess (routing & security)
└── ... (semua files dari folder out/)
```

#### 1.3 Upload ke Hostinger

1. **Login ke Hostinger Control Panel**
2. **File Manager** → pilih domain folder (biasanya `public_html`)
3. **Upload semua files dari folder `out/`** ke root directory
4. **Create folder `api/`** dan upload `chat.php`
5. **Upload `.htaccess`** untuk routing

#### 1.4 Test Website

1. Buka website Anda: `https://yourdomain.com`
2. Test chatbot dengan klik floating chat icon
3. Try questions:
   - "Apa itu HIMASI UNAS?"
   - "Bagaimana cara bergabung?"

### **Opsi 2: Static + External API Backend**

Jika PHP tidak diinginkan, gunakan external service:

#### 2.1 Deploy Backend ke Railway (Free)

1. Create new Railway project
2. Upload Python Flask backend:
   ```bash
   # app.py, requirements.txt, etc.
   ```
3. Get Railway URL (e.g., `https://your-app.railway.app`)

#### 2.2 Update Frontend API URL

Edit `app/api/chat/route.ts`:
```typescript
const backendUrl = 'https://your-app.railway.app/api/chat';
```

#### 2.3 Deploy Static ke Hostinger

Same steps as Option 1, but without PHP backend.

### **Opsi 3: Node.js Backend (Hostinger VPS)**

If you have Hostinger VPS with Node.js:

#### 3.1 Upload Full Next.js App
```bash
# Upload semua files project
# Install dependencies
npm install
npm run build

# Start production server
npm start
```

#### 3.2 Process Manager
```bash
# Install PM2 untuk keep server running
npm install -g pm2
pm2 start npm --name "himasi-website" -- start
pm2 save
pm2 startup
```

## 🎯 **Recommended: PHP Backend Option**

### **Kenapa PHP untuk Hostinger?**

✅ **Native Support:** Hostinger fully supports PHP
✅ **No Extra Cost:** PHP included in shared hosting
✅ **Fast Response:** No cold start issues
✅ **Simple Deploy:** Just upload files
✅ **Reliable:** PHP engine mature and stable

### **Step-by-Step PHP Deployment:**

#### Step 1: Build Static Files
```bash
cd C:/Projek/himasi-unas
npm run build
npm run export
```

#### Step 2: Prepare Upload Files
```
Folder 'out/' contains:
- index.html
- _next/ (static assets)
- favicon.ico
- etc.

Additional files to upload:
- php-backend/chat.php → api/chat.php
- .htaccess
```

#### Step 3: Upload to Hostinger
1. **File Manager** → `public_html/`
2. **Delete default files** (if any)
3. **Upload all from 'out/' folder**
4. **Create 'api' folder** → upload `chat.php`
5. **Upload `.htaccess`** to root

#### Step 4: Set Permissions (if needed)
- chat.php: 644
- .htaccess: 644

#### Step 5: Test
- Website: `https://yourdomain.com`
- API direct: `https://yourdomain.com/api/chat` (POST request)
- Chatbot: Click floating chat widget

## 🔧 **Troubleshooting untuk Hostinger**

### **Issue 1: API 404 Error**
```
Solution: Check .htaccess file uploaded dan api/chat.php exists
```

### **Issue 2: CORS Error**
```
Solution: PHP backend already includes CORS headers.
Clear browser cache dan try again.
```

### **Issue 3: PHP Error 500**
```
Solution: Check PHP error logs di Hostinger Control Panel.
Ensure PHP version compatibility (PHP 7.4+).
```

### **Issue 4: Routing tidak work**
```
Solution: Hostinger biasanya support .htaccess.
If not, use direct URLs: /api/chat.php instead of /api/chat
```

## 📱 **Features yang akan work di Hostinger:**

✅ **Static Website:** Super fast loading
✅ **Chatbot:** PHP backend responds quickly  
✅ **Responsive Design:** Works on all devices
✅ **SEO Friendly:** Static HTML good for SEO
✅ **SSL Support:** Hostinger provides free SSL

## 💰 **Cost Estimation:**

- **Hostinger Shared Hosting:** ~$2-4/month
- **Domain:** ~$10-15/year  
- **SSL Certificate:** FREE with Hostinger
- **Total:** ~$35-65/year

Jauh lebih murah dibanding VPS atau cloud services!

## 🚀 **Performance di Hostinger:**

- **Loading Speed:** Very fast (static files + CDN)
- **Chatbot Response:** ~200-500ms (PHP native)
- **Uptime:** 99.9% (Hostinger SLA)
- **Bandwidth:** Usually unlimited di shared hosting

Let me create the upload checklist for you.