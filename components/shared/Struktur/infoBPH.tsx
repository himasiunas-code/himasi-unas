"use client"

import Image from "next/image";
import { useState } from "react";
import { leaders } from "@/constants/Struktur/dataBPH";
import { Instagram } from "lucide-react";
import type { StaticImageData } from "next/image";
import Link from "next/link";

const roles = ["Ketua Himpunan", "Wakil Himpunan", "Bendahara", "Sekretaris"]

type RoleColorScheme = {
  gradient: string;
  shadow: string;
  border: string;
  hover: string;
}

const roleColors: Record<string, RoleColorScheme> = {
  "Ketua Himpunan": {
    gradient: "from-blue-600 via-blue-500 to-purple-600",
    shadow: "shadow-blue-500/25",
    border: "border-blue-500",
    hover: "hover:border-blue-300 hover:text-blue-300"
  },
  "Wakil Himpunan": {
    gradient: "from-purple-600 via-pink-500 to-red-500",
    shadow: "shadow-purple-500/25", 
    border: "border-purple-500",
    hover: "hover:border-purple-300 hover:text-purple-300"
  },
  "Bendahara": {
    gradient: "from-green-600 via-emerald-500 to-teal-600",
    shadow: "shadow-green-500/25",
    border: "border-green-500", 
    hover: "hover:border-green-300 hover:text-green-300"
  },
  "Sekretaris": {
    gradient: "from-orange-600 via-red-500 to-pink-600",
    shadow: "shadow-orange-500/25",
    border: "border-orange-500",
    hover: "hover:border-orange-300 hover:text-orange-300"
  }
}

type Leader = {
  image: string | StaticImageData;
  name: string;
  role: string;
  description: string;
  instagram: string;
};

export default function BPH() {


  const [selectedRole, setSelectedRole] = useState("Ketua Himpunan")
  const [isAnimating, setIsAnimating] = useState(false)
  const [colorTransition, setColorTransition] = useState(false)

  const handleRoleChange = (role: string) => {
    if (role === selectedRole) return
    
    setIsAnimating(true)
    setColorTransition(true)
    
    setTimeout(() => {
      setSelectedRole(role)
      setTimeout(() => {
        setIsAnimating(false)
        setColorTransition(false)
      }, 100)
    }, 300)
  }

  const currentColors = roleColors[selectedRole as keyof typeof roleColors]

  const ketua = leaders.find((l) => l.role === "Ketua Himpunan")
  const wakil = leaders.find((l) => l.role === "Wakil Himpunan")
  const bendahara = leaders.find((l) => l.role === "Bendahara")
  const sekretaris = leaders.find((l) => l.role === "Sekretaris")

  const leaderMap: Record<string, typeof leaders[0] | undefined> = {
    "Ketua Himpunan": ketua,
    "Wakil Himpunan": wakil,
    Bendahara: bendahara,
    Sekretaris: sekretaris,
  }

  const LeaderCard = ({ leader, alignRight = false, isVisible = true, roleColors }: { 
    leader: Leader | undefined; 
    alignRight?: boolean; 
    isVisible?: boolean;
    roleColors?: RoleColorScheme
  }) => {
    if (!leader) return null
    return (
      <div
        className={`flex flex-col ${
          alignRight ? "md:flex-row-reverse" : "md:flex-row"
        } items-center md:items-start gap-6 pt-8 transition-all duration-500 ease-in-out transform ${
          isVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-8 scale-95'
        }`}
      >
        <div className={`relative w-50 h-60 transition-all duration-700 ease-in-out group ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}>
          <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${roleColors?.gradient || 'from-purple-500 to-pink-500'} opacity-20 transition-all duration-700 group-hover:opacity-30`} />
          <Image
            src={leader.image}
            alt={leader.name}
            fill
            className="rounded-2xl object-cover transition-transform duration-500 hover:scale-105 relative z-10"
          />
        </div>

        <div className={`text-center ${alignRight ? "md:text-right" : "md:text-left"} transition-all duration-500 ease-in-out delay-100 ${
          isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${alignRight ? 'translate-x-8' : '-translate-x-8'}`
        }`}>
          <h2 className={`text-xl font-bold mb-1 transition-all duration-700 bg-linear-to-r ${roleColors?.gradient || 'from-purple-500 to-pink-500'} bg-clip-text text-transparent`}>
            {leader.role}
          </h2>
          <h3 className="text-lg font-semibold transition-all duration-300 text-white">
            {leader.name}
          </h3>
          <p className="mt-2 text-sm text-gray-200 max-w-lg transition-all duration-300">
            {leader.description}
          </p>
          <Link
            href={leader.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={`group inline-flex items-center justify-center mt-4 p-3 rounded-full bg-linear-to-r ${roleColors?.gradient || 'from-purple-500 via-pink-500 to-red-500'} text-white shadow-lg transform transition-all duration-500 hover:scale-110 hover:shadow-xl ${roleColors?.shadow || 'hover:shadow-pink-500/25'} hover:-translate-y-1 cursor-pointer ${alignRight ? "mx-auto md:ml-auto" : ""}`}
          >
            <Instagram 
              size={20} 
              className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" 
            />
            <span className="ml-2 text-sm font-medium opacity-100 transition-all duration-300 transform translate-x-0 group-hover:rotate-5">
              Follow
            </span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4 py-10">
      <div className="border-t-3 border-white" />
      <div className="flex justify-center font-bold text-center text-xl md:text-4xl uppercase py-5 md:py-10 text-white">
        <h2>Badan Pengurus Harian</h2>
      </div>
      <div className="flex flex-wrap md:hidden justify-center gap-3 mb-6">
        {roles.map((role) => {
          const roleColor = roleColors[role as keyof typeof roleColors]
          const isSelected = selectedRole === role
          return (
            <button
              key={role}
              onClick={() => handleRoleChange(role)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-500 transform hover:scale-105 active:scale-95 relative overflow-hidden ${
                isSelected
                  ? `bg-linear-to-r ${currentColors.gradient} text-white ${currentColors.border} shadow-lg ${currentColors.shadow}`
                  : `border-gray-500 text-gray-300 ${roleColor.hover} hover:shadow-md`
              }`}
              disabled={isAnimating}
            >
              <div className={`absolute inset-0 rounded-full bg-linear-to-r ${roleColor.gradient} transition-all duration-700 ease-in-out ${
                isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`} />
              
              <span className="relative z-10 transition-all duration-300">
                {role.split(" ")[0]}
              </span>
            </button>
          )
        })}
      </div>

      <div className={`md:hidden border-b-3 transition-colors duration-700 ease-in-out pb-5 min-h-[400px] flex items-center justify-center ${
        colorTransition ? 'border-white/50' : 'border-white'
      }`}>
        <div className={`w-full transition-all duration-500 ease-in-out ${
          isAnimating ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
        }`}>
          <LeaderCard 
            leader={leaderMap[selectedRole]} 
            alignRight={false} 
            isVisible={!isAnimating}
            roleColors={currentColors}
          />
        </div>
      </div>

      <div className="hidden md:block border-b-3 border-white pb-5">
        <LeaderCard leader={ketua} alignRight={false} />
        <LeaderCard leader={wakil} alignRight={true} />
        <LeaderCard leader={bendahara} alignRight={false} />
        <LeaderCard leader={sekretaris} alignRight={true} />
      </div>
    </div>
  )
}
