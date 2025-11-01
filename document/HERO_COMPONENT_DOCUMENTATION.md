# Hero Section - HIMASI UNAS

## Overview
Komponen Hero section yang dibuat sesuai dengan desain visual yang diberikan, menampilkan branding HIMASI UNAS dengan layout modern dan interaktif.

## Design Features

### 🎨 Visual Design
- **Background**: Gradient merah maroon yang sesuai dengan brand HIMASI
- **Typography**: Hierarki teks yang jelas dengan emphasis pada "Sistem Informasi"
- **Color Scheme**: 
  - Primary: `#4B061A` (Maroon HIMASI)
  - Secondary: `#FFE8DB` (Cream accent)
  - Gradients: `from-[#4B061A] via-[#6B1B2F] to-[#8B2538]`

### 🖼️ Image Layout
- **Main Image**: Circular frame dengan border dan shadow effects
- **Secondary Image**: Lingkaran kecil di pojok kanan atas
- **Floating Elements**: Decorative circles untuk visual interest
- **Animations**: Hover effects, pulse animations, dan rotating borders

### 🎯 Interactive Elements
- **Tombol "Jelajahi"**: Primary CTA dengan arrow icon dan hover effects
- **Tombol "Hubungi Kami"**: Secondary CTA dengan chat icon
- **Image Hover**: Scale dan overlay effects pada gambar utama
- **Responsive**: Adaptif untuk semua ukuran layar

## Component Structure

```tsx
<main> // Container utama dengan gradient background
  ├── Background Elements (Decorative blurred circles)
  ├── Content Grid
  │   ├── Left Column (Text & Buttons)
  │   │   ├── University Name
  │   │   ├── Main Title (Himpunan Mahasiswa Sistem Informasi)
  │   │   ├── Description
  │   │   └── Action Buttons
  │   └── Right Column (Images)
  │       ├── Main Image Circle
  │       ├── Secondary Image Circle
  │       └── Floating Decorative Elements
  └── Bottom Wave Decoration
```

## Typography Hierarchy

1. **University Name**: `text-lg md:text-xl` - Subtitle style
2. **Main Title**: `text-4xl md:text-5xl lg:text-6xl` - Hero title
3. **Description**: `text-lg md:text-xl` - Supporting text
4. **Buttons**: `font-semibold` - Call-to-action text

## Animation Details

### Background Animations
- Decorative circles dengan `animate-pulse` dan delays
- Rotating dashed border pada main image (20s duration)

### Interactive Animations
- Button hover: `scale-105` dengan smooth transitions
- Image hover: `scale-110` dengan overlay gradient
- Icon animations: `translate-x-1` dan `scale-110`

### Responsive Breakpoints
- **Mobile**: Single column layout, smaller images
- **Tablet**: Adjusted spacing dan font sizes
- **Desktop**: Two-column grid dengan full visual impact

## Props & Customization

### Current Setup
```tsx
// Images
src={Banner} // Main team photo
alt="HIMASI UNAS Team" // Accessibility

// Links
href="/kegiatan" // Jelajahi button
href="/kontak" // Hubungi Kami button
```

### Customizable Elements
- Background gradient colors
- Button text dan links
- Image sources
- Animation durations
- Responsive breakpoints

## Performance Optimizations
- `priority` loading untuk main image
- Efficient CSS animations dengan `transform`
- Semantic HTML structure
- Optimized image sizing

## Accessibility Features
- Proper alt texts untuk images
- Semantic HTML structure
- Color contrast compliance
- Keyboard navigation support
- Screen reader friendly

## Browser Compatibility
- Modern browsers dengan CSS Grid support
- Fallback untuk animasi complex
- Responsive design untuk semua devices
- Touch-friendly button sizes

## Usage Example
```tsx
import Hero from '@/components/shared/Home/Hero'

export default function HomePage() {
  return (
    <div>
      <Hero />
      {/* Other page content */}
    </div>
  )
}
```

## Future Enhancements
- Parallax scrolling effects
- Video background options
- Dynamic content dari CMS
- A/B testing variants
- Analytics tracking untuk CTA buttons