# 🔧 Fix Vercel Database Connection Issue

## ❌ Problem
Setelah `git push`, Vercel auto-deploy tapi database tidak connect ke Neon.

## 🎯 Root Cause  
Environment variables tidak ter-set di Vercel dashboard setelah Git integration setup.

## ✅ Solution Steps

### 1. Set Environment Variables di Vercel
```
URL: https://vercel.com/catwis-projects/himasi-unas/settings/environment-variables

Add these variables:
┌─────────────────────────────────────────────────────────────┐
│ Name: DATABASE_URL                                          │
│ Value: postgresql://neondb_owner:npg_KsuNwTPfe9X7@ep-luck  │
│        y-dew-a1l98odf-pooler.ap-southeast-1.aws.neon.tech │  
│        /neondb?sslmode=require&channel_binding=require     │
│ Environment: ✅ Production ✅ Preview ✅ Development       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Name: NEXTAUTH_URL                                          │
│ Value: https://himasi-unas-qln5uxokf-catwis-projects.vercel│
│        .app                                                 │  
│ Environment: ✅ Production ✅ Preview ✅ Development       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Name: NEXTAUTH_SECRET                                       │
│ Value: himasi-unas-production-secret-2024-secure           │
│ Environment: ✅ Production ✅ Preview ✅ Development       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Name: NEXT_PUBLIC_MAX_FILE_SIZE                             │
│ Value: 5242880                                              │
│ Environment: ✅ Production ✅ Preview ✅ Development       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Name: NEXT_PUBLIC_ALLOWED_FILE_TYPES                        │
│ Value: image/jpeg,image/jpg,image/png                       │
│ Environment: ✅ Production ✅ Preview ✅ Development       │
└─────────────────────────────────────────────────────────────┘
```

### 2. Trigger Redeploy
```
Option A: Via Dashboard
├── Go to Vercel project dashboard
├── Click "Deployments" tab
├── Click "Redeploy" on latest deployment
└── Wait for completion

Option B: Via Git Push
├── Make any small change to code
├── git add . && git commit -m "trigger redeploy"
├── git push
└── Auto-deploy will trigger with new env vars

Option C: Via CLI (if available)
├── npx vercel --prod
└── Force new deployment
```

### 3. Test Database Connection

#### Test API Endpoints:
```
✅ Test these URLs after redeploy:

Registration API:
https://himasi-unas-qln5uxokf-catwis-projects.vercel.app/api/registrations

Activities API:  
https://himasi-unas-qln5uxokf-catwis-projects.vercel.app/api/activities

Should return JSON data, not error messages
```

#### Test Admin Login:
```
✅ Test admin functionality:

URL: https://himasi-unas-qln5uxokf-catwis-projects.vercel.app/admin
Password: himasi#25gokilparah.

Should be able to login and see registrations
```

#### Test Registration Form:
```
✅ Test public registration:

URL: https://himasi-unas-qln5uxokf-catwis-projects.vercel.app/pendaftaran

Should be able to submit new registrations
```

## 🔍 Debugging Steps

### If Still Not Working:

#### 1. Check Vercel Logs
```
Dashboard → Project → Functions tab → View logs
Look for database connection errors
```

#### 2. Check Environment Variables Applied
```
Dashboard → Settings → Environment Variables
Verify all variables are saved and have correct values
```

#### 3. Check Recent Deployments
```
Dashboard → Deployments
Ensure latest deployment used updated environment variables
```

#### 4. Test Database Connection Directly
```bash
# In local terminal, test Neon connection:
npx prisma db pull
# Should work without errors
```

## 🚨 Common Issues & Fixes

### Issue 1: Environment Variables Not Applied
```
Cause: Variables added after deployment
Fix: Redeploy after adding variables
```

### Issue 2: Wrong Database URL
```
Cause: Copy-paste error or expired Neon connection
Fix: Get fresh DATABASE_URL from Neon dashboard
```

### Issue 3: Network/SSL Issues  
```
Cause: Vercel can't reach Neon database
Fix: Ensure Neon allows connections from Vercel IPs
```

### Issue 4: Prisma Client Issues
```
Cause: Prisma client not generated for production
Fix: Ensure prisma generate runs in build process
```

## ✅ Success Indicators

### Database Connected Successfully:
- ✅ API endpoints return data (not 500 errors)
- ✅ Admin login works and shows registrations
- ✅ Registration form accepts submissions
- ✅ No database errors in Vercel logs

### Environment Variables Working:
- ✅ All variables visible in Vercel dashboard
- ✅ Latest deployment shows "Environment Variables: 5"
- ✅ No missing environment variable errors

## 📞 If Still Issues

### Vercel Support:
- support@vercel.com
- Include: Project name, deployment URL, error screenshots

### Neon Support:
- Check Neon dashboard for connection issues
- Verify database is active and accepting connections

**Most likely fix: Just need to set environment variables in Vercel dashboard!** 🎯