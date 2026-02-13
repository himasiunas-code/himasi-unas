import { redirect } from 'next/navigation';

export default function GaleriPage() {
    // Redirect ke tahun akademik terbaru
    redirect('/galeri/2025-2026');
}