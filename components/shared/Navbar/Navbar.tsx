"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const lastScrollY = useRef(0);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle scroll detection and auto-show when idle
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Reset idle timer whenever scroll occurs
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Scrolling up or at very top -> reveal navbar
          if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            // Scrolling down -> hide navbar
            setIsVisible(false);
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }

      // When idle (stopped scrolling for 1.2s), bring back navbar
      idleTimerRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
    };

    // Show navbar when mouse approaches top edge (<= 80px)
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 80) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  // Keep navbar visible when menu is open
  useEffect(() => {
    if (menuOpen) {
      setIsVisible(true);
    }
  }, [menuOpen]);

  const handleMobileNavigate = (path: string) => {
    setTimeout(() => {
      router.push(path);
    }, 300);
  };

  return (
    <header
      className={`fixed z-60 inset-x-0 transition-all duration-500 ease-in-out pointer-events-none ${
        isVisible ? "top-6 opacity-100" : "-top-24 opacity-0"
      }`}
    >
      <div className="mx-auto max-w-[1440px] w-full px-4 pointer-events-auto">
        <div className="h-12 md:h-20 w-full rounded-full bg-[rgba(107,20,48,0.85)] border border-[rgba(255,255,255,0.06)] backdrop-blur-sm shadow-xl flex items-center justify-between px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex flex-row items-center space-x-2 md:space-x-0"
          >
            <div className="flex flex-col">
              <div
                className="text-white font-bold text-lg md:text-2xl tracking-wider"
                style={{
                  transform: "skewX(10deg)",
                  textShadow: "4px 4px 8px rgba(0,0,0,0.3)",
                }}
              >
                <span className="bg-linear-to-r from-[#FFF0E6] to-[#F5D6CC] bg-clip-text text-transparent">
                  HIMASI
                </span>
              </div>
              <p className="text-white text-[8px] md:text-xs font-normal tracking-wide opacity-90">
                Program Studi Sistem Informasi UNAS
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavbarDesktop
            pathname={pathname}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
          />

          {/* Mobile Navigation */}
          <NavbarMobile
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
            pathname={pathname}
            onNavigate={handleMobileNavigate}
          />
        </div>
      </div>
    </header>
  );
}
