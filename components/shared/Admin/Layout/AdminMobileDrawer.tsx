"use client";

import React from "react";
import Link from "next/link";
import { LogOut, X } from "lucide-react";
import type { AdminNavItem } from "./types";

interface AdminMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: AdminNavItem[];
  isAuthenticated: boolean;
  isLoading: boolean;
  onLogout: () => void;
}

export default function AdminMobileDrawer({
  isOpen,
  onClose,
  navigation,
  isAuthenticated,
  isLoading,
  onLogout,
}: AdminMobileDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-75"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 w-full max-w-sm h-full bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Menu Admin</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  item.current
                    ? "bg-[#4B061A] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    item.current ? "text-white" : "text-gray-500"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}

          <div className="border-t pt-4 mt-4">
            <Link
              href="/"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={onClose}
            >
              Kembali ke Website
            </Link>
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                disabled={isLoading}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600 mr-3"></div>
                ) : (
                  <LogOut className="mr-3 h-5 w-5" />
                )}
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
