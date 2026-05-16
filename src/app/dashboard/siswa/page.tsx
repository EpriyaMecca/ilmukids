"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type QuizCard = {
  id: string;
  judul_quiz: string;
  deskripsi: string;
  total_xp: number;
  waktu_menit: number;
  kelas_target: string;
};

type SiswaData = {
  nama_lengkap: string;
  kelas: string;
  xp: number;
  level: number;
};

export default function DashboardSiswa() {
  const router = useRouter();
  const [siswa, setSiswa] = useState<SiswaData | null>(null);
  const [daftarQuiz, setDaftarQuiz] = useState<QuizCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }

      const email = session.user.email || "";
      const username = email.replace("@ilmukids.app", "");

      const { data: siswaData } = await supabase
        .from("siswa")
        .select("nama_lengkap, kelas, xp, level")
        .eq("username", username)
        .single();

      if (siswaData) setSiswa(siswaData);

      const { data: quizData } = await supabase
        .from("quiz")
        .select("*")
        .eq("status_publish", true)
        .order("created_at", { ascending: false });

      if (quizData) setDaftarQuiz(quizData);
      setIsLoading(false);
    };
    init();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const xpPerLevel = 500;
  const xpSekarang = siswa?.xp || 0;
  const level = siswa?.level || 1;
  const xpDiLevel = xpSekarang % xpPerLevel;
  const progressPersen = Math.round((xpDiLevel / xpPerLevel) * 100);

  const getBadge = (level: number) => {
    if (level >= 10) return { icon: "👑", nama: "Master", warna: "text-yellow-600 bg-yellow-100" };
    if (level >= 7) return { icon: "💎", nama: "Expert", warna: "text-blue-600 bg-blue-100" };
    if (level >= 5) return { icon: "🏆", nama: "Advanced", warna: "text-purple-600 bg-purple-100" };
    if (level >= 3) return { icon: "⭐", nama: "Intermediate", warna: "text-green-600 bg-green-100" };
    return { icon: "🌱", nama: "Pemula", warna: "text-gray-600 bg-gray-100" };
  };

  const badge = getBadge(level);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <p className="text-gray-500 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">

      {/* Navbar Siswa */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕌</span>
            <span className="text-xl font-bold text-green-600">
              Ilmu<span className="text-yellow-500">Kids</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard/siswa" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
              🏠 Dashboard
            </Link>
            <Link href="/leaderboard" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
              🏆 Peringkat
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${badge.warna}`}>
              {badge.icon} {badge.nama}
            </span>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-medium">
              Keluar
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Hero Welcome */}
        <div className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-lg shadow-green-200">
          <div className="absolute right-[-20px] top-[-20px] w-48 h-48 bg-white/10 rounded-full"></div>
          <div className="absolute right-[60px] bottom-[-30px] w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute right-4 bottom-2 text-7xl opacity-20 select-none">🕌</div>
          <div className="absolute right-16 top-3 text-4xl opacity-15 select-none">⭐</div>
          <div className="absolute right-32 bottom-4 text-2xl opacity-15 select-none">✨</div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">👋</div>
              <p className="text-green-100 text-sm font-medium">Assalamu'alaikum!</p>
            </div>
            <h1 className="text-3xl font-bold mb-2 leading-tight">{siswa?.nama_lengkap || "Siswa"}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
                📚 {siswa?.kelas || "Kelas"}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
                ⭐ {xpSekarang} XP
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
                {badge.icon} Level {level}
              </span>
            </div>
            <p className="text-green-100 text-sm mt-3 font-medium">
              🌟 Semangat belajar hari ini, tetap istiqomah!
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">⭐</div>
            <div className="text-2xl font-bold text-yellow-500">{xpSekarang}</div>
            <div className="text-xs text-gray-500 mt-1 font-medium">Total XP</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">🎯</div>
            <div className="text-2xl font-bold text-green-600">{level}</div>
            <div className="text-xs text-gray-500 mt-1 font-medium">Level</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">📝</div>
            <div className="text-2xl font-bold text-blue-500">{daftarQuiz.length}</div>
            <div className="text-xs text-gray-500 mt-1 font-medium">Quiz Tersedia</div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link
            href="/leaderboard"
            className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-5 text-white flex items-center gap-3 hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🏆</div>
            <div>
              <p className="font-bold">Leaderboard</p>
              <p className="text-xs text-yellow-100">Lihat peringkat kamu</p>
            </div>
          </Link>
          <div className="bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl p-5 text-white flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🎖️</div>
            <div>
              <p className="font-bold">Rank #{level}</p>
              <p className="text-xs text-purple-100">{badge.icon} {badge.nama}</p>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-gray-800">Progress Level {level}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {xpDiLevel} / {xpPerLevel} XP menuju Level {level + 1}
              </p>
            </div>
            <span className={`text-sm px-3 py-1.5 rounded-full font-semibold ${badge.warna}`}>
              {badge.icon} {badge.nama}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-green-400 to-green-500 h-4 rounded-full transition-all duration-700 relative"
              style={{ width: `${progressPersen}%` }}
            >
              {progressPersen > 10 && (
                <span className="absolute right-2 top-0 text-xs text-white font-bold leading-4">
                  {progressPersen}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Badge Collection */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <h3 className="font-bold text-gray-800 mb-4">Koleksi Badge 🏅</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[
              { icon: "🌱", nama: "Pemula", unlock: level >= 1 },
              { icon: "📖", nama: "Rajin", unlock: level >= 2 },
              { icon: "⭐", nama: "Bintang", unlock: level >= 3 },
              { icon: "🔥", nama: "Semangat", unlock: level >= 4 },
              { icon: "🏆", nama: "Juara", unlock: level >= 5 },
              { icon: "👑", nama: "Master", unlock: level >= 10 },
            ].map((b, i) => (
              <div
                key={i}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                  b.unlock
                    ? "bg-yellow-50 border border-yellow-200 shadow-sm"
                    : "bg-gray-50 border border-gray-100 opacity-40 grayscale"
                }`}
              >
                <span className="text-2xl">{b.icon}</span>
                <span className="text-xs font-medium text-gray-600">{b.nama}</span>
                {b.unlock && <span className="text-xs text-green-500">✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Daftar Quiz */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quiz Tersedia 🎮</h3>
          {daftarQuiz.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
              <div className="text-5xl mb-3">📭</div>
              <p className="font-medium">Belum ada quiz tersedia</p>
              <p className="text-sm mt-1">Guru belum publish quiz apapun</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {daftarQuiz.map((quiz) => (
                <Link
                  key={quiz.id}
                  href={`/quiz/${quiz.id}`}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      📝
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">
                      +{quiz.total_xp} XP
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1 group-hover:text-green-600 transition-colors">
                    {quiz.judul_quiz}
                  </h4>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {quiz.deskripsi || "Uji kemampuanmu!"}
                  </p>
                  <div className="flex gap-3 text-xs text-gray-400 mb-4">
                    <span>⏱️ {quiz.waktu_menit} menit</span>
                    <span>🎯 {quiz.kelas_target}</span>
                  </div>
                  <div className="w-full bg-green-500 text-white py-2.5 rounded-xl font-semibold text-sm text-center group-hover:bg-green-600 transition-colors">
                    Mulai Quiz →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}