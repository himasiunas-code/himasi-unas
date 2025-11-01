# 🤖 Setup Chatbot HIMASI UNAS

## 🚀 Quick Start (Mudah)

### Windows:
1. **Jalankan Backend:**
   ```bash
   # Double-click file ini atau jalankan di command prompt:
   start_backend.bat
   ```

2. **Jalankan Frontend (terminal baru):**
   ```bash
   # Double-click file ini atau jalankan di command prompt:
   start_frontend.bat
   ```

### Linux/Mac:
```bash
# Backend (terminal 1)
chmod +x start_backend.sh
./start_backend.sh

# Frontend (terminal 2)  
npm install && npm run dev
```

## 🔧 Manual Setup (Detail)

### Prerequisites:
- ✅ Python 3.7+ ([Download](https://www.python.org/downloads/))
- ✅ Node.js 16+ ([Download](https://nodejs.org/))

### 1. Setup Backend Python (Flask)

```bash
# Masuk ke direktori app
cd app

# Buat virtual environment
python -m venv venv

# Aktivasi virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Jalankan Flask server
python app.py
```

✅ **Backend berjalan di: http://localhost:5000**

### 2. Setup Frontend Next.js

```bash
# Di root project (terminal baru)
cd c:\Projek\himasi-unas

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

✅ **Frontend berjalan di: http://localhost:3000**

## 🧪 Test Backend API

### Test dengan curl:
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Apa itu HIMASI UNAS?"}'
```

### Test di browser:
Buka: http://localhost:5000/api/chat

### Expected Response:
```json
{
  "answer": "HIMASI UNAS adalah Himpunan Mahasiswa Sistem Informasi Universitas Nasional..."
}
```

## 🎯 Cara Menggunakan Chatbot

1. **Buka website:** http://localhost:3000
2. **Klik ikon chat** di pojok kanan bawah (floating button)  
3. **Ketik pertanyaan**, contoh:
   - "Apa itu HIMASI UNAS?"
   - "Bagaimana cara bergabung?"
   - "Kegiatan apa saja yang ada?"
4. **Tekan Enter** atau klik tombol kirim

**⚠️ PENTING:** Pastikan kedua server berjalan:
- Backend Flask: http://localhost:5000
- Frontend Next.js: http://localhost:3000

## 📋 FAQ dan Troubleshooting

### ❌ "Backend responded with status: 500"
**Solusi:**
- Pastikan Flask server berjalan di localhost:5000
- Cek terminal backend untuk error messages
- Restart Flask server: `Ctrl+C` lalu `python app.py`

### ❌ "Failed to communicate with backend"
**Solusi:**
- Backend tidak berjalan, jalankan `start_backend.bat`
- Cek apakah port 5000 terblokir firewall
- Ganti port di `app.py` dan `route.ts` jika perlu

### ❌ Python command not found
**Solusi:**
- Install Python: https://www.python.org/downloads/
- Centang "Add Python to PATH" saat instalasi
- Restart command prompt setelah install

### ❌ Node command not found
**Solusi:**
- Install Node.js: https://nodejs.org/
- Restart command prompt setelah install

### ❌ Port already in use
**Solusi Backend (Port 5000):**
```python
# Edit app/app.py, ganti port:
if __name__ == "__main__":
    app.run(debug=True, port=5001)  # Ganti ke 5001
```

```typescript
// Edit app/src/api/chat/route.ts:
const response = await fetch('http://localhost:5001/api/chat', {
```

**Solusi Frontend (Port 3000):**
```bash
# Jalankan dengan port berbeda
npm run dev -- -p 3001
```

## 🔄 Update FAQ

Edit file: `app/src/data/faqs.json`

```json
{
  "faqs": [
    {
      "question": "Pertanyaan baru",
      "answer": "Jawaban untuk pertanyaan baru"
    }
  ]
}
```

Restart Flask server untuk apply perubahan.

## 🚀 Production Deployment

### Backend (Flask):
```bash
# Install gunicorn
pip install gunicorn

# Run production server
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend (Next.js):
```bash
# Build production
npm run build

# Start production server
npm start
```

## 📊 Status Checklist

- ✅ Python installed dan di PATH
- ✅ Virtual environment created & activated  
- ✅ Flask dependencies installed
- ✅ Flask server running on port 5000
- ✅ Node.js installed
- ✅ Next.js dependencies installed
- ✅ Next.js dev server running on port 3000
- ✅ Chatbot widget muncul di website
- ✅ Test send message berhasil
- ✅ FAQ data loaded correctly

## 🎉 Selesai!

Chatbot HIMASI UNAS sudah siap digunakan! 

**Frontend:** http://localhost:3000  
**Backend API:** http://localhost:5000  
**Chatbot:** Klik ikon chat di pojok kanan bawah