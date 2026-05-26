"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

type KartuSoal = {
  id: string;
  soal: string;
  jawaban: string;
  kategori: string;
};

export default function MemoryCardAdmin() {
  const router = useRouter();
  const [namaGuru, setNamaGuru] = useState("");
  const [guruId, setGuruId] = useState("");
  const [daftarKartu, setDaftarKartu] = useState<KartuSoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [soal, setSoal] = useState("");
  const [jawaban, setJawaban] = useState("");
  const [kategori, setKategori] = useState("dzikir");
  const [isSaving, setIsSaving] = useState(false);
  const [pesan, setPesan] = useState("");
  const [filterKategori, setFilterKategori] = useState("semua");
  const kategoriList = ["semua", "dzikir", "asmaul-husna", "kisah-nabi", "rukun-islam", "akhlak", "khulafaur-rasyidin"];
  const filteredKartu = filterKategori === "semua" 
  ? daftarKartu 
  : daftarKartu.filter(k => k.kategori === filterKategori);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      setNamaGuru(session.user.user_metadata?.full_name || "Guru");
      setGuruId(session.user.id);
      await ambilKartu(session.user.id);
      setIsLoading(false);
    };
    init();
  }, [router]);

  const ambilKartu = async (id: string) => {
    const { data } = await supabase
      .from("memory_card_soal")
      .select("*")
      .eq("guru_id", id)
      .order("created_at", { ascending: false });
    if (data) setDaftarKartu(data);
  };

  const handleTambah = async () => {
    if (!soal.trim() || !jawaban.trim()) {
      setPesan("Soal dan jawaban wajib diisi!");
      return;
    }
    setIsSaving(true);
    const { error } = await supabase.from("memory_card_soal").insert({
      soal, jawaban, kategori, guru_id: guruId
    });
    if (error) {
      setPesan("Gagal menyimpan!");
    } else {
      setPesan("✅ Kartu berhasil ditambahkan!");
      setSoal("");
      setJawaban("");
      setShowForm(false);
      await ambilKartu(guruId);
    }
    setIsSaving(false);
  };

  const handleHapus = async (id: string) => {
    await supabase.from("memory_card_soal").delete().eq("id", id);
    setDaftarKartu(prev => prev.filter(k => k.id !== id));
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
            <h1 className="text-2xl font-bold text-gray-800">Memory Card Game 🧠</h1>
            <p className="text-gray-500 mt-1">{daftarKartu.length} kartu soal tersedia</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setPesan(""); }}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
          >
            {showForm ? "✕ Batal" : "➕ Tambah Kartu"}
          </button>
        </div>

        {pesan && (
          <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${
            pesan.startsWith("✅") ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"
          }`}>{pesan}</div>
        )}

        {showForm && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
            <h3 className="font-bold text-gray-800 mb-4">Tambah Kartu Baru 🃏</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soal / Pertanyaan</label>
                <input
                  type="text"
                  placeholder="Contoh: 🕌 Allahu Akbar"
                  value={soal}
                  onChange={(e) => setSoal(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jawaban / Pasangan</label>
                <input
                  type="text"
                  placeholder="Contoh: Allah Maha Besar"
                  value={jawaban}
                  onChange={(e) => setJawaban(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="dzikir">Dzikir</option>
                  <option value="asmaul-husna">Asmaul Husna</option>
                  <option value="nabi">Nama Nabi</option>
                  <option value="akhlak">Akhlak</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleTambah}
              disabled={isSaving}
              className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
            >
              {isSaving ? "⏳ Menyimpan..." : "💾 Simpan Kartu"}
            </button>
          </div>
        )}


        {/* Filter Kategori */}
<div className="flex gap-2 flex-wrap mb-6">
  {kategoriList.map((kat) => (
    <button
      key={kat}
      onClick={() => setFilterKategori(kat)}
      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
        filterKategori === kat
          ? "bg-green-500 text-white"
          : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"
      }`}
    >
      {kat === "semua" ? "Semua" : kat}
    </button>
  ))}
</div>
        

        {/* Grid Kartu */}
        {daftarKartu.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center text-gray-400">
            <div className="text-5xl mb-3">🃏</div>
            <p className="font-medium">Belum ada kartu soal</p>
            <p className="text-sm mt-1">Tambah kartu untuk digunakan di Memory Card Game</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {daftarKartu.map((kartu) => (
              <div key={kartu.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                    {kartu.kategori}
                  </span>
                  <button
                    onClick={() => handleHapus(kartu.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="text-xs text-green-600 font-medium mb-1">SOAL</p>
                    <p className="font-bold text-gray-800">{kartu.soal}</p>
                  </div>
                  <div className="flex items-center justify-center text-gray-400 text-lg">↕️</div>
                  <div className="bg-yellow-50 rounded-xl p-3">
                    <p className="text-xs text-yellow-600 font-medium mb-1">JAWABAN</p>
                    <p className="font-bold text-gray-800">{kartu.jawaban}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}