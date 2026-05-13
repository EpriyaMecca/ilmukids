"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

export default function DashboardGuru() {
  const router = useRouter();
  const [namaGuru, setNamaGuru] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cekSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      const nama = session.user.user_metadata?.full_name || "Guru";
      setNamaGuru(nama);
      setIsLoading(false);
    };
    cekSession();
  }, [router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-gray-500">Memuat dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <DashboardSidebar namaGuru={namaGuru} />

      {/* Konten utama */}
      <main className="ml-64 flex-1 p-8">

        {/* Sapaan */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Assalamu'alaikum, {namaGuru}! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Selamat datang di panel guru IlmuKids.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="text-3xl mb-3">👨‍🎓</div>
            <div className="text-2xl font-bold text-gray-800">0</div>
            <div className="text-gray-500 text-sm mt-1">Total Siswa</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="text-3xl mb-3">📚</div>
            <div className="text-2xl font-bold text-gray-800">0</div>
            <div className="text-gray-500 text-sm mt-1">Kelas Aktif</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="text-3xl mb-3">🎯</div>
            <div className="text-2xl font-bold text-gray-800">0</div>
            <div className="text-gray-500 text-sm mt-1">Quiz Dibuat</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Menu Cepat ⚡</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors">
              <span className="text-3xl">➕</span>
              <span className="text-sm font-medium text-green-700">Tambah Siswa</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
              <span className="text-3xl">🏫</span>
              <span className="text-sm font-medium text-blue-700">Buat Kelas</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-colors">
              <span className="text-3xl">📝</span>
              <span className="text-sm font-medium text-yellow-700">Buat Quiz</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors">
              <span className="text-3xl">📊</span>
              <span className="text-sm font-medium text-purple-700">Lihat Nilai</span>
            </button>
          </div>
        </div>

        {/* Daftar Siswa */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Daftar Siswa 👦</h3>
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mb-3">📋</div>
            <p className="font-medium">Belum ada siswa</p>
            <p className="text-sm mt-1">Klik "Tambah Siswa" untuk mulai</p>
          </div>
        </div>

      </main>
    </div>
  );
}