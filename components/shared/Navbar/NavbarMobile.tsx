"use client";

import React from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { navMenu } from "@/constants/navMenu";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navMenu";
import { AnimatePresence, motion } from "framer-motion";

interface NavbarMobileProps {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dropdownOpen: string | null;
  setDropdownOpen: React.Dispatch<React.SetStateAction<string | null>>;
  pathname: string;
  onNavigate: (path: string) => void;
}

export default function NavbarMobile({
  menuOpen,
  setMenuOpen,
  dropdownOpen,
  setDropdownOpen,
  pathname,
  onNavigate,
}: NavbarMobileProps) {
  return (
    <>
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

      {/* Mobile Menu Dropdown Panel */}
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
                              type="button"
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
                                      type="button"
                                      className="text-white px-4 py-2 font-medium hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors duration-150 w-[80%]"
                                      onClick={() => {
                                        setMenuOpen(false);
                                        setDropdownOpen(null);
                                        onNavigate(item.path);
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
                            type="button"
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
                              onNavigate(path);
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
    </>
  );
}
