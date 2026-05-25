"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

type HasilQuiz = {
  id: string;
  skor: number;
  xp_didapat: number;
  jumlah_benar: number;
  jumlah_salah: number;
  selesai_pada: string;
  siswa: { nama_lengkap: string; kelas: string; };
  quiz: { judul_quiz: string; };
};

export default function HalamanNilai() {
  const router = useRouter();
  const [namaGuru, setNamaGuru] = useState("");
  const [hasilList, setHasilList] = useState<HasilQuiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterKelas, setFilterKelas] = useState("semua");

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }

      setNamaGuru(session.user.user_metadata?.full_name || "Guru");

      const { data } = await supabase
        .from("hasil_quiz")
        .select(`
          id, skor, xp_didapat, jumlah_benar, jumlah_salah, selesai_pada,
          siswa (nama_lengkap, kelas),
          quiz (judul_quiz)
        `)
        .order("selesai_pada", { ascending: false });

      if (data) setHasilList(data as any);
      setIsLoading(false);
    };
    init();
  }, [router]);

  const filtered = filterKelas === "semua"
    ? hasilList
    : hasilList.filter(h => h.siswa?.kelas === filterKelas);

  const rataRata = filtered.length > 0
    ? Math.round(filtered.reduce((a, b) => a + b.skor, 0) / filtered.length)
    : 0;

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">⏳ Memuat...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar namaGuru={namaGuru} />
      <main className="ml-64 flex-1 p-8">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Nilai & Progress Siswa 📊</h1>
          <p className="text-gray-500 mt-1">{hasilList.length} hasil quiz tercatat</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-2xl font-bold text-blue-600">{filtered.length}</div>
            <div className="text-xs text-gray-500 mt-1">Total Quiz Dikerjakan</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-2xl font-bold text-green-600">{rataRata}%</div>
            <div className="text-xs text-gray-500 mt-1">Rata-rata Skor</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-yellow-500">
              {filtered.reduce((a, b) => a + b.xp_didapat, 0)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Total XP Diberikan</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {["semua", "Kelas 4", "Kelas 5", "Kelas 6"].map((k) => (
            <button
              key={k}
              onClick={() => setFilterKelas(k)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filterKelas === k
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"
              }`}
            >
              {k === "semua" ? "Semua Kelas" : k}
            </button>
          ))}
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">📊</div>
              <p className="font-medium">Belum ada data nilai</p>
              <p className="text-sm mt-1">Siswa belum mengerjakan quiz apapun</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Siswa</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Quiz</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Skor</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Benar/Salah</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">XP</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((hasil, i) => (
                  <tr key={hasil.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{hasil.siswa?.nama_lengkap}</div>
                      <div className="text-xs text-gray-500">{hasil.siswa?.kelas}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{hasil.quiz?.judul_quiz}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${hasil.skor >= 80 ? "text-green-600" : hasil.skor >= 60 ? "text-yellow-600" : "text-red-500"}`}>
                        {hasil.skor}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="text-green-600 font-medium">✓ {hasil.jumlah_benar}</span>
                      <span className="text-gray-400 mx-1">/</span>
                      <span className="text-red-500 font-medium">✗ {hasil.jumlah_salah}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg text-sm font-medium">
                        +{hasil.xp_didapat} XP
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </main>
    </div>
  );
}