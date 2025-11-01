# HIMASI UNAS Chatbot - Production Deployment Guide

## 🚀 Deploy ke Vercel (Frontend) + Railway (Backend)

### Step 1: Prepare Backend for Production

1. **Update app.py untuk production:**
```python
import os
from flask import Flask
from flask_cors import CORS
from src.api.routes import api_bp

app = Flask(__name__)

# Production CORS settings
if os.environ.get('FLASK_ENV') == 'production':
    CORS(app, origins=[
        'https://himasi-unas.vercel.app',  # Your Vercel domain
        'https://your-domain.com'         # Your custom domain
    ])
else:
    # Development CORS
    CORS(app, origins=['http://localhost:3000', 'http://localhost:3001'])

app.register_blueprint(api_bp)

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
```

2. **Create requirements.txt:**
```
Flask==2.3.3
Flask-Cors==4.0.0
Flask-RESTful==0.3.10
requests==2.31.0
nltk==3.8.1
python-dotenv==1.0.0
gunicorn==21.2.0
```

3. **Create Procfile for deployment:**
```
web: gunicorn -w 4 -b 0.0.0.0:$PORT app:app
```

### Step 2: Deploy Backend to Railway

1. **Push to GitHub:**
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

2. **Deploy on Railway:**
   - Go to [railway.app](https://railway.app)
   - Login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your `himasi-unas` repository
   - Set root directory to `app/`
   - Railway will auto-detect Flask and deploy

3. **Get Backend URL:**
   - After deployment, you'll get URL like: `https://himasi-backend.railway.app`

### Step 3: Update Frontend API URL

Update `app/api/chat/route.ts`:
```typescript
const backendUrl = process.env.NODE_ENV === 'production' 
  ? 'https://himasi-backend.railway.app/api/chat'  // Your Railway URL
  : 'http://localhost:5000/api/chat';
```

### Step 4: Deploy Frontend to Vercel

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
cd c:\Projek\himasi-unas
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? himasi-unas
# - Directory? ./
# - Override settings? No
```

3. **Get Frontend URL:**
   - You'll get URL like: `https://himasi-unas.vercel.app`

### Step 5: Update CORS Settings

Update backend CORS in `app.py`:
```python
CORS(app, origins=[
    'https://himasi-unas.vercel.app',  # Your actual Vercel URL
    'http://localhost:3000'            # Keep for local development
])
```

Redeploy backend on Railway after this change.

## 🌟 Alternative: All-in-One Platforms

### Option 1: Netlify (Full-stack)
- Deploy both frontend and backend functions
- Domain: `https://himasi-unas.netlify.app`

### Option 2: AWS/GCP/Azure
- More complex but highly scalable
- Custom domain support
- Professional deployment

### Option 3: DigitalOcean App Platform
- Simple full-stack deployment
- Automatic SSL certificates
- Custom domains

## 🔒 Production Checklist

- [ ] Remove debug mode from Flask
- [ ] Set up environment variables
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Set up monitoring/logging
- [ ] Custom domain (optional)
- [ ] SSL certificate (auto with most platforms)

## 💰 Cost Estimate

**Free Tier Options:**
- Vercel: Free for personal projects
- Railway: $5/month after free credits
- Render: Free tier available
- Netlify: Free tier available

**Total: $0-5/month for basic usage**

## 🚀 Quick Start Commands

```bash
# 1. Prepare and push to GitHub
git add .
git commit -m "Production ready"
git push

# 2. Deploy frontend
npm install -g vercel
vercel

# 3. Deploy backend on Railway.app (via web interface)

# 4. Update environment variables
# 5. Test public URLs
```

Your chatbot will be live and accessible worldwide! 🌍