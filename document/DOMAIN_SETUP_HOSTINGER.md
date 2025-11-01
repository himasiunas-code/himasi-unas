# 🌐 Setup Domain himasiunas.com untuk Vercel

## ✅ Status Setup

### Domain Configuration:
- ✅ Domain added to Vercel: `himasiunas.com`  
- ✅ Subdomain added: `www.himasiunas.com`
- 🔄 DNS Configuration: **IN PROGRESS**

## 🎯 DNS Records Yang Harus Diset

```
┌─────────────────────────────────────┐
│ REQUIRED DNS RECORDS                │
├─────────────────────────────────────┤
│ Type: A                             │
│ Name: @                             │
│ Value: 76.76.21.21                  │
│ TTL: 14400                          │
├─────────────────────────────────────┤
│ Type: A                             │
│ Name: www                           │ 
│ Value: 76.76.21.21                  │
│ TTL: 14400                          │
└─────────────────────────────────────┘
```

## 📋 Langkah-Langkah di Hostinger hPanel

### 1. Masuk ke DNS Management
1. **Login** ke Hostinger hPanel
2. **Domains** section
3. **Manage** domain `himasiunas.com`
4. **DNS/Nameservers** tab
5. **Manage DNS records**

### 2. Clear Existing Records
```
❌ DELETE ini jika ada:
   - A record pointing to old IP
   - CNAME record pointing to old hosting
   - Any conflicting records for @ and www
```

### 3. Add Vercel Records
```
➕ ADD RECORD 1:
   Type: A
   Name: @
   Points to: 76.76.21.21
   
➕ ADD RECORD 2:
   Type: A
   Name: www  
   Points to: 76.76.21.21
```

### 4. Save & Wait
- **Save changes**
- **Propagation time**: 5 minutes - 24 hours
- **Check status**: Use online DNS checker tools

## 🔧 After DNS Setup

### Update Environment Variables
```env
NEXTAUTH_URL=https://himasiunas.com
```

### Test URLs
- https://himasiunas.com
- https://www.himasiunas.com  
- https://himasiunas.com/admin

## 🚀 Benefits of This Setup

### Performance
- ⚡ **Vercel CDN** - Global edge network
- 🔒 **Auto SSL** - Automatic HTTPS certificate  
- 🚀 **Edge Runtime** - Server functions at the edge
- 📊 **Analytics** - Built-in performance monitoring

### Cost & Management
- 💰 **Free hosting** - Vercel generous free tier
- 🔄 **Auto deployments** - Git integration
- 🛠️ **Zero maintenance** - Serverless infrastructure
- 📈 **Auto scaling** - Handle traffic spikes

### Technical
- 🗄️ **Neon PostgreSQL** - Serverless database  
- 🔐 **NextAuth** - Secure authentication
- 📱 **Mobile optimized** - Responsive design
- 🎯 **SEO ready** - Meta tags & performance

## 📊 Domain Status Check

### Online Tools untuk Check DNS:
- **What's My DNS**: https://whatsmydns.net
- **DNS Checker**: https://dnschecker.org  
- **MX Toolbox**: https://mxtoolbox.com

### Command Line Check:
```bash
# Check A record
nslookup himasiunas.com

# Check with specific DNS
nslookup himasiunas.com 8.8.8.8
```

## ⏰ Timeline Expectations

### Immediate (0-5 minutes):
- DNS records saved in Hostinger
- Some locations might resolve

### Short term (30 minutes - 2 hours):
- Most locations resolve correctly
- SSL certificate starts provisioning

### Complete (2-24 hours):
- Global DNS propagation complete
- SSL certificate fully active
- All regions pointing to Vercel

## 🆘 Troubleshooting

### If domain doesn't work after 24 hours:
1. **Verify DNS records** in Hostinger
2. **Check nameservers** are Hostinger's
3. **Contact Hostinger support** if needed
4. **Try DNS flush** on your computer

### Common Issues:
- **Mixed content**: Ensure all resources use HTTPS
- **Redirect loops**: Clear browser cache
- **SSL pending**: Wait up to 24 hours for certificate

## 🎯 Final Checklist

### DNS Setup:
- [ ] A record @ → 76.76.21.21
- [ ] A record www → 76.76.21.21  
- [ ] Old records removed
- [ ] Changes saved in Hostinger

### Vercel Configuration:
- [x] Domain added: himasiunas.com
- [x] Domain added: www.himasiunas.com
- [ ] Environment variables updated
- [ ] SSL certificate verified

### Testing:
- [ ] https://himasiunas.com loads
- [ ] https://www.himasiunas.com redirects properly
- [ ] Admin panel accessible: /admin
- [ ] Database connectivity verified