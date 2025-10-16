"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { divisions } from "@/constants/Struktur/dataDivision";

export default function Division() {
  const [selectedDivision, setSelectedDivision] = useState<string>(
    divisions[0].id
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isDivisionLoading, setIsDivisionLoading] = useState<boolean>(false);

  const currentDivision = divisions.find((div) => div.id === selectedDivision);

  useEffect(() => {
    divisions.forEach((division) => {
      division.members.forEach((member) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = member.image.src;
        document.head.appendChild(link);
      });
    });
  }, []);

  const getAbbreviatedName = (name: string) => {
    const abbreviations: { [key: string]: string } = {
      "Research and Development": "R&D",
      "Creative Media": "Creative Media",
      "Public Relation": "Public Relation",
      "Human Talent Development": "HTD",
      Entrepreneurship: "Entrepreneurship",
    };
    return abbreviations[name] || name;
  };

  const getTruncatedText = (text: string, limit: number = 150) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit).trim() + "...";
  };

  const handleDivisionChange = (divisionId: string) => {
    if (divisionId === selectedDivision) return;

    setIsDivisionLoading(true);
    setSelectedDivision(divisionId);
    setIsExpanded(false);

    setTimeout(() => {
      setIsDivisionLoading(false);
    }, 100);
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
      <main className="bg-[#4B061A] pb-20">
        <div className="flex justify-center font-bold text-center text-xl md:text-4xl uppercase text-white pb-5">
          Divisi Himpunan
        </div>

        <div className="flex flex-wrap justify-center gap-2 md:gap-4 px-4 mb-8">
          {divisions.map((division) => (
            <button
              key={division.id}
              onClick={() => handleDivisionChange(division.id)}
              className={`px-4 md:px-8 py-3 md:py-4 rounded-xl font-bold text-xs md:text-sm cursor-pointer transition-transform duration-300 hover:-translate-y-1 ${
                selectedDivision === division.id
                  ? "bg-white text-[#4B061A] shadow-lg"
                  : "bg-transparent text-white border-2 border-white/60"
              }`}
            >
              {getAbbreviatedName(division.name)}
            </button>
          ))}
        </div>

        {currentDivision && (
          <div className="max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {currentDivision.name}
              </h2>

              <div className="max-w-4xl mx-auto">
                <p
                  className="text-white text-sm md:text-base leading-relaxed"
                  style={{ textAlign: "justify", textAlignLast: "center" }}
                >
                  {isExpanded
                    ? currentDivision.description
                    : getTruncatedText(currentDivision.description)}
                </p>

                {currentDivision.description.length > 150 && (
                  <div className="flex justify-center mt-3">
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-white text-sm underline hover:text-gray-300 transition-colors duration-200 font-medium cursor-pointer"
                    >
                      {isExpanded ? "Baca Lebih Sedikit" : "Baca Selengkapnya"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <div
                className={`flex flex-wrap justify-center gap-4 md:gap-6 transition-opacity duration-300 ${
                  isDivisionLoading ? "opacity-50" : "opacity-100"
                }`}
              >
                {currentDivision.members.map((member, index) => (
                  <div
                    key={member.id}
                    className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-64 md:h-72 lg:h-80 animate-fadeInUp w-[calc(50%-8px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)]"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      priority={selectedDivision === currentDivision?.id}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />

                    <div className="relative z-10 h-full flex flex-col justify-between p-3 md:p-4">
                      <div className="flex justify-center">
                        <span className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs md:text-sm font-medium text-center">
                          {member.role}
                        </span>
                      </div>

                      <div className="flex items-end justify-between">
                        <div className="flex-1 mr-3">
                          <h3 className="text-white font-semibold text-sm md:text-base leading-tight">
                            {(() => {
                              const words = member.name.split(" ");
                              const midPoint = Math.ceil(words.length / 2);
                              const firstLine = words
                                .slice(0, midPoint)
                                .join(" ");
                              const secondLine = words
                                .slice(midPoint)
                                .join(" ");

                              return (
                                <>
                                  <div>{firstLine}</div>
                                  {secondLine && <div>{secondLine}</div>}
                                </>
                              );
                            })()}
                          </h3>
                        </div>

                        <Link
                          href={member.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative flex-shrink-0 w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-lg flex items-center justify-center hover:scale-110 hover:rotate-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-pink-500/25 cursor-pointer"
                        >
                          <svg
                            className="w-4 h-4 md:w-5 md:h-5 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
