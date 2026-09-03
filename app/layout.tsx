import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Poppins } from "next/font/google";
import AppLayoutShell from "@/components/shared/AppLayoutShell";
import Hash from "@/components/shared/PathHash/Hash";
import ClarityScript from "@/components/shared/ClarityScript";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "optional",
  weight: ["300", "400", "500", "600", "700", "800"],
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.himasiunas.com"),
  title: {
    default: "HIMASI UNAS | Himpunan Mahasiswa Sistem Informasi Universitas Nasional",
    template: "%s | HIMASI UNAS",
  },
  description:
    "Website resmi Himpunan Mahasiswa Sistem Informasi (HIMASI) Universitas Nasional. Wadah pengembangan potensi akademik, profesional, teknologi, seminar, workshop, dan jejaring mahasiswa FTKI UNAS.",
  keywords: [
    "HIMASI",
    "HIMASI UNAS",
    "Sistem Informasi UNAS",
    "Universitas Nasional",
    "FTKI UNAS",
    "Himpunan Mahasiswa Sistem Informasi",
    "Organisasi Mahasiswa UNAS",
    "Mahasiswa Sistem Informasi Jakarta",
    "Kegiatan HIMASI",
  ],
  authors: [{ name: "HIMASI UNAS", url: "https://www.himasiunas.com" }],
  creator: "HIMASI UNAS",
  publisher: "Universitas Nasional",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon/LOGO HIMASI UNAS.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "HIMASI UNAS | Himpunan Mahasiswa Sistem Informasi Universitas Nasional",
    description:
      "Website resmi Himpunan Mahasiswa Sistem Informasi (HIMASI) Universitas Nasional. Wadah pengembangan potensi akademik, profesional, dan teknologi mahasiswa Sistem Informasi FTKI UNAS.",
    url: "https://www.himasiunas.com",
    siteName: "HIMASI UNAS",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/image/Home/BannerV1.png",
        width: 1200,
        height: 630,
        alt: "HIMASI UNAS - Himpunan Mahasiswa Sistem Informasi Universitas Nasional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HIMASI UNAS | Himpunan Mahasiswa Sistem Informasi Universitas Nasional",
    description:
      "Website resmi Himpunan Mahasiswa Sistem Informasi (HIMASI) Universitas Nasional.",
    images: ["/image/Home/BannerV1.png"],
  },
  applicationName: "HIMASI UNAS",
};

// Schema.org JSON-LD Structured Data
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://www.himasiunas.com/#organization",
      name: "HIMASI UNAS",
      alternateName: [
        "Himpunan Mahasiswa Sistem Informasi Universitas Nasional",
        "HIMASI Universitas Nasional",
      ],
      url: "https://www.himasiunas.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.himasiunas.com/icon/LOGO%20HIMASI%20UNAS.png",
        width: 512,
        height: 512,
      },
      image: "https://www.himasiunas.com/image/Home/BannerV1.png",
      description:
        "Himpunan Mahasiswa Sistem Informasi Universitas Nasional (HIMASI UNAS) adalah organisasi kemahasiswaan di Fakultas Teknologi Komunikasi dan Informatika Universitas Nasional.",
      parentOrganization: {
        "@type": "CollegeOrUniversity",
        name: "Universitas Nasional",
        url: "https://www.unas.ac.id",
      },
      sameAs: [
        "https://www.instagram.com/himasi.unas1949",
        "https://wa.me/628569874380",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Jakarta Selatan",
        addressRegion: "DKI Jakarta",
        addressCountry: "ID",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.himasiunas.com/#website",
      url: "https://www.himasiunas.com",
      name: "HIMASI UNAS",
      publisher: {
        "@id": "https://www.himasiunas.com/#organization",
      },
      inLanguage: "id-ID",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${poppins.variable} font-poppins text-white overflow-x-hidden`}
      >
        <ClarityScript />
        <Hash 
          enableTitle={false}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <AppLayoutShell>{children}</AppLayoutShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
