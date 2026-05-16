"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Pilihan = {
  id: string;
  jawaban: string;
  is_benar: boolean;
};

type Soal = {
  id: string;
  pertanyaan: string;
  penjelasan_jawaban: string;
  pilihan: Pilihan[];
};

type Quiz = {
  id: string;
  judul_quiz: string;
  deskripsi: string;
  total_xp: number;
  waktu_menit: number;
};

type GameState = "loading" | "intro" | "playing" | "result";

export default function MainQuiz() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const [gameState, setGameState] = useState<GameState>("loading");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [soalList, setSoalList] = useState<Soal[]>([]);
  const [soalIndex, setSoalIndex] = useState(0);
  const [pilihanDipilih, setPilihanDipilih] = useState<string | null>(null);
  const [sudahJawab, setSudahJawab] = useState(false);
  const [jumlahBenar, setJumlahBenar] = useState(0);
  const [waktuSisa, setWaktuSisa] = useState(0);
  const [xpDapat, setXpDapat] = useState(0);

  useEffect(() => {
    const loadQuiz = async () => {
      // Load quiz info
      const { data: quizData } = await supabase
        .from("quiz")
        .select("*")
        .eq("id", quizId)
        .single();

      if (!quizData) { router.push("/"); return; }
      setQuiz(quizData);
      setWaktuSisa(quizData.waktu_menit * 60);

      // Load soal + pilihan
      const { data: soalData } = await supabase
        .from("soal_quiz")
        .select("*, pilihan_jawaban(*)")
        .eq("quiz_id", quizId)
        .order("urutan");

      if (soalData) {
        const formatted = soalData.map((s: any) => ({
          id: s.id,
          pertanyaan: s.pertanyaan,
          penjelasan_jawaban: s.penjelasan_jawaban,
          pilihan: s.pilihan_jawaban,
        }));
        setSoalList(formatted);
      }

      setGameState("intro");
    };

    loadQuiz();
  }, [quizId, router]);

  // Timer countdown
  useEffect(() => {
    if (gameState !== "playing") return;
    if (waktuSisa <= 0) {
      setGameState("result");
      return;
    }
    const timer = setInterval(() => {
      setWaktuSisa((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, waktuSisa]);

  const formatWaktu = (detik: number) => {
    const m = Math.floor(detik / 60).toString().padStart(2, "0");
    const s = (detik % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handlePilihJawaban = (pilihanId: string, isBenar: boolean) => {
    if (sudahJawab) return;
    setPilihanDipilih(pilihanId);
    setSudahJawab(true);
    if (isBenar) setJumlahBenar((prev) => prev + 1);
  };

  const handleSoalBerikutnya = async () => {
  if (soalIndex + 1 >= soalList.length) {
    const xp = Math.round((jumlahBenar / soalList.length) * (quiz?.total_xp || 100));
    setXpDapat(xp);

    // Simpan hasil ke database
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const email = session.user.email || "";
      const username = email.replace("@ilmukids.app", "");

      // Ambil data siswa
      const { data: siswaData } = await supabase
        .from("siswa")
        .select("id, xp, level")
        .eq("username", username)
        .single();

      if (siswaData) {
        const xpBaru = siswaData.xp + xp;
        const levelBaru = Math.floor(xpBaru / 500) + 1;

        // Update XP dan level siswa
        await supabase
          .from("siswa")
          .update({ xp: xpBaru, level: levelBaru })
          .eq("id", siswaData.id);

        // Simpan hasil quiz
        await supabase.from("hasil_quiz").insert({
          siswa_id: siswaData.id,
          quiz_id: quizId,
          skor: Math.round((jumlahBenar / soalList.length) * 100),
          xp_didapat: xp,
          jumlah_benar: jumlahBenar,
          jumlah_salah: soalList.length - jumlahBenar,
        });
      }
    }

    setGameState("result");
  } else {
    setSoalIndex((prev) => prev + 1);
    setPilihanDipilih(null);
    setSudahJawab(false);
  }
};

  const soalSekarang = soalList[soalIndex];
  const progress = soalList.length > 0 ? ((soalIndex) / soalList.length) * 100 : 0;

  // ─── LOADING ───
  if (gameState === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <p className="text-gray-500 font-medium">Memuat quiz...</p>
        </div>
      </div>
    );
  }

  // ─── INTRO ───
  if (gameState === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100">
          <div className="text-6xl mb-4">🕌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{quiz?.judul_quiz}</h1>
          <p className="text-gray-500 mb-6">{quiz?.deskripsi}</p>

          <div className="flex justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{soalList.length}</div>
              <div className="text-xs text-gray-500">Soal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{quiz?.total_xp}</div>
              <div className="text-xs text-gray-500">Max XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{quiz?.waktu_menit}</div>
              <div className="text-xs text-gray-500">Menit</div>
            </div>
          </div>

          <button
            onClick={() => setGameState("playing")}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-green-200"
          >
            🚀 Mulai Quiz!
          </button>

          <button
            onClick={() => router.back()}
            className="w-full mt-3 py-3 text-gray-500 hover:text-gray-700 font-medium"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  // ─── RESULT ───
  if (gameState === "result") {
    const persentase = Math.round((jumlahBenar / soalList.length) * 100);
    const emoji = persentase >= 80 ? "🏆" : persentase >= 60 ? "⭐" : "💪";
    const pesan = persentase >= 80 ? "Luar Biasa!" : persentase >= 60 ? "Bagus!" : "Tetap Semangat!";

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100">
          <div className="text-7xl mb-4">{emoji}</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">{pesan}</h1>
          <p className="text-gray-500 mb-8">Quiz selesai!</p>

          <div className="bg-gray-50 rounded-2xl p-6 mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Jawaban Benar</span>
              <span className="font-bold text-green-600">{jumlahBenar}/{soalList.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Skor</span>
              <span className="font-bold text-gray-800">{persentase}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">XP Didapat</span>
              <span className="font-bold text-yellow-500">+{xpDapat} XP ⭐</span>
            </div>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-green-200"
          >
            🏠 Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // ─── PLAYING ───
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            Soal {soalIndex + 1} dari {soalList.length}
          </span>
          <span className={`font-bold text-lg ${waktuSisa < 30 ? "text-red-500" : "text-green-600"}`}>
            ⏱️ {formatWaktu(waktuSisa)}
          </span>
          <span className="text-sm font-medium text-yellow-600">
            ⭐ {quiz?.total_xp} XP
          </span>
        </div>

        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mt-2">
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Soal */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">
          <p className="text-xl font-bold text-gray-800 leading-relaxed">
            {soalSekarang?.pertanyaan}
          </p>
        </div>

        {/* Pilihan */}
        <div className="space-y-3 mb-6">
          {soalSekarang?.pilihan.map((pilihan, i) => {
            let style = "bg-white border-gray-200 text-gray-700 hover:border-green-400 hover:bg-green-50";

            if (sudahJawab) {
              if (pilihan.is_benar) {
                style = "bg-green-500 border-green-500 text-white";
              } else if (pilihan.id === pilihanDipilih && !pilihan.is_benar) {
                style = "bg-red-500 border-red-500 text-white";
              } else {
                style = "bg-gray-50 border-gray-200 text-gray-400";
              }
            } else if (pilihan.id === pilihanDipilih) {
              style = "bg-green-50 border-green-500 text-green-700";
            }

            return (
              <button
                key={pilihan.id}
                onClick={() => handlePilihJawaban(pilihan.id, pilihan.is_benar)}
                disabled={sudahJawab}
                className={`w-full text-left px-6 py-4 rounded-2xl border-2 font-medium transition-all ${style}`}
              >
                <span className="mr-3 font-bold">
                  {String.fromCharCode(65 + i)}.
                </span>
                {pilihan.jawaban}
              </button>
            );
          })}
        </div>

        {/* Penjelasan + Tombol Lanjut */}
        {sudahJawab && (
          <div className="space-y-3">
            {soalSekarang?.penjelasan_jawaban && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl px-6 py-4">
                <p className="text-sm text-blue-700">
                  💡 <strong>Penjelasan:</strong> {soalSekarang.penjelasan_jawaban}
                </p>
              </div>
            )}
            <button
              onClick={handleSoalBerikutnya}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-green-200"
            >
              {soalIndex + 1 >= soalList.length ? "🏆 Lihat Hasil!" : "Soal Berikutnya →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}