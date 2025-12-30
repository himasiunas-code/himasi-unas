"use client";

import Image from "next/image";
import { Building2, Calendar, CheckCircle2, Clock } from "lucide-react";
import { activePartnerships, pastPartnerships } from "@/constants/Partnership";
import { getCategoryColor, formatDate, getYear } from "@/lib/partnership";

export default function SlideLogo() {
  return (
    <main className="bg-[#4B061A] pb-16">
      <div className="container mx-auto px-4">
        {/* Active Partnerships Section - Only show if there are active partnerships */}
        {activePartnerships.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/30">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <h3 className="text-xl font-semibold text-white">
                  Sedang Berlangsung
                </h3>
              </div>
              <div className="h-px flex-1 bg-linear-to-r from-green-400/50 to-transparent"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {activePartnerships.map((partner, index) => (
                <div
                  key={index}
                  className="group relative bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 border-2 border-white/30 hover:border-white/50 overflow-hidden"
                >
                  {/* Glare effect overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-linear-to-br from-transparent via-white/30 to-transparent -translate-x-full -translate-y-full group-hover:translate-x-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out rotate-12"></div>
                  </div>
                  
                  <div className="relative aspect-square mb-3 flex items-center justify-center">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-white text-sm mb-1 line-clamp-1">
                      {partner.name}
                    </h4>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(
                        partner.category
                      )}`}
                    >
                      <Building2 className="w-3 h-3" />
                      {partner.category}
                    </span>
                    {partner.endDate && (
                      <p className="text-xs text-gray-200 mt-1.5 flex items-center justify-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Hingga {formatDate(partner.endDate)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Partnerships Section - Only show if there are past partnerships */}
        {pastPartnerships.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 bg-gray-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-400/30">
                <Clock className="w-5 h-5 text-gray-300" />
                <h3 className="text-sm md:text-xl font-semibold text-white">
                  Riwayat Kerja Sama
                </h3>
              </div>
              <div className="h-px flex-1 bg-linear-to-r from-gray-400/50 to-transparent"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {pastPartnerships.map((partner, index) => (
                <div
                  key={index}
                  className="group relative bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-all duration-300 border-2 border-white/20 hover:border-white/40 overflow-hidden"
                >
                  {/* Glare effect overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-linear-to-br from-transparent via-white/30 to-transparent -translate-x-full -translate-y-full group-hover:translate-x-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out rotate-12"></div>
                  </div>
                  
                  <div className="relative aspect-square mb-3 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="font-medium text-white text-sm mb-1 line-clamp-1">
                      {partner.name}
                    </h4>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(
                        partner.category
                      )} opacity-75`}
                    >
                        <Building2 className="w-3 h-3" />
                      {partner.category}
                    </span>
                    {partner.endDate && (
                      <p className="text-xs text-gray-300 mt-1.5">
                        {getYear(partner.endDate)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State - Only show if both arrays are empty */}
        {activePartnerships.length === 0 && pastPartnerships.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 text-lg">
              Belum ada data kerja sama yang tersedia
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
