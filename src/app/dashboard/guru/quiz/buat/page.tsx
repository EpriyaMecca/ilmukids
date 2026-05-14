"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

type Pilihan = {
  jawaban: string;
  is_benar: boolean;
};

type Soal = {
  pertanyaan: string;
  penjelasan_jawaban: string;
  pilihan: Pilihan[];
};

export default function BuatQuiz() {
  const router = useRouter();
  const [namaGuru, setNamaGuru] = useState("");
  const [guruId, setGuruId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [pesan, setPesan] = useState("");

  // Data quiz
  const [judulQuiz, setJudulQuiz] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [waktuMenit, setWaktuMenit] = useState(10);
  const [totalXp, setTotalXp] = useState(100);
  const [kelasTarget, setKelasTarget] = useState("4");

  // Soal-soal
  const [soalList, setSoalList] = useState<Soal[]>([
    {
      pertanyaan: "",
      penjelasan_jawaban: "",
      pilihan: [
        { jawaban: "", is_benar: true },
        { jawaban: "", is_benar: false },
        { jawaban: "", is_benar: false },
        { jawaban: "", is_benar: false },
      ],
    },
  ]);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      setNamaGuru(session.user.user_metadata?.full_name || "Guru");
      setGuruId(session.user.id);
    };
    init();
  }, [router]);

  const tambahSoal = () => {
    setSoalList([...soalList, {
      pertanyaan: "",
      penjelasan_jawaban: "",
      pilihan: [
        { jawaban: "", is_benar: true },
        { jawaban: "", is_benar: false },
        { jawaban: "", is_benar: false },
        { jawaban: "", is_benar: false },
      ],
    }]);
  };

  const updateSoal = (index: number, field: string, value: string) => {
    const updated = [...soalList];
    updated[index] = { ...updated[index], [field]: value };
    setSoalList(updated);
  };

  const updatePilihan = (soalIndex: number, pilihanIndex: number, value: string) => {
    const updated = [...soalList];
    updated[soalIndex].pilihan[pilihanIndex].jawaban = value;
    setSoalList(updated);
  };

  const setJawabanBenar = (soalIndex: number, pilihanIndex: number) => {
    const updated = [...soalList];
    updated[soalIndex].pilihan = updated[soalIndex].pilihan.map((p, i) => ({
      ...p,
      is_benar: i === pilihanIndex,
    }));
    setSoalList(updated);
  };

  const hapusSoal = (index: number) => {
    if (soalList.length === 1) return;
    setSoalList(soalList.filter((_, i) => i !== index));
  };

  const handleSimpan = async (publish: boolean) => {
    if (!judulQuiz.trim()) {
      setPesan("Judul quiz wajib diisi!");
      return;
    }
    if (soalList.some(s => !s.pertanyaan.trim())) {
      setPesan("Semua pertanyaan wajib diisi!");
      return;
    }

    setIsSaving(true);
    setPesan("");

    // 1. Simpan quiz utama
    const { data: quizData, error: quizError } = await supabase
      .from("quiz")
      .insert({
        judul_quiz: judulQuiz,
        deskripsi,
        guru_id: guruId,
        total_xp: totalXp,
        waktu_menit: waktuMenit,
        status_publish: publish,
        kelas_target: `Kelas ${kelasTarget}`,
      })
      .select()
      .single();

    if (quizError || !quizData) {
      setPesan("Gagal simpan quiz!");
      setIsSaving(false);
      return;
    }

    // 2. Simpan setiap soal + pilihannya
    for (let i = 0; i < soalList.length; i++) {
      const soal = soalList[i];

      const { data: soalData, error: soalError } = await supabase
        .from("soal_quiz")
        .insert({
          quiz_id: quizData.id,
          pertanyaan: soal.pertanyaan,
          penjelasan_jawaban: soal.penjelasan_jawaban,
          urutan: i + 1,
        })
        .select()
        .single();

      if (soalError || !soalData) continue;

      // 3. Simpan pilihan jawaban
      await supabase.from("pilihan_jawaban").insert(
        soal.pilihan
          .filter(p => p.jawaban.trim())
          .map(p => ({
            soal_id: soalData.id,
            jawaban: p.jawaban,
            is_benar: p.is_benar,
          }))
      );
    }

    setPesan("✅ Quiz berhasil disimpan!");
    setTimeout(() => router.push("/dashboard/guru/quiz"), 1500);
    setIsSaving(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar namaGuru={namaGuru} />

      <main className="ml-64 flex-1 p-8">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Buat Quiz Baru 📝</h1>
          <p className="text-gray-500 mt-1">Isi informasi quiz dan tambahkan soal-soal</p>
        </div>

        {pesan && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${
            pesan.startsWith("✅")
              ? "bg-green-50 text-green-600 border border-green-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}>
            {pesan}
          </div>
        )}

        {/* Info Quiz */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Informasi Quiz</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Quiz</label>
              <input
                type="text"
                placeholder="Contoh: Quiz Asmaul Husna Kelas 4"
                value={judulQuiz}
                onChange={(e) => setJudulQuiz(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea
                placeholder="Deskripsi singkat quiz ini..."
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kelas Target</label>
              <select
                value={kelasTarget}
                onChange={(e) => setKelasTarget(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
              >
                <option value="4">Kelas 4</option>
                <option value="5">Kelas 5</option>
                <option value="6">Kelas 6</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Waktu (menit)</label>
              <input
                type="number"
                min={1}
                max={60}
                value={waktuMenit}
                onChange={(e) => setWaktuMenit(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Soal-soal */}
        {soalList.map((soal, soalIndex) => (
          <div key={soalIndex} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Soal {soalIndex + 1}</h3>
              {soalList.length > 1 && (
                <button
                  onClick={() => hapusSoal(soalIndex)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  🗑️ Hapus
                </button>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
              <textarea
                placeholder="Tulis pertanyaan di sini..."
                value={soal.pertanyaan}
                onChange={(e) => updateSoal(soalIndex, "pertanyaan", e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 resize-none"
              />
            </div>

            <div className="mb-4 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Pilihan Jawaban <span className="text-gray-400">(klik lingkaran untuk pilih jawaban benar)</span>
              </label>
              {soal.pilihan.map((pilihan, pilihanIndex) => (
                <div key={pilihanIndex} className="flex items-center gap-3">
                  <button
                    onClick={() => setJawabanBenar(soalIndex, pilihanIndex)}
                    className={`w-7 h-7 rounded-full border-2 flex-shrink-0 transition-all ${
                      pilihan.is_benar
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300 hover:border-green-400"
                    }`}
                  >
                    {pilihan.is_benar && <span className="text-white text-xs flex items-center justify-center w-full">✓</span>}
                  </button>
                  <input
                    type="text"
                    placeholder={`Pilihan ${String.fromCharCode(65 + pilihanIndex)}`}
                    value={pilihan.jawaban}
                    onChange={(e) => updatePilihan(soalIndex, pilihanIndex, e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 text-sm"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Penjelasan Jawaban <span className="text-gray-400">(opsional)</span>
              </label>
              <input
                type="text"
                placeholder="Jelaskan mengapa jawaban ini benar..."
                value={soal.penjelasan_jawaban}
                onChange={(e) => updateSoal(soalIndex, "penjelasan_jawaban", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 text-sm"
              />
            </div>
          </div>
        ))}

        {/* Tambah Soal */}
        <button
          onClick={tambahSoal}
          className="w-full py-3 border-2 border-dashed border-gray-300 hover:border-green-400 rounded-2xl text-gray-500 hover:text-green-600 font-medium transition-colors mb-6"
        >
          ➕ Tambah Soal
        </button>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => handleSimpan(false)}
            disabled={isSaving}
            className="flex-1 py-3 border border-gray-300 hover:bg-gray-50 rounded-xl font-medium text-gray-700 transition-colors disabled:opacity-50"
          >
            💾 Simpan Draft
          </button>
          <button
            onClick={() => handleSimpan(true)}
            disabled={isSaving}
            className="flex-1 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 rounded-xl font-medium text-white transition-colors shadow-sm"
          >
            {isSaving ? "⏳ Menyimpan..." : "🚀 Publish Quiz"}
          </button>
        </div>

      </main>
    </div>
  );
}