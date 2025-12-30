import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <main className="bg-[#FFE8DB] relative">
      <div className="max-w-[1560px] pt-20 md:pt-15 mx-auto relative">
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
          <Image
            src="/icon/Partner/1.png"
            alt="Partner Icon 1"
            width={60}
            height={60}
            className="w-12 h-12 md:w-16 md:h-16 opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
        </div>

        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
          <Image
            src="/icon/Partner/2.png"
            alt="Partner Icon 2"
            width={60}
            height={60}
            className="w-12 h-12 md:w-16 md:h-16 opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
        </div>

        <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-10">
          <Image
            src="/icon/Partner/3.png"
            alt="Partner Icon 3"
            width={60}
            height={60}
            className="w-12 h-12 md:w-16 md:h-16 opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
        </div>

        <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-10">
          <Image
            src="/icon/Partner/4.png"
            alt="Partner Icon 4"
            width={60}
            height={60}
            className="w-12 h-12 md:w-16 md:h-16 opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
        </div>

        <div className="flex justify-center font-bold text-center text-lg md:text-4xl uppercase pt-8 md:pt-15 max-w-2xl mx-auto text-black px-4 tracking-wider">
          <h2 className="text-black">Partner <span className="text-[#4B061A]">Kami</span></h2>
        </div>
        <div className="flex justify-center text-center text-sm md:text-2xl italic text-black max-w-4xl mx-auto py-5 md:py-10 px-4">
          <p>
            Berkontribusi terhadap pertumbuhan dan keberlanjutan program kami,
            <br className="hidden lg:block" /> tetapi juga menjadi bagian dari
            gerakan yang membawa
            <br className="hidden lg:block" /> perubahan positif.
          </p>
        </div>
        <div className="flex justify-center pb-10">
          <Link 
            href="#contact"
            className="bg-[#4B061A] text-white px-5 md:px-8 py-1 rounded-lg font-semibold text-sm md:text-lg hover:bg-[#3A0514] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-block text-center"
          >
            Jelajahi
          </Link>
        </div>
      </div>
      
      {/* Bottom Wave Decoration */}
      <div className="w-full">
        <svg viewBox="0 0 1200 120" className="w-full h-auto">
          <path
            d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
            fill="#4B061A"
          />
        </svg>
      </div>
    </main>
  );
}
