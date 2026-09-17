<div align="center">

# 🎓 HIMASI UNAS Website

<img src="https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
<img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
<img src="https://img.shields.io/badge/Framer_Motion-11.0-ff0055?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
<img src="https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />

### ✨ Website Resmi Himpunan Mahasiswa Sistem Informasi Universitas Nasional

*Modern • Responsive • Interactive*

[🌐 Live Demo](#) • [📖 Documentation](#) • [🐛 Report Bug](https://github.com/CatwisBot/himasi-unas/issues) • [💡 Request Feature](https://github.com/CatwisBot/himasi-unas/issues)

</div>

---

## 🚀 Fitur Utama

<table>
<tr>
<td width="50%">

### 🎨 **Design & UX**
- ✨ Light Rays Effects dengan WebGL
- 🎭 Smooth Animations (Framer Motion)
- 📱 Fully Responsive Design
- 🌙 Modern UI/UX Interface
- 🎯 Custom 404 Page

</td>
<td width="50%">

### ⚡ **Functionality**
- 🤖 AI Chatbot Integration
- 📧 Email Notification System
- 💳 Payment Integration
- 📊 Admin Dashboard
- 🔐 Secure Authentication

</td>
</tr>
</table>

## 📋 Tech Stack

```mermaid
graph LR
    A[Frontend] --> B[Next.js 15]
    A --> C[TypeScript]
    A --> D[Tailwind CSS]
    A --> E[Framer Motion]
    F[Backend] --> G[Prisma ORM]
    F --> H[PostgreSQL]
    F --> I[API Routes]
    J[Features] --> K[AI Chatbot]
    J --> L[Email Service]
    J --> M[Payment Gateway]
```

### 🛠️ Core Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 15.0 | React Framework & SSR |
| **TypeScript** | 5.0 | Type Safety |
| **Tailwind CSS** | 3.4 | Styling |
| **Framer Motion** | 11.0 | Animations |
| **Prisma** | 5.0 | Database ORM |
| **PostgreSQL** | Latest | Database |
| **OGL** | Latest | WebGL Light Effects |

### 📦 Key Dependencies

```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.4.0",
  "framer-motion": "^11.0.0",
  "prisma": "^5.0.0",
  "@prisma/client": "^5.0.0",
  "lucide-react": "latest",
  "ogl": "latest"
}
```

## 🏁 Quick Start

### Prerequisites

Pastikan Anda sudah menginstall:
- Node.js 18+ 
- npm / yarn / pnpm / bun
- PostgreSQL (untuk database)

### Installation

1️⃣ **Clone Repository**
```bash
git clone https://github.com/CatwisBot/himasi-unas.git
cd himasi-unas
```

2️⃣ **Install Dependencies**
```bash
npm install
# atau
yarn install
# atau
pnpm install
# atau
bun install
```

3️⃣ **Setup Environment Variables**
```bash
cp .env.example .env
```

Edit `.env` file dengan konfigurasi Anda:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/himasi_unas"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4️⃣ **Setup Database**
```bash
npx prisma generate
npx prisma db push
```

5️⃣ **Run Development Server**
```bash
npm run dev
```

🎉 Buka [http://localhost:3000](http://localhost:3000) di browser!

## 📁 Struktur Projekt

```
himasi-unas/
├── 📂 app/                  # Next.js 15 App Router
│   ├── 📂 (pages)/          # Page routes
│   ├── 📂 api/              # API routes
│   └── 📄 layout.tsx        # Root layout
├── 📂 components/           # React components
│   ├── 📂 shared/           # Shared components
│   └── 📂 ui/               # UI components
├── 📂 lib/                  # Utility functions
├── 📂 prisma/               # Database schema
├── 📂 public/               # Static assets
├── 📂 styles/               # Global styles
└── 📄 next.config.ts        # Next.js config
```

## 🎨 Fitur Khusus

### 1. WebGL Light Rays Effect
Implementasi custom WebGL shader untuk efek cahaya yang mengikuti mouse:
```tsx
<LightRays
  raysOrigin="top-center"
  raysColor="#fbbf24"
  followMouse={true}
  pulsating={true}
/>
```

### 2. AI Chatbot
Chatbot cerdas dengan integrasi Google Gemini AI dan basis pengetahuan lokal:
- 🤖 Natural Language Processing
- 💬 Context-aware responses
- 📚 Knowledge base integration

### 3. Admin Dashboard
Panel admin lengkap untuk mengelola:
- 👥 User management
- 📊 Statistics & analytics
- 📝 Content management
- 💳 Payment monitoring

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 🚀 Start development server |
| `npm run build` | 🏗️ Build for production |
| `npm start` | ▶️ Start production server |
| `npm run lint` | 🔍 Run ESLint |
| `npm run type-check` | ✅ Check TypeScript types |
| `npm run db:push` | 📊 Push database schema |
| `npm run db:studio` | 🎨 Open Prisma Studio |

## 🌐 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Hostinger
```bash
npm run build
# Upload build folder ke hosting
```

### Docker
```bash
docker build -t himasi-unas .
docker run -p 3000:3000 himasi-unas
```

## 📸 Screenshots

<div align="center">

### 🏠 Homepage
![Homepage Preview](docs/screenshots/homepage.png)

### 📱 Mobile Responsive
![Mobile Preview](docs/screenshots/mobile.png)

### 💼 Admin Dashboard
![Dashboard Preview](docs/screenshots/dashboard.png)

</div>

## 🤝 Contributing

Kontribusi selalu welcome! Ikuti langkah berikut:

1. Fork repository ini
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 Development Guidelines

- ✅ Follow TypeScript best practices
- ✅ Use ESLint configuration
- ✅ Write meaningful commit messages
- ✅ Test before pushing
- ✅ Document new features

## 🐛 Bug Reports

Menemukan bug? [Buat issue baru](https://github.com/CatwisBot/himasi-unas/issues)

## 📚 Documentation

Untuk dokumentasi lengkap, lihat:
- [Admin Panel Guide](ADMIN_PANEL_GUIDE.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Chatbot Setup](setup_chatbot.md)

## 👥 Team

**HIMASI UNAS Development Team**
- 💻 Frontend Developers
- 🔧 Backend Developers
- 🎨 UI/UX Designers
- 📊 Database Administrators

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js Team
- Vercel Platform
- Open Source Community
- HIMASI UNAS Members

---

<div align="center">

### ⭐ Star this repo if you find it useful!

**Made with ❤️ by HIMASI UNAS**

[Website](https://himasi-unas.com) • [Instagram](https://instagram.com/himasi_unas) • [Email](mailto:contact@himasi-unas.com)

</div>
