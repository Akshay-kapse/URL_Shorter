"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HIDDEN_ROUTES_PREFIX = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-code",
  "/admin"
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Hide Navbar on auth pages
  if (HIDDEN_ROUTES_PREFIX.some((p) => pathname.startsWith(p))) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <span className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                UrlShorter
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              href="/shorten"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
            >
              Shorten
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              href="/admin"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Admin
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-3">
            <Link href="/shorten" className="hidden sm:block">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300">
                Try Now
              </button>
            </Link>
            <Link href="/signup" className="hidden sm:block">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2 border border-gray-300 hover:border-gray-400 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300">
                Logout
              </button>
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 p-2 rounded-md font-bold text-2xl"
              >
                {isOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col mt-3 space-y-2 px-3 pb-4 bg-white rounded-lg shadow-md border border-gray-200">
            <Link
              href="/"
              className="block text-gray-700 hover:text-blue-600 font-medium text-center  py-2 rounded-md transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/shorten"
              className="block text-gray-700 hover:text-blue-600 font-medium text-center py-2 rounded-md transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Shorten
            </Link>
            <Link
              href="/admin"
              className="block text-gray-700 hover:text-blue-600 font-medium text-center py-2 rounded-md transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
            <Link
              href="/signup"
              className="block text-red-600 hover:text-blue-600 font-medium text-center  py-2 rounded-md border border-red-600 hover:border-blue-600 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Logout
            </Link>
            <Link
              href="/shorten"
              className="block mt-2"
              onClick={() => setIsOpen(false)}
            >
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300">
                Try Now
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
