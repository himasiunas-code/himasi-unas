import { permanentRedirect } from 'next/navigation';

export default function GaleriPage() {
    // Redirect ke tahun akademik terbaru
    permanentRedirect('/galeri/2025-2026');
}