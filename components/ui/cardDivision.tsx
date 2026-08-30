import Image from "next/image";
import { Division } from "@/lib/type/Home/HomeDivision";
import { StaticImageData } from "next/image";
import { LucideIcon } from "lucide-react";

const isStaticImageData = (image: StaticImageData | LucideIcon): image is StaticImageData => {
  return typeof image === 'object' && 'src' in image && typeof (image as StaticImageData).src === 'string';
};

export default function Card({ title, image }: Division) {
  const IconComponent = image as LucideIcon;
  
  return (
    <div
      className="
        bg-[#6B2336] border border-white/40 rounded-xl shadow-md
        flex flex-col items-center text-center
        w-30 h-30 sm:w-36 sm:h-36 md:w-42 md:h-42 lg:w-46 lg:h-46 xl:w-52 xl:h-52
        p-4 sm:p-6
      "
    >
      {isStaticImageData(image) ? (
        <Image
          src={image}
          alt={title}
          className="mt-1 md:mt-4 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
        />
      ) : (
        <div className="mt-1 md:mt-4 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white flex items-center justify-center">
          <IconComponent 
            size={32} 
            className="w-full h-full max-w-12 max-h-12" 
          />
        </div>
      )}

      <div className="mt-3 sm:mt-4 flex items-center justify-center">
        <p className="text-white font-bold text-xs md:text-sm lg:text-base xl:text-lg leading-snug">
          {title}
        </p>
      </div>
    </div>
  );
}
