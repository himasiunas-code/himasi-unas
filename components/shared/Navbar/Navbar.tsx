"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { navMenu } from "@/constants/navMenu";
import { usePathname, useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navMenu";
import HIMASI from "@/public/icon/HIMASI.png";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    // Fixed overlay header that visually "floats" centered with rounded-full container
    <header className="fixed z-[60] inset-x-0 top-6 pointer-events-none">
      <div className="mx-auto max-w-[1440px] w-full px-4 pointer-events-auto">
        <div className="h-[80px] w-full rounded-full bg-[rgba(107,20,48,0.85)] border border-[rgba(255,255,255,0.06)] backdrop-blur-sm shadow-xl flex items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex flex-row items-center space-x-2 md:space-x-0">
        <Image
          src={HIMASI}
          alt="Logo HIMASI UNAS"
          width={140}
          height={70}
          className="h-[50px] w-[50px] object-contain md:h-[60px] md:w-[100px]"
        />
        <div 
          className="text-white font-bold text-lg md:text-2xl tracking-wider"
          style={{
          transform: 'skewX(10deg)',
          textShadow: '4px 4px 8px rgba(0,0,0,0.3)'
          }}
        >
          <div className="flex flex-col">
          <span className="bg-gradient-to-r from-[#FFF0E6] via-[#F5D6CC] to-[#B05B7A] bg-clip-text text-transparent">
            HIMASI
          </span>
          <span className="bg-gradient-to-r from-[#FFF0E6] via-[#F5D6CC] to-[#B05B7A] bg-clip-text text-transparent">
            UNAS
          </span>
          </div>
        </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex mr-8">
        <NavigationMenu>
          <NavigationMenuList className="flex flex-row gap-8">
          {navMenu.map(({ title, path }) => {
            return (
            <NavigationMenuItem
              key={title}
              className="relative flex items-center"
            >
              <Link href={path} legacyBehavior passHref>
              <NavigationMenuLink
                className={`
                relative px-2 py-1 text-white transition-colors duration-150
                after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-0.5 after:bg-white after:w-0 after:transition-all after:duration-300
                hover:after:w-full
                ${pathname === path ? "after:w-full after:bg-white after:h-0.5" : ""}
                font-bold
                `}
              >
                {title}
              </NavigationMenuLink>
              </Link>
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
          className="lg:hidden bg-[rgba(107,20,48,0.95)] px-4 pb-6 flex justify-center absolute left-0 right-0 top-[calc(6px+80px)]"
        >
          <div className="max-w-md w-full mx-auto flex flex-col items-center">
          <NavigationMenu>
            <NavigationMenuList className="flex flex-col gap-4 items-center w-full">
            {navMenu.map(({ title, path }) => (
              <NavigationMenuItem
              key={title}
              className="w-full flex flex-col items-center"
              >
              <button
                className={`text-white px-2 py-1 font-semibold transition-all duration-150 w-full text-center ${
                pathname === path
                  ? "border-b-2 border-white"
                  : "opacity-80 hover:opacity-100"
                }`}
                onClick={() => {
                setMenuOpen(false);
                setTimeout(() => router.push(path), 300);
                }}
              >
                {title}
              </button>
              </NavigationMenuItem>
            ))}
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