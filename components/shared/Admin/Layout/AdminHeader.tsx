"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, LogOut, Menu } from "lucide-react";
import type { AdminNavItem } from "./types";

interface AdminHeaderProps {
  navigation: AdminNavItem[];
  isAuthenticated: boolean;
  isLoading: boolean;
  profileDropdownOpen: boolean;
  setProfileDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenMobileMenu: () => void;
  onLogout: () => void;
}

export default function AdminHeader({
  navigation,
  isAuthenticated,
  isLoading,
  profileDropdownOpen,
  setProfileDropdownOpen,
  onOpenMobileMenu,
  onLogout,
}: AdminHeaderProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo & Brand */}
          <div className="flex items-center">
            <div className="shrink-0 flex items-center">
              <Image
                src="/icon/HIMASI.png"
                alt="HIMASI Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <Image
                src="/icon/FTKI.png"
                alt="FTKI Logo"
                width={32}
                height={32}
                className="h-8 w-16 ml-2"
              />
              <div className="ml-3">
                <h1 className="text-xl font-bold text-[#4B061A]">Admin HIMASI</h1>
                <p className="text-xs text-gray-500">Management Panel</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:ml-8 lg:flex lg:space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      item.current
                        ? "bg-[#4B061A] text-white shadow-lg"
                        : "text-gray-700 hover:text-[#4B061A] hover:bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`mr-2 h-4 w-4 ${
                        item.current
                          ? "text-white"
                          : "text-gray-500 group-hover:text-[#4B061A]"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side - Profile & Actions */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {/* Back to Website */}
            <Link
              href="/"
              className="text-gray-500 hover:text-[#4B061A] px-3 py-2 text-sm font-medium transition-colors"
            >
              Kembali ke Website
            </Link>

            {/* Profile Dropdown - Only show if authenticated */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  disabled={isLoading}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B061A] p-2 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                  aria-label="Toggle profile menu"
                >
                  <div className="h-8 w-8 rounded-full bg-[#4B061A] flex items-center justify-center">
                    <span className="text-white text-sm font-medium">A</span>
                  </div>
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p className="font-medium">Administrator</p>
                        <p className="text-gray-500">admin@himasi.com</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Login: {new Date().toLocaleTimeString("id-ID")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={onLogout}
                        disabled={isLoading}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                        ) : (
                          <LogOut className="mr-2 h-4 w-4" />
                        )}
                        {isLoading ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              aria-label="Open mobile menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
