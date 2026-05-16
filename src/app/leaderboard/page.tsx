"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type SiswaRanking = {
  id: string;
  nama_lengkap: string;
  kelas: string;
  xp: number;
  level: number;
};

type TabType = "global" | "kelas";

export default function LeaderboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("global");
  const [globalRanking, setGlobalRanking] = useState<SiswaRanking[]>([]);
  const [kelasRanking, setKelasRanking] = useState<SiswaRanking[]>([]);
  const [kelasSiswa, setKelasSiswa] = useState("");
  const [namaSiswa, setNamaSiswa] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userRank, setUserRank] = useState(0);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      // Ambil semua siswa untuk global ranking
      const { data: globalData } = await supabase
        .from("siswa")
        .select("id, nama_lengkap, kelas, xp, level")
        .order("xp", { ascending: false })
        .limit(50);

      if (globalData) setGlobalRanking(globalData);

      // Kalau login sebagai siswa
      if (session) {
        const email = session.user.email || "";
        if (email.includes("@ilmukids.app")) {
          const username = email.replace("@ilmukids.app", "");

          const { data: siswaData } = await supabase
            .from("siswa")
            .select("nama_lengkap, kelas, xp")
            .eq("username", username)
            .single();

          if (siswaData) {
            setKelasSiswa(siswaData.kelas);
            setNamaSiswa(siswaData.nama_lengkap);

            // Ranking per kelas
            const { data: kelasData } = await supabase
              .from("siswa")
              .select("id, nama_lengkap, kelas, xp, level")
              .eq("kelas", siswaData.kelas)
              .order("xp", { ascending: false })
              .limit(20);

            if (kelasData) setKelasRanking(kelasData);

            // Hitung rank global user ini
            const rank = (globalData || []).findIndex(
              s => s.nama_lengkap === siswaData.nama_lengkap
            ) + 1;
            setUserRank(rank);
          }
        }
      }

      setIsLoading(false);
    };
    init();
  }, [router]);

  const getMedal = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}`;
  };

  const getBadgeLevel = (level: number) => {
    if (level >= 10) return { icon: "👑", warna: "text-yellow-600 bg-yellow-100" };
    if (level >= 7) return { icon: "💎", warna: "text-blue-600 bg-blue-100" };
    if (level >= 5) return { icon: "🏆", warna: "text-purple-600 bg-purple-100" };
    if (level >= 3) return { icon: "⭐", warna: "text-green-600 bg-green-100" };
    return { icon: "🌱", warna: "text-gray-600 bg-gray-100" };
  };

  const displayList = activeTab === "global" ? globalRanking : kelasRanking;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🏆</div>
          <p className="text-gray-500">Memuat leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
         <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700"> ← Kembali</button>
          <h1 className="font-bold text-gray-800">🏆 Leaderboard</h1>
          <div className="w-16"></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Hero */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-6 mb-6 text-white text-center relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 opacity-10 text-8xl flex items-center justify-center select-none">
            🏆
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-1">Papan Peringkat</h2>
            <p className="text-yellow-100 text-sm">Siapa jagoan IlmuKids hari ini?</p>
            {userRank > 0 && (
              <div className="mt-3 inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                Kamu di posisi #{userRank} global 🎯
              </div>
            )}
          </div>
        </div>

        {/* Tab Switch */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
          <button
            onClick={() => setActiveTab("global")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "global"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            🌍 Global
          </button>
          <button
            onClick={() => setActiveTab("kelas")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "kelas"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            🏫 {kelasSiswa || "Kelas Saya"}
          </button>
        </div>

        {/* Top 3 Podium */}
        {displayList.length >= 3 && (
          <div className="flex items-end justify-center gap-3 mb-6">
            {/* 2nd place */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-2xl mb-2 border-4 border-gray-300">
                🥈
              </div>
              <div className="bg-gray-200 rounded-t-xl px-3 py-2 text-center w-24 h-16 flex flex-col justify-center">
                <p className="text-xs font-bold text-gray-700 truncate">{displayList[1]?.nama_lengkap.split(" ")[0]}</p>
                <p className="text-xs text-gray-500">{displayList[1]?.xp} XP</p>
              </div>
            </div>

            {/* 1st place */}
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-1">👑</div>
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-3xl mb-2 border-4 border-yellow-400">
                🥇
              </div>
              <div className="bg-yellow-400 rounded-t-xl px-3 py-2 text-center w-28 h-20 flex flex-col justify-center">
                <p className="text-xs font-bold text-yellow-900 truncate">{displayList[0]?.nama_lengkap.split(" ")[0]}</p>
                <p className="text-xs text-yellow-800">{displayList[0]?.xp} XP</p>
              </div>
            </div>

            {/* 3rd place */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-2xl mb-2 border-4 border-orange-300">
                🥉
              </div>
              <div className="bg-orange-200 rounded-t-xl px-3 py-2 text-center w-24 h-14 flex flex-col justify-center">
                <p className="text-xs font-bold text-orange-800 truncate">{displayList[2]?.nama_lengkap.split(" ")[0]}</p>
                <p className="text-xs text-orange-700">{displayList[2]?.xp} XP</p>
              </div>
            </div>
          </div>
        )}

        {/* Ranking List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {displayList.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-5xl mb-3">📭</div>
              <p className="font-medium">Belum ada data</p>
              <p className="text-sm mt-1">
                {activeTab === "kelas"
                  ? "Login sebagai siswa untuk lihat ranking kelas"
                  : "Belum ada siswa yang main quiz"}
              </p>
            </div>
          ) : (
            <div>
              {displayList.map((siswa, index) => {
                const badge = getBadgeLevel(siswa.level);
                const isCurrentUser = siswa.nama_lengkap === namaSiswa;

                return (
                  <div
                    key={siswa.id}
                    className={`flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0 transition-colors ${
                      isCurrentUser ? "bg-green-50 border-l-4 border-l-green-500" : "hover:bg-gray-50"
                    }`}
                  >
                    {/* Rank */}
                    <div className={`w-8 text-center font-bold text-lg ${
                      index === 0 ? "text-yellow-500" :
                      index === 1 ? "text-gray-400" :
                      index === 2 ? "text-orange-400" : "text-gray-400 text-sm"
                    }`}>
                      {getMedal(index)}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                      {index === 0 ? "👑" : "👦"}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold truncate ${isCurrentUser ? "text-green-700" : "text-gray-800"}`}>
                          {siswa.nama_lengkap}
                          {isCurrentUser && <span className="text-xs ml-1">(Kamu)</span>}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">{siswa.kelas}</p>
                    </div>

                    {/* Badge + XP */}
                    <div className="text-right flex-shrink-0">
                      <div className={`text-xs px-2 py-0.5 rounded-full font-medium mb-1 ${badge.warna}`}>
                        {badge.icon} Lv.{siswa.level}
                      </div>
                      <p className="text-sm font-bold text-green-600">{siswa.xp} XP</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}