import { Instagram } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Contact() {

  return (
    <main id="contact" className="bg-[#FFE8DB] pb-16 relative">
      <div className="flex font-bold z-2 text-lg sm:text-xl md:text-4xl uppercase px-2 sm:px-6 pt-6 text-black max-w-[1560px] mx-auto">
        <h2 className="leading-relaxed">bergabung bersama kami?<br />hubungi dibawah ini</h2>
      </div>
      
      <div className="relative">
        <div className="flex flex-row gap-2 md:gap-8 px-2 md:px-12 mt-8 sm:mt-12 md:mt-15 justify-evenly max-w-[1560px] mx-auto">
        
        <div className="bg-[#4B061A] z-2 rounded-xl shadow-lg p-5 md:p-8 flex flex-col items-center text-center flex-1 max-w-[280px] md:max-w-[320px] h-64 md:h-72 border-2 border-[#4B061A]/10 hover:border-[#4B061A]/30 transition-all duration-300 hover:shadow-xl justify-between overflow-hidden">
          <div className="bg-[#000000] p-3 md:p-5 rounded-full mb-4 md:mb-6">
            <Instagram className="w-6 h-6 md:w-10 md:h-10 text-white" />
          </div>
          
          <div className="flex flex-col items-center grow">
            <h3 className="text-base md:text-xl font-bold text-white mb-2 md:mb-3">Instagram</h3>
            
            <p className="text-white mb-4 md:mb-6 text-xs md:text-base text-center italic">@himasi.unas1949</p>
          </div>
          
          <Link
            href="https://www.instagram.com/himasi.unas1949"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FFE8DB] text-black px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base hover:bg-[#F5D5C8] hover:text-[#4B061A] transition-colors duration-300 shadow-md hover:shadow-lg inline-block text-center w-full max-w-[200px] cursor-pointer"
          >
            Hubungi
          </Link>
        </div>

        <div className="bg-[#4B061A] z-2 rounded-xl shadow-lg p-5 md:p-8 flex flex-col items-center text-center flex-1 max-w-[280px] md:max-w-[320px] h-64 md:h-72 border-2 border-[#4B061A]/10 hover:border-[#4B061A]/30 transition-all duration-300 hover:shadow-xl justify-between overflow-hidden">
          <div className="bg-[#000000] p-3 md:p-5 rounded-full mb-4 md:mb-6">
            <svg 
              className="w-6 h-6 md:w-10 md:h-10 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
            </svg>
          </div>
          
          <div className="flex flex-col items-center grow">
            <h3 className="text-base md:text-xl font-bold text-white mb-2 md:mb-3">WhatsApp</h3>
            
            <p className="text-white mb-4 md:mb-6 text-xs md:text-base text-center">+62 812-3456-7890</p>
          </div>
          
          <Link
            href="https://wa.me/628569874380?text=Halo,%20saya%20ingin%20bertanya%20tentang%20HIMASI%20UNAS"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FFE8DB] text-black px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base hover:bg-[#F5D5C8] hover:text-[#4B061A] transition-colors duration-300 shadow-md hover:shadow-lg inline-block text-center w-full max-w-[200px] cursor-pointer"
          >
            Hubungi
          </Link>
        </div>

        <div className="absolute h-75 w-75 sm:h-100 sm:w-100 md:h-100 md:w-125 xl:h-150 xl:w-175 right-0 top-1/2 transform -translate-y-3/5 z-0">
          <Image
            src="/icon/Partner/AsetContact.png"
            alt="Contact Asset"
            fill
            className="object-contain"
          />
        </div>
        </div>
      </div>
    </main>
  );
}
