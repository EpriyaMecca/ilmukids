"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Quiz = {
  id: string;
  judul_quiz: string;
  deskripsi: string;
  total_xp: number;
  waktu_menit: number;
  kelas_target: string;
};

export default function GamesPage() {
  const [daftarQuiz, setDaftarQuiz] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      const { data } = await supabase
        .from("quiz")
        .select("*")
        .eq("status_publish", true)
        .order("created_at", { ascending: false });

      if (data) setDaftarQuiz(data);
      setIsLoading(false);
    };
    loadQuiz();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎮</div>
          <p className="text-gray-500">Memuat games...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-16 min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Games & Quiz Islami
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Pilih quiz favoritmu dan kumpulkan XP sebanyak-banyaknya!
          </p>
        </div>

        {/* Mini Games Section */}
<div className="mb-12">
  <h2 className="text-2xl font-bold text-gray-800 mb-6">🧠 Mini Games</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <Link
      href="/games/memory-card"
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-green-200 transition-all group hover:-translate-y-1"
    >
      <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
        🧠
      </div>
      <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-green-600 transition-colors">
        Memory Card Islami
      </h3>
      <p className="text-gray-500 text-sm mb-4">
        Cocokkan dzikir dengan artinya! Latih memori dan hafalan kamu.
      </p>
      <div className="flex gap-2 mb-4">
        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">🧠 Memory</span>
        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">6 Pasang</span>
      </div>
      <div className="w-full bg-purple-500 group-hover:bg-purple-600 text-white py-3 rounded-xl font-semibold text-sm text-center transition-colors">
        Main Sekarang →
      </div>
    </Link>
  </div>
</div>

<h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Quiz Islami</h2>

        {/* Quiz Grid */}
        {daftarQuiz.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📭</div>
            <p className="font-medium text-lg">Belum ada quiz tersedia</p>
            <p className="text-sm mt-2">Guru sedang menyiapkan soal-soal seru!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {daftarQuiz.map((quiz) => (
              <Link
                key={quiz.id}
                href={`/quiz/${quiz.id}`}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-green-200 transition-all group hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    📝
                  </div>
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-bold">
                    +{quiz.total_xp} XP
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-green-600 transition-colors">
                  {quiz.judul_quiz}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {quiz.deskripsi || "Uji kemampuan Islammu!"}
                </p>
                <div className="flex gap-3 text-xs text-gray-400 mb-4">
                  <span>⏱️ {quiz.waktu_menit} menit</span>
                  <span>🎯 {quiz.kelas_target}</span>
                </div>
                <div className="w-full bg-green-500 group-hover:bg-green-600 text-white py-3 rounded-xl font-semibold text-sm text-center transition-colors">
                  Mulai Quiz →
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA Login */}
        <div className="mt-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Mau Simpan Progress Belajar? 📊</h3>
          <p className="text-green-100 mb-6">Login untuk kumpulkan XP, naik level, dan masuk leaderboard!</p>
          <div className="flex gap-4 justify-center">
            <Link href="/login" className="bg-white text-green-600 font-bold px-6 py-3 rounded-full hover:scale-105 transition-all">
              Masuk Sekarang
            </Link>
            <Link href="/register" className="bg-white/20 text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-all border border-white/30">
              Daftar Gratis
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}