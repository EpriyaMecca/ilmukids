"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Nanti disambungkan ke Supabase
    console.log("Register:", { name, email, password });
    setTimeout(() => setIsLoading(false), 2000); // simulasi loading
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-5xl">🕌</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">
            Ilmu<span className="text-yellow-500">Kids</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Daftar sebagai Guru</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">

          {/* Header card */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">Buat Akun Guru 👨‍🏫</h2>
            <p className="text-gray-500 text-sm mt-1">
              Gratis selamanya. Mulai dalam 1 menit.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">

            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Contoh: Bu Siti Aminah"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="guru@sekolah.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Tombol Submit */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-3 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-green-200 mt-2"
            >
              {isLoading ? "⏳ Mendaftar..." : "🎉 Daftar Gratis"}
            </button>

          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-sm">atau</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Link ke Login */}
          <p className="text-center text-gray-500 text-sm">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-green-600 font-semibold hover:underline">
              Masuk di sini
            </Link>
          </p>

        </div>

        {/* Trust badge */}
        <p className="text-center text-gray-400 text-xs mt-4">
          🔒 Data kamu aman. Tidak ada spam.
        </p>

      </div>
    </main>
  );
}