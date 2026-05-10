"use client";

import { useState } from "react";
import Link from "next/link";

type UserRole = "siswa" | "guru";

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>("siswa");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login sebagai:", role, { username, email, password });
    // Nanti kita sambungkan ke Supabase
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
          <p className="text-gray-500 text-sm mt-1">Masuk ke akunmu</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">

          {/* Toggle Siswa / Guru */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            <button
              onClick={() => setRole("siswa")}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                role === "siswa"
                  ? "bg-green-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              👦 Saya Siswa
            </button>
            <button
              onClick={() => setRole("guru")}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                role === "guru"
                  ? "bg-green-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              👨‍🏫 Saya Guru
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">

            {/* Input berbeda tergantung role */}
            {role === "siswa" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Ahmad123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 placeholder-gray-400"
                />
              </div>
            ) : (
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
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Tombol Submit */}
            <button
              onClick={handleSubmit}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-green-200 mt-2"
            >
              {role === "siswa" ? "🚀 Ayo Belajar!" : "Masuk ke Dashboard"}
            </button>

          </div>

          {/* Link Register */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Belum punya akun?{" "}
            <Link href="/register" className="text-green-600 font-semibold hover:underline">
              Daftar di sini
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}