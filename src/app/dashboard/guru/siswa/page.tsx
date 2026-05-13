"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

type Siswa = {
  id: string;
  nama_lengkap: string;
  username: string;
  password_plain: string;
  kelas: string;
  xp: number;
  level: number;
};

export default function HalamanSiswa() {
  const router = useRouter();
  const [namaGuru, setNamaGuru] = useState("");
  const [guruId, setGuruId] = useState("");
  const [daftarSiswa, setDaftarSiswa] = useState<Siswa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("4");
  const [isSaving, setIsSaving] = useState(false);
  const [pesan, setPesan] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }

      setNamaGuru(session.user.user_metadata?.full_name || "Guru");
      setGuruId(session.user.id);
      await ambilSiswa(session.user.id);
      setIsLoading(false);
    };
    init();
  }, [router]);

  const ambilSiswa = async (id: string) => {
    const { data } = await supabase
      .from("siswa")
      .select("*")
      .eq("guru_id", id)
      .order("created_at", { ascending: false });

    if (data) setDaftarSiswa(data);
  };

  // Auto-generate username dari nama
  const generateUsername = (nama: string) => {
    return nama
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 12) + Math.floor(Math.random() * 100);
  };

  // Auto-generate password
  const generatePassword = () => {
    const kata = ["ilmu", "belajar", "islam", "pintar", "semangat"];
    const random = kata[Math.floor(Math.random() * kata.length)];
    return random + Math.floor(Math.random() * 1000);
  };

  const handleTambahSiswa = async () => {
    if (!nama.trim()) {
      setPesan("Nama siswa wajib diisi!");
      return;
    }

    setIsSaving(true);
    setPesan("");

    const username = generateUsername(nama);
    const password = generatePassword();

    const { error } = await supabase.from("siswa").insert({
      nama_lengkap: nama,
      username,
      password_plain: password,
      kelas: `Kelas ${kelas}`,
      guru_id: guruId,
    });

    if (error) {
      setPesan("Gagal tambah siswa. Coba lagi!");
    } else {
      setPesan("✅ Siswa berhasil ditambahkan!");
      setNama("");
      setKelas("4");
      setShowForm(false);
      await ambilSiswa(guruId);
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">⏳ Memuat...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar namaGuru={namaGuru} />

      <main className="ml-64 flex-1 p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Daftar Siswa 👦</h1>
            <p className="text-gray-500 mt-1">{daftarSiswa.length} siswa terdaftar</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setPesan(""); }}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
          >
            {showForm ? "✕ Batal" : "➕ Tambah Siswa"}
          </button>
        </div>

        {/* Form Tambah Siswa */}
        {showForm && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Tambah Siswa Baru 📝
            </h3>

            {pesan && (
              <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${
                pesan.startsWith("✅")
                  ? "bg-green-50 text-green-600 border border-green-200"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}>
                {pesan}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap Siswa
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Ahmad Fauzi"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kelas
                </label>
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                >
                  <option value="4">Kelas 4</option>
                  <option value="5">Kelas 5</option>
                  <option value="6">Kelas 6</option>
                </select>
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-4">
              💡 Username dan password akan di-generate otomatis oleh sistem
            </p>

            <button
              onClick={handleTambahSiswa}
              disabled={isSaving}
              className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
            >
              {isSaving ? "⏳ Menyimpan..." : "Simpan Siswa"}
            </button>
          </div>
        )}

        {/* Tabel Siswa */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {daftarSiswa.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">📋</div>
              <p className="font-medium">Belum ada siswa</p>
              <p className="text-sm mt-1">Klik "Tambah Siswa" untuk mulai</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Nama</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Kelas</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Username</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Password</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">XP</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Level</th>
                </tr>
              </thead>
              <tbody>
                {daftarSiswa.map((siswa, index) => (
                  <tr
                    key={siswa.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {siswa.nama_lengkap}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{siswa.kelas}</td>
                    <td className="px-6 py-4">
                      <code className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-sm">
                        {siswa.username}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <code className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-sm">
                        {siswa.password_plain}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-green-600 font-semibold">
                      {siswa.xp} XP
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-sm font-medium">
                        Lv.{siswa.level}
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