"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

type Kelas = {
  id: string;
  nama_kelas: string;
  tingkat: string;
  created_at: string;
};

export default function HalamanKelas() {
  const router = useRouter();
  const [namaGuru, setNamaGuru] = useState("");
  const [guruId, setGuruId] = useState("");
  const [daftarKelas, setDaftarKelas] = useState<Kelas[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [namaKelas, setNamaKelas] = useState("");
  const [tingkat, setTingkat] = useState("4");
  const [isSaving, setIsSaving] = useState(false);
  const [pesan, setPesan] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }

      setNamaGuru(session.user.user_metadata?.full_name || "Guru");
      setGuruId(session.user.id);

      const { data } = await supabase
        .from("kelas")
        .select("*")
        .eq("guru_id", session.user.id)
        .order("created_at", { ascending: false });

      if (data) setDaftarKelas(data);
      setIsLoading(false);
    };
    init();
  }, [router]);

  const handleTambahKelas = async () => {
    if (!namaKelas.trim()) {
      setPesan("Nama kelas wajib diisi!");
      return;
    }

    setIsSaving(true);
    const { error } = await supabase.from("kelas").insert({
      nama_kelas: namaKelas,
      tingkat: `Kelas ${tingkat}`,
      guru_id: guruId,
    });

    if (error) {
      setPesan("Gagal tambah kelas!");
    } else {
      setPesan("✅ Kelas berhasil ditambahkan!");
      setNamaKelas("");
      setShowForm(false);

      const { data } = await supabase
        .from("kelas")
        .select("*")
        .eq("guru_id", guruId)
        .order("created_at", { ascending: false });
      if (data) setDaftarKelas(data);
    }
    setIsSaving(false);
  };

  const handleHapusKelas = async (id: string) => {
    await supabase.from("kelas").delete().eq("id", id);
    setDaftarKelas(prev => prev.filter(k => k.id !== id));
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">⏳ Memuat...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar namaGuru={namaGuru} />
      <main className="ml-64 flex-1 p-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Kelas 🏫</h1>
            <p className="text-gray-500 mt-1">{daftarKelas.length} kelas dibuat</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setPesan(""); }}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
          >
            {showForm ? "✕ Batal" : "➕ Tambah Kelas"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
            <h3 className="font-bold text-gray-800 mb-4">Tambah Kelas Baru</h3>
            {pesan && (
              <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${
                pesan.startsWith("✅") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              }`}>{pesan}</div>
            )}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kelas</label>
                <input
                  type="text"
                  placeholder="Contoh: Kelas 5A"
                  value={namaKelas}
                  onChange={(e) => setNamaKelas(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat</label>
                <select
                  value={tingkat}
                  onChange={(e) => setTingkat(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="4">Kelas 4</option>
                  <option value="5">Kelas 5</option>
                  <option value="6">Kelas 6</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleTambahKelas}
              disabled={isSaving}
              className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-6 py-2.5 rounded-xl font-medium"
            >
              {isSaving ? "⏳ Menyimpan..." : "Simpan Kelas"}
            </button>
          </div>
        )}

        {daftarKelas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center text-gray-400">
            <div className="text-5xl mb-3">🏫</div>
            <p className="font-medium">Belum ada kelas</p>
            <p className="text-sm mt-1">Klik "Tambah Kelas" untuk mulai</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {daftarKelas.map((kelas) => (
              <div key={kelas.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">🏫</div>
                  <button
                    onClick={() => handleHapusKelas(kelas.id)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    🗑️
                  </button>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">{kelas.nama_kelas}</h3>
                <p className="text-gray-500 text-sm">{kelas.tingkat}</p>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}