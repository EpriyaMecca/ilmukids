"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pesan, setPesan] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setPesan("Email wajib diisi!"); return; }
    
    setIsLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setPesan("Gagal kirim email. Pastikan email terdaftar!");
    } else {
      setIsSuccess(true);
      setPesan("✅ Email reset password sudah dikirim! Cek inbox kamu.");
    }
    
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <span className="text-5xl">🔐</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">
            Lupa Password?
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Tenang, kami bantu reset passwordmu
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">

          {pesan && (
            <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${
              isSuccess
                ? "bg-green-50 text-green-600 border border-green-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}>
              {pesan}
            </div>
          )}

          {!isSuccess ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Guru
                </label>
                <input
                  type="email"
                  placeholder="guru@sekolah.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                />
              </div>

              <button
                onClick={handleReset}
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-3 rounded-xl font-semibold text-lg transition-all hover:scale-105"
              >
                {isLoading ? "⏳ Mengirim..." : "📧 Kirim Link Reset"}
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">📬</div>
              <p className="text-gray-600 mb-6">
                Cek email kamu dan klik link yang kami kirimkan untuk reset password.
              </p>
            </div>
          )}

          <p className="text-center text-gray-500 text-sm mt-6">
            Ingat passwordnya?{" "}
            <Link href="/login" className="text-green-600 font-semibold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}