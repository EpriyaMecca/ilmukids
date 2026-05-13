"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [namaGuru, setNamaGuru] = useState("");
useEffect(() => {

  // Ambil session awal
  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      setIsLogin(true);

      const nama =
        session.user.user_metadata?.full_name || "Guru";

      setNamaGuru(nama);
    } else {
      setIsLogin(false);
      setNamaGuru("");
    }
  };

  getSession();

  // Listen realtime auth change
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(
    (_event, session) => {

      if (session) {
        setIsLogin(true);

        const nama =
          session.user.user_metadata?.full_name || "Guru";

        setNamaGuru(nama);
      } else {
        setIsLogin(false);
        setNamaGuru("");
      }
    }
  );

  // Cleanup
  return () => {
    subscription.unsubscribe();
  };

}, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setIsLogin(false);

    router.push("/login");
  };

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
          <Link
            href="/"
            className="text-gray-600 hover:text-green-600 font-medium transition-colors"
          >
            Beranda
          </Link>

          <Link
            href="/games"
            className="text-gray-600 hover:text-green-600 font-medium transition-colors"
          >
            Games
          </Link>

          <Link
            href="/leaderboard"
            className="text-gray-600 hover:text-green-600 font-medium transition-colors"
          >
            Peringkat
          </Link>
        </div>

        {/* Conditional Auth */}
        <div className="hidden md:flex items-center gap-3">

          {isLogin ? (
            <>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {namaGuru}
                </p>

                <p className="text-xs text-gray-500">
                  Guru
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-green-600 font-medium transition-colors"
              >
                Masuk
              </Link>

              <Link
                href="/register"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-medium transition-colors"
              >
                Daftar Gratis
              </Link>
            </>
          )}

        </div>

        {/* Hamburger Mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-600 text-2xl"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">

          <Link
            href="/"
            className="text-gray-600 hover:text-green-600 font-medium"
          >
            Beranda
          </Link>

          <Link
            href="/games"
            className="text-gray-600 hover:text-green-600 font-medium"
          >
            Games
          </Link>

          <Link
            href="/leaderboard"
            className="text-gray-600 hover:text-green-600 font-medium"
          >
            Peringkat
          </Link>

          {isLogin ? (
            <>
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-800">
                  {namaGuru}
                </p>

                <p className="text-sm text-gray-500 mb-3">
                  Guru
                </p>

                <button
                  onClick={handleLogout}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-green-600 font-medium"
              >
                Masuk
              </Link>

              <Link
                href="/register"
                className="bg-green-500 text-white px-4 py-2 rounded-full font-medium text-center"
              >
                Daftar Gratis
              </Link>
            </>
          )}

        </div>
      )}
    </nav>
  );
}