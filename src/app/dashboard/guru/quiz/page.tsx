"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

type Quiz = {
  id: string;
  judul_quiz: string;
  deskripsi: string;
  total_xp: number;
  waktu_menit: number;
  status_publish: boolean;
  kelas_target: string;
  created_at: string;
};

export default function HalamanQuiz() {
  const router = useRouter();
  const [namaGuru, setNamaGuru] = useState("");
  const [daftarQuiz, setDaftarQuiz] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      setNamaGuru(session.user.user_metadata?.full_name || "Guru");

      const { data } = await supabase
        .from("quiz")
        .select("*")
        .eq("guru_id", session.user.id)
        .order("created_at", { ascending: false });

      if (data) setDaftarQuiz(data);
      setIsLoading(false);
    };
    init();
  }, [router]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">⏳ Memuat...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar namaGuru={namaGuru} />

      <main className="ml-64 flex-1 p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quiz Islami 📝</h1>
            <p className="text-gray-500 mt-1">{daftarQuiz.length} quiz dibuat</p>
          </div>
          <Link
            href="/dashboard/guru/quiz/buat"
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
          >
            ➕ Buat Quiz Baru
          </Link>
        </div>

        {/* Daftar Quiz */}
        {daftarQuiz.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">📝</div>
              <p className="font-medium">Belum ada quiz</p>
              <p className="text-sm mt-1">Klik "Buat Quiz Baru" untuk mulai</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {daftarQuiz.map((quiz) => (
              <div key={quiz.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-800 text-lg">{quiz.judul_quiz}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    quiz.status_publish
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {quiz.status_publish ? "✅ Published" : "Draft"}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-4">{quiz.deskripsi || "Tidak ada deskripsi"}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>⏱️ {quiz.waktu_menit} menit</span>
                  <span>⭐ {quiz.total_xp} XP</span>
                  <span>🎯 {quiz.kelas_target || "Semua kelas"}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}