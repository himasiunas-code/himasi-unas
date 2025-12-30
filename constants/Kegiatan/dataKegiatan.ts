export interface KegiatanData {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  image: string;
  buttonText: string;
}

export const kegiatanData: KegiatanData[] = [
  {
    id: 1,
    title: "KEGIATAN 1",
    subtitle: "Godot for Beginners: Langkah Pertama Menjadi Game Developer",
    date: "20 Desember 2025",
    description: `Himpunan Mahasiswa Sistem Informasi (HIMASI) bersama Program Studi Sistem Informasi 
      Fakultas Teknologi Komunikasi dan Informatika (FTKI) Universitas Nasional sukses menyelenggarakan 
      Workshop Online bertajuk "Godot for Beginners: Langkah Pertama Menjadi Game Developer" pada Sabtu, 
      20 Desember 2025. Kegiatan ini dilaksanakan secara daring melalui Zoom Meeting mulai pukul 08.30 
      hingga 12.00 WIB.<br><br>
      Workshop ini bertujuan untuk memperkenalkan dasar-dasar game development menggunakan Godot Engine, 
      khususnya bagi peserta pemula yang tertarik memasuki industri kreatif digital. Antusiasme peserta 
      terlihat cukup tinggi dengan jumlah 75 pendaftar dari kuota maksimal 100 peserta yang telah 
      ditetapkan panitia.<br><br>
      Peserta workshop berasal dari berbagai institusi pendidikan, di antaranya Universitas Nasional, 
      STMIK Antar Bangsa, Universitas Mercu Buana, Institut Widya Pratama, Institut Widya Pratama Pekalongan, 
      Institut Teknologi dan Bisnis Tuban, serta SMK Citra Negara. Selain itu, peserta dari Universitas Nasional 
      juga berasal dari beberapa fakultas, yaitu FTKI, FAPERTA, dan FEB, dengan latar belakang jurusan 
      yang beragam seperti Sistem Informasi, Informatika, Agroteknologi, Desain Komunikasi Visual (DKV), 
      dan Manajemen. Keberagaman ini menunjukkan bahwa minat terhadap pengembangan game tidak terbatas 
      pada satu bidang keilmuan saja.<br><br>
      Kegiatan diawali dengan sesi pembukaan dan sambutan dari Sekretaris Program Studi Sistem Informasi serta 
      Ketua Pelaksana kegiatan. Acara inti kemudian diisi oleh Fauzan Hanandito, S.Kom, seorang game 
      developer yang berpengalaman dalam penggunaan Godot Engine. Materi yang disampaikan meliputi 
      pengenalan Godot, konsep dasar game development, serta praktik langsung pembuatan game sederhana.<br><br>
      Sesi praktik berlangsung interaktif dan diikuti dengan antusias oleh peserta. Workshop ditutup 
      dengan sesi tanya jawab, penutupan acara, serta dokumentasi bersama. Melalui kegiatan ini, 
      diharapkan peserta mendapatkan wawasan dan bekal awal untuk mengembangkan keterampilan di bidang 
      game development serta termotivasi untuk terus berkarya di industri kreatif digital.`,
    image: "image/Home/Kegiatan/workshop-game-developer.jpg",
    buttonText: "Baca"
  },
];