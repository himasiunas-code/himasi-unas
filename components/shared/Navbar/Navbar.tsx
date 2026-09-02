"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { navMenu } from "@/constants/navMenu";
import { usePathname, useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navMenu";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const lastScrollY = useRef(0);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle scroll detection dan auto-show saat idle
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Reset idle timer setiap ada aktivitas scroll
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Scrolling ke atas atau di paling atas halaman -> munculkan navbar
          if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            // Scrolling aktif ke bawah -> sembunyikan sementara agar konten leluasa
            setIsVisible(false);
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }

      // Saat idle (berhenti scroll selama 1.2 detik), munculkan kembali navbar secara otomatis
      idleTimerRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
    };

    // Munculkan navbar jika kursor mendekati bagian atas layar (<= 80px)
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
    }
  }, [menuOpen]);

  return (
    // Fixed overlay header that visually "floats" centered with rounded-full container
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
            {/* <Image
          src={HIMASI}
          alt="Logo HIMASI UNAS"
          width={140}
          height={70}
          className="h-[50px] w-[50px] object-contain md:h-[60px] md:w-[100px]"
        /> */}
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

          {/* Desktop Menu */}
          <nav className="hidden lg:flex mr-8 ml-16">
            <NavigationMenu>
              <NavigationMenuList className="flex flex-row gap-4">
                {navMenu.map(({ title, path, dropdown }) => {
                  const hasDropdown = dropdown && dropdown.length > 0;
                  const isActive =
                    pathname === path ||
                    (hasDropdown &&
                      dropdown.some((item) =>
                        pathname.startsWith(item.path.split("?")[0])
                      ));

                  return (
                    <NavigationMenuItem
                      key={title}
                      className="relative flex items-center"
                    >
                      {hasDropdown ? (
                        <div
                          className="relative"
                          onMouseEnter={() => setDropdownOpen(title)}
                          onMouseLeave={() => setDropdownOpen(null)}
                        >
                          <button
                            className={`
                      relative px-2 py-1 text-white transition-colors duration-150 flex items-center gap-1
                      after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-0.5 after:bg-white after:w-0 after:transition-all after:duration-300
                      hover:after:w-full
                      ${
                        isActive
                          ? "after:w-full after:bg-white after:h-0.5"
                          : ""
                      }
                      font-bold
                    `}
                          >
                            {title}
                            <ChevronDown
                              size={16}
                              className={`transition-transform duration-200 ${
                                dropdownOpen === title ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {dropdownOpen === title && (
                            <div className="absolute top-full left-0 pt-2">
                              <div className="bg-[rgba(107,20,48,0.95)] backdrop-blur-sm rounded-lg shadow-xl border border-[rgba(255,255,255,0.1)] py-2 min-w-[120px] z-50">
                                {dropdown.map((item) => (
                                  <Link
                                    key={item.title}
                                    href={item.path}
                                    className="block px-4 py-2 text-white font-semibold mx-2 rounded-full transition-all duration-200 hover:bg-linear-to-r hover:from-[rgba(255,232,219,0.15)] hover:to-[rgba(176,91,122,0.15)] hover:scale-105 hover:shadow-md"
                                  >
                                    {item.title}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <NavigationMenuLink asChild>
                          <Link
                            href={path}
                            className={`
                    relative px-2 py-1 text-white transition-colors duration-150
                    after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-0.5 after:bg-white after:w-0 after:transition-all after:duration-300
                    hover:after:w-full
                    ${
                      pathname === path
                        ? "after:w-full after:bg-white after:h-0.5"
                        : ""
                    }
                    font-bold
                    `}
                          >
                            {title}
                          </Link>
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              className="p-2"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <div className="rotate-90 duration-300">
                  <X size={32} color="#fff" />
                </div>
              ) : (
                <div className="duration-300">
                  <Menu size={32} color="#fff" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -32, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -32, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="lg:hidden bg-[rgba(107,20,48,0.85)] border border-[rgba(255,255,255,0.06)] backdrop-blur-sm px-4 py-6 rounded-2xl mx-4 shadow-xl absolute left-0 right-0 top-14"
            >
              <div className="max-w-md w-full mx-auto flex flex-col items-center">
                <NavigationMenu>
                  <NavigationMenuList className="flex flex-col gap-6 items-center w-full">
                    {navMenu.map(({ title, path, dropdown }) => {
                      const hasDropdown = dropdown && dropdown.length > 0;
                      const isActive =
                        pathname === path ||
                        (hasDropdown &&
                          dropdown.some((item) =>
                            pathname.startsWith(item.path.split("?")[0])
                          ));
                      const isDropdownOpen = dropdownOpen === title;

                      return (
                        <NavigationMenuItem
                          key={title}
                          className="w-full flex flex-col items-center"
                        >
                          {hasDropdown ? (
                            <div className="w-full flex flex-col items-center">
                              <button
                                className={`
                          relative text-white px-4 py-3 font-semibold text-lg w-full text-center transition-colors duration-150 flex items-center justify-center gap-2
                          after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-0.5 after:bg-white after:w-0 after:transition-all after:duration-300
                          hover:after:w-full
                          ${
                            isActive
                              ? "after:w-full after:bg-white after:h-0.5"
                              : ""
                          }
                        `}
                                onClick={() =>
                                  setDropdownOpen(isDropdownOpen ? null : title)
                                }
                              >
                                {title}
                                <ChevronDown
                                  size={16}
                                  className={`transition-transform duration-200 ${
                                    isDropdownOpen ? "rotate-180" : ""
                                  }`}
                                />
                              </button>

                              <AnimatePresence>
                                {isDropdownOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full flex flex-col items-center mt-2 gap-2 overflow-hidden"
                                  >
                                    {dropdown.map((item) => (
                                      <button
                                        key={item.title}
                                        className="text-white px-4 py-2 font-medium hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors duration-150 w-[80%]"
                                        onClick={() => {
                                          setMenuOpen(false);
                                          setDropdownOpen(null);
                                          setTimeout(
                                            () => router.push(item.path),
                                            300
                                          );
                                        }}
                                      >
                                        {item.title}
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ) : (
                            <button
                              className={`
                        relative text-white px-4 py-3 font-semibold text-lg w-full text-center transition-colors duration-150
                        after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-0.5 after:bg-white after:w-0 after:transition-all after:duration-300
                        hover:after:w-full
                        ${
                          pathname === path
                            ? "after:w-full after:bg-white after:h-0.5"
                            : ""
                        }
                      `}
                              onClick={() => {
                                setMenuOpen(false);
                                setTimeout(() => router.push(path), 300);
                              }}
                            >
                              {title}
                            </button>
                          )}
                        </NavigationMenuItem>
                      );
                    })}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
