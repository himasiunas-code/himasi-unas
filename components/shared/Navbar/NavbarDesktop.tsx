"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { navMenu } from "@/constants/navMenu";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navMenu";

interface NavbarDesktopProps {
  pathname: string;
  dropdownOpen: string | null;
  setDropdownOpen: (title: string | null) => void;
}

export default function NavbarDesktop({
  pathname,
  dropdownOpen,
  setDropdownOpen,
}: NavbarDesktopProps) {
  return (
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
                      type="button"
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
  );
}
