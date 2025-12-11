import { MISSION_DATA } from "@/constants/Home/Mission";

export default function VM() {
    return(
        <main className="bg-[#4B061A] py-10">
            <div className="w-full max-w-xs sm:max-w-md md:max-w-xl lg:max-w-4xl mx-auto px-4 flex justify-center flex-col items-center text-center gap-3 md:gap-5 pt-2">
                <h2 className="font-bold text-xl md:text-2xl lg:text-4xl xl:text-6xl uppercase">Visi</h2>
                <p className="font-semibold text-sm sm:text-base lg:text-xl xl:text-3xl italic">
                    “Mewujudkan HIMASI sebagai wadah inklusif dan aktif
                    yang menumbuhkan partisipasi, kreativitas, serta kompetensi
                    mahasiswa Sistem Informasi.”
                </p>
            </div>
            <div className="w-full max-w-6xl mx-auto px-4 flex justify-center items-center text-center pt-9 md:pt-12 lg:pt-15">
                <h2 className="font-bold text-xl md:text-2xl lg:text-4xl xl:text-6xl uppercase">MISI</h2>
            </div>
            <div className="bg-[#4B061A] pt-5 md:pt-8 pb-10">
                <div className="w-full">
                    <div className="hidden lg:block max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-4 gap-6">
                            {MISSION_DATA.map((mission) => (
                                <div key={mission.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                    <div className="flex flex-col items-center gap-4 text-center">
                                        <div className="bg-[#4B061A] text-white rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                                            <span className="font-bold text-lg">{mission.id}</span>
                                        </div>
                                        <p className="font-semibold text-base text-[#4B061A] leading-relaxed">
                                            {mission.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="lg:hidden">
                        <div className="overflow-x-auto scrollbar-hide pl-4 pr-16">
                            <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                                {MISSION_DATA.map((mission) => (
                                    <div key={mission.id} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow duration-300 w-48 h-48 sm:w-52 sm:h-52 shrink-0">
                                        <div className="flex flex-col items-center justify-center gap-3 text-center h-full">
                                            <div className="bg-[#4B061A] text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
                                                <span className="font-bold text-sm sm:text-lg">{mission.id}</span>
                                            </div>
                                            <p className="font-semibold text-xs sm:text-sm text-[#4B061A] leading-relaxed text-center">
                                                {mission.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center mt-4">
                            <p className="text-white text-xs opacity-70">← Geser untuk melihat lebih banyak →</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}