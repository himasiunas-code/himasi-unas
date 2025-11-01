# CHATBOT DEBUGGING GUIDE

## Masalah: Pesan tidak muncul setelah mengirim pertanyaan

### Solusi yang telah diimplementasi:

#### 1. **Auto-scroll Enhancement**
- ✅ Ditambahkan `useRef` untuk referensi chat window
- ✅ Ditambahkan `useEffect` untuk auto-scroll ke pesan terbaru
- ✅ Ditambahkan delay 100ms untuk memastikan DOM ter-update

#### 2. **Loading State Management**
- ✅ Ditambahkan state `isLoading` untuk mencegah spam click
- ✅ Loading spinner pada send button
- ✅ Disable input saat loading

#### 3. **Enhanced Debugging**
- ✅ Console logs untuk setiap step proses chat
- ✅ Error logging yang lebih detail
- ✅ Debug info di UI (total pesan + loading status)

#### 4. **Better State Management**
- ✅ Improved message key generation untuk React rendering
- ✅ Proper error handling dengan detail error message
- ✅ Loading message management

### Debug Console Logs:

Saat chatbot berjalan, akan muncul logs seperti ini:

```
🚀 Sending question to API: Apa itu HIMASI UNAS?
👤 Adding user message: {sender: 'user', content: 'Apa itu HIMASI UNAS?'}
🔄 Messages before adding user: 0
🔄 Messages after adding user: 1
⏳ Adding loading message: {sender: 'bot', content: '🤔 Sedang berpikir...'}
🔄 Messages before adding loading: 1
🔄 Messages after adding loading: 2
📡 Response status: 200
✅ Chatbot Response: {success: true, data: {...}}
📝 Adding bot message: HIMASI UNAS adalah Himpunan Mahasiswa...
🔄 Updating messages after success, current length: 2
📝 Messages updated: 3 [{...}, {...}, {...}]
🏁 handleSend completed, isLoading set to false
```

### Cara Test:

1. **Buka Developer Console (F12)**
2. **Klik chatbot icon (bottom right)**
3. **Ketik pertanyaan:** "Apa itu HIMASI UNAS?"
4. **Kirim pesan dan cek console logs**

### Expected Behavior:

1. ✅ User message muncul langsung
2. ✅ Loading message "🤔 Sedang berpikir..." muncul
3. ✅ Loading message hilang, diganti dengan jawaban bot
4. ✅ Auto-scroll ke pesan terbaru
5. ✅ Send button disabled saat loading

### Jika masih bermasalah:

1. **Cek Network Tab** - Apakah API `/api/chatbot` dipanggil?
2. **Cek Console Errors** - Ada error JavaScript?
3. **Cek API Response** - Apakah API mengembalikan response yang benar?

### Test API Manually:

```bash
curl -X POST "http://localhost:3000/api/chatbot" \
  -H "Content-Type: application/json" \
  -d '{"question": "Apa itu HIMASI UNAS?"}'
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "question": "Apa itu HIMASI UNAS?",
    "answer": "HIMASI UNAS adalah Himpunan Mahasiswa...",
    "timestamp": "2025-10-07T..."
  }
}
```

### Common Issues & Solutions:

#### Issue 1: API tidak response
- **Solusi**: Pastikan Next.js dev server running (`npm run dev`)
- **Check**: `http://localhost:3000/api/chatbot` accessible

#### Issue 2: Messages tidak ter-render
- **Solusi**: Cek React DevTools, pastikan state `messages` berubah
- **Check**: Console logs "📝 Messages updated"

#### Issue 3: Scroll tidak berfungsi
- **Solusi**: Cek apakah `chatWindowRef.current` tidak null
- **Check**: Console logs di `useEffect` scroll

### Debug Commands:

```javascript
// Di browser console, cek state chatbot:
// 1. Buka React DevTools
// 2. Pilih ChatBot component
// 3. Lihat state: messages, isLoading, input

// Manual test API:
fetch('/api/chatbot', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({question: 'test'})
}).then(r => r.json()).then(console.log);
```

Semua debug logging akan membantu identify exactly di mana masalahnya!