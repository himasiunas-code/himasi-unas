import Image from "next/image";
import Link from "next/link";
import HIMASI from "@/app/favicon.ico";
import Card from "@/components/ui/cardDivision";
import { divisions } from "@/constants/Home/Division";

export default function Introduction() {
  return (
    <main className="bg-[#4B061A] relative overflow-hidden">
      <div className="w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-7xl mx-auto px-4 flex justify-center items-center relative gap-4 pb-6 hidden">
        <div>
          <Image src={HIMASI} alt="Logo HIMASI UNAS" width={60} height={60} />
        </div>

        <div className="bg-[#4B061A] text-white font-bold text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl px-6 sm:px-8 py-3 rounded-xl shadow-md text-center">
          Kenal HIMASI Lebih Dekat!
        </div>

        <div>
          <Image src={HIMASI} alt="Logo HIMASI" width={60} height={60} />
        </div>
      </div>

      <div className="w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-7xl mx-auto px-8 md:px-4 text-justify md:text-center text-white text-xs md:text-sm lg:text-base xl:text-lg leading-relaxed pt-4 pb-8 md:pb-12 font-bold relative">
        <div className="absolute top-20 -right-16 w-15 h-15 bg-[#FFE8DB] opacity-80 rounded-full blur-2xl animate-float-random-1"></div>

        <p className="hidden lg:block relative z-10">
          Selamat datang di Website HIMASI, Himpunan Mahasiswa Sistem Informasi!
          <br />
          Organisasi mahasiswa yang berdedikasi untuk mengembangkan potensi
          akademik, profesional, dan sosial di
          <br />
          bidang Sistem Informasi. Dengan berbagai kegiatan seperti seminar,
          pelatihan, hingga proyek kolaboratif, kami
          <br />
          bertujuan untuk menciptakan lingkungan belajar yang inspiratif
          sekaligus membangun jejaring yang solid di
          <br />
          antara mahasiswa.
        </p>
        <p
          className="lg:hidden relative z-10"
          style={{ textAlignLast: "center" }}
        >
          Selamat datang di Website HIMASI, Himpunan Mahasiswa Sistem Informasi!
          Organisasi mahasiswa yang berdedikasi untuk mengembangkan potensi
          akademik, profesional, dan sosial di bidang Sistem Informasi. Dengan
          berbagai kegiatan seperti seminar, pelatihan, hingga proyek
          kolaboratif, kami bertujuan untuk menciptakan lingkungan belajar yang
          inspiratif sekaligus membangun jejaring yang solid di antara
          mahasiswa.
        </p>
      </div>

      <div className="flex justify-center items-center pb-6">
        <p className="text-xs md:text-sm lg:text-base xl:text-lg text-white font-bold whitespace-pre">
          34 Anggota ━━━ 5 Divisi
        </p>
      </div>

      <div className="w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-7xl flex justify-center mx-auto px-4 pb-8 relative">
        <div className="absolute -bottom-1 left-20 w-15 h-15 lg:w-32 lg:h-32 bg-[#FFE8DB] opacity-80 rounded-full blur-3xl animate-float-random-2 hidden md:block"></div>
        <div className="absolute -bottom-1 right-20 w-15 h-15 lg:w-32 lg:h-32 bg-[#FFE8DB] opacity-80 rounded-full blur-3xl animate-float-random-3 hidden md:block"></div>

        <div className="flex flex-wrap justify-center gap-6 relative z-10">
          {divisions.map((division) => (
            <Card key={division.id} {...division} />
          ))}
        </div>
      </div>

      <div className="w-full flex justify-center pb-20 relative">
        <Link
          href="/struktur"
          className="bg-[#FFE8DB] text-xs md:text-sm lg:text-base xl:text-lg text-black font-bold px-4 md:px-8 py-3 rounded-xl hover:rotate-1 hover:bg-[#E4C6BE] transition relative z-10"
        >
          Info Lebih Lanjut
        </Link>
      </div>
    </main>
  );
}
