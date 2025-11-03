import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Poppins } from "next/font/google";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import FloatingChatWidget from "@/components/shared/Chatbot/FloatingChatWidget";
import Hash from "@/components/shared/PathHash/Hash";

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
  title: "HIMASI UNAS",
  description:
    "Himpunan Mahasiswa Sistem Informasi Universitas Nasional. Organisasi mahasiswa yang berdedikasi untuk mengembangkan potensi akademik, profesional, dan sosial di bidang Sistem Informasi. Dengan berbagai kegiatan seperti seminar, pelatihan, hingga proyek kolaboratif, kami bertujuan untuk menciptakan lingkungan belajar yang inspiratif sekaligus membangun jejaring yang solid di antara mahasiswa.",
  icons: "./favicon.ico",
  openGraph: {
    title: "HIMASI UNAS",
    description: "Himpunan Mahasiswa Sistem Informasi Universitas Nasional",
    siteName: "HIMASI UNAS",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HIMASI UNAS",
    description: "Himpunan Mahasiswa Sistem Informasi Universitas Nasional",
  },
  applicationName: "HIMASI UNAS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} font-poppins text-white overflow-x-hidden`}
      >
        <Hash 
          enableTitle={true}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <div id="root-layout">
            <Navbar />
            {children}
            <FloatingChatWidget />
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
