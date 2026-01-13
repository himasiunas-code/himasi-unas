# Fitur Deep Linking untuk Halaman Kegiatan

## Deskripsi
Fitur ini memungkinkan pengguna untuk langsung menuju ke artikel kegiatan tertentu menggunakan URL dengan hash/anchor.

## Cara Penggunaan

### Format URL
```
https://himasiunas.com/kegiatan#{id}
```

### Contoh
- `https://himasiunas.com/kegiatan#1` - Menuju ke kegiatan dengan ID 1
- `https://himasiunas.com/kegiatan#2` - Menuju ke kegiatan dengan ID 2
- Dan seterusnya...

## Implementasi Teknis

### 1. ID pada Setiap Artikel
Setiap artikel kegiatan memiliki ID unik:
```tsx
<div id={`${kegiatan.id}`} ...>
```

### 2. Auto Scroll
Ketika halaman dimuat dengan hash di URL, komponen akan otomatis scroll ke artikel yang sesuai:
```tsx
useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
        setTimeout(() => {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }, 100);
    }
}, []);
```

### 3. Scroll Offset
Menggunakan class `scroll-mt-24` untuk memberikan jarak dari top saat scroll, menghindari artikel tertutup oleh navbar.

## File yang Dimodifikasi
- `components/shared/Kegiatan/Artikel.tsx` - Komponen utama dengan logic deep linking
- `app/globals.css` - Sudah ada `scroll-behavior: smooth` untuk smooth scrolling

## Catatan
- Hash/ID menggunakan format `{id}` dimana {id} adalah ID dari data kegiatan
- Smooth scroll sudah diaktifkan secara global
- Scroll positioning menggunakan `block: 'center'` untuk penempatan optimal
