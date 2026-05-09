"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🕌</span>
          <span className="text-xl font-bold text-green-600">
            Ilmu<span className="text-yellow-500">Kids</span>
          </span>
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
            Beranda
          </Link>
          <Link href="/games" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
            Games
          </Link>
          <Link href="/leaderboard" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
            Peringkat
          </Link>
        </div>

        {/* Tombol Login */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
            Masuk
          </Link>
          <Link href="/register" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-medium transition-colors">
            Daftar Gratis
          </Link>
        </div>

        {/* Tombol Hamburger Mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-600 text-2xl"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>

      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          <Link href="/" className="text-gray-600 hover:text-green-600 font-medium">Beranda</Link>
          <Link href="/games" className="text-gray-600 hover:text-green-600 font-medium">Games</Link>
          <Link href="/leaderboard" className="text-gray-600 hover:text-green-600 font-medium">Peringkat</Link>
          <Link href="/login" className="text-gray-600 hover:text-green-600 font-medium">Masuk</Link>
          <Link href="/register" className="bg-green-500 text-white px-4 py-2 rounded-full font-medium text-center">
            Daftar Gratis
          </Link>
        </div>
      )}
    </nav>
  );
}