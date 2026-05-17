"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Card = {
  id: number;
  content: string;
  type: "soal" | "jawaban";
  pairId: number;
  isFlipped: boolean;
  isMatched: boolean;
};

const KARTU_DATA = [
  { soal: "🕌 Allahu Akbar", jawaban: "Allah Maha Besar", pairId: 1 },
  { soal: "🌙 Subhanallah", jawaban: "Maha Suci Allah", pairId: 2 },
  { soal: "⭐ Alhamdulillah", jawaban: "Segala Puji bagi Allah", pairId: 3 },
  { soal: "📖 Astaghfirullah", jawaban: "Aku mohon ampun Allah", pairId: 4 },
  { soal: "🤲 Bismillah", jawaban: "Dengan nama Allah", pairId: 5 },
  { soal: "💚 Insya Allah", jawaban: "Jika Allah menghendaki", pairId: 6 },
];

function buatKartu(): Card[] {
  const list: Card[] = [];
  KARTU_DATA.forEach((item) => {
    list.push({ id: 0, content: item.soal, type: "soal", pairId: item.pairId, isFlipped: false, isMatched: false });
    list.push({ id: 0, content: item.jawaban, type: "jawaban", pairId: item.pairId, isFlipped: false, isMatched: false });
  });
  return list
    .sort(() => Math.random() - 0.5)
    .map((k, i) => ({ ...k, id: i }));
}

export default function MemoryCardGame() {
  const [kartu, setKartu] = useState<Card[]>([]);
  const [pilihanPertama, setPilihanPertama] = useState<Card | null>(null);
  const [pilihanKedua, setPilihanKedua] = useState<Card | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [langkah, setLangkah] = useState(0);
  const [waktu, setWaktu] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [selesai, setSelesai] = useState(false);

  useEffect(() => { setKartu(buatKartu()); }, []);

  useEffect(() => {
    if (!gameStarted || selesai) return;
    const t = setInterval(() => setWaktu(w => w + 1), 1000);
    return () => clearInterval(t);
  }, [gameStarted, selesai]);

  useEffect(() => {
    if (kartu.length > 0 && kartu.every(k => k.isMatched)) {
      setTimeout(() => setSelesai(true), 500);
    }
  }, [kartu]);

  // Cek match setelah pilihan kedua
  useEffect(() => {
    if (!pilihanPertama || !pilihanKedua) return;
    setDisabled(true);
    setLangkah(l => l + 1);

    if (
      pilihanPertama.pairId === pilihanKedua.pairId &&
      pilihanPertama.type !== pilihanKedua.type
    ) {
      // MATCH ✅
      setKartu(prev => prev.map(k =>
        k.pairId === pilihanPertama.pairId
          ? { ...k, isMatched: true }
          : k
      ));
      resetPilihan();
    } else {
      // TIDAK MATCH ❌
      setTimeout(() => {
        setKartu(prev => prev.map(k =>
          (k.id === pilihanPertama.id || k.id === pilihanKedua.id)
            ? { ...k, isFlipped: false }
            : k
        ));
        resetPilihan();
      }, 1000);
    }
  }, [pilihanPertama, pilihanKedua]);

  const resetPilihan = () => {
    setPilihanPertama(null);
    setPilihanKedua(null);
    setDisabled(false);
  };

  const handleKlik = (kartuDiklik: Card) => {
    if (disabled) return;
    if (kartuDiklik.isMatched) return;
    if (kartuDiklik.isFlipped) return;
    if (pilihanPertama?.id === kartuDiklik.id) return;

    if (!gameStarted) setGameStarted(true);

    // Flip kartu
    setKartu(prev => prev.map(k =>
      k.id === kartuDiklik.id ? { ...k, isFlipped: true } : k
    ));

    if (!pilihanPertama) {
      setPilihanPertama(kartuDiklik);
    } else {
      setPilihanKedua(kartuDiklik);
    }
  };

  const handleReset = () => {
    setKartu(buatKartu());
    setPilihanPertama(null);
    setPilihanKedua(null);
    setDisabled(false);
    setLangkah(0);
    setWaktu(0);
    setGameStarted(false);
    setSelesai(false);
  };

  const formatWaktu = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const matchedCount = kartu.filter(k => k.isMatched).length / 2;
  const totalPairs = KARTU_DATA.length;
  const progressPersen = Math.round((matchedCount / totalPairs) * 100);

  if (selesai) {
    const bintang = langkah <= 8 ? 3 : langkah <= 14 ? 2 : 1;
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">MasyaAllah!</h1>
          <p className="text-gray-500 mb-4">Semua pasangan ditemukan!</p>
          <div className="text-4xl mb-6">
            {[0,1,2].map(i => (
              <span key={i} className={i < bintang ? "text-yellow-400" : "text-gray-200"}>⭐</span>
            ))}
          </div>
          <div className="bg-gray-50 rounded-2xl p-5 mb-6 space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-gray-500">Waktu</span>
              <span className="font-bold">{formatWaktu(waktu)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Langkah</span>
              <span className="font-bold">{langkah} langkah</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Bintang</span>
              <span className="font-bold text-yellow-500">{bintang}/3 ⭐</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleReset} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-bold transition-all hover:scale-105">
              🔄 Main Lagi
            </button>
            <Link href="/games" className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl font-bold text-center transition-all">
              🎮 Game Lain
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/games" className="text-gray-500 hover:text-gray-700 font-medium">← Games</Link>
          <h1 className="font-bold text-gray-800">🧠 Memory Card Islami</h1>
          <div className="text-green-600 font-bold">{formatWaktu(waktu)}</div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Stats */}
        <div className="flex gap-4 mb-6">
          {[
            { nilai: `${matchedCount}/${totalPairs}`, label: "Pasangan", warna: "text-green-600" },
            { nilai: langkah, label: "Langkah", warna: "text-blue-600" },
            { nilai: formatWaktu(waktu), label: "Waktu", warna: "text-yellow-500" },
          ].map((s, i) => (
            <div key={i} className="flex-1 bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
              <div className={`text-2xl font-bold ${s.warna}`}>{s.nilai}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 font-medium">Progress</span>
            <span className="text-green-600 font-bold">{progressPersen}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full"
              animate={{ width: `${progressPersen}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Panduan */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 text-center">
          <p className="text-green-700 text-sm font-medium">
            💡 Klik kartu <strong>hijau</strong> untuk membuka. Cocokkan dzikir dengan artinya!
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-3">
          {kartu.map((k) => {
            const isOpen = k.isFlipped || k.isMatched;
            return (
              <motion.div
                key={k.id}
                onClick={() => handleKlik(k)}
                whileHover={{ scale: isOpen ? 1 : 1.04 }}
                whileTap={{ scale: 0.96 }}
                animate={{ rotateY: isOpen ? 180 : 0 }}
                transition={{ duration: 0.35 }}
                style={{ perspective: 600, transformStyle: "preserve-3d" }}
                className="aspect-square cursor-pointer rounded-2xl relative"
              >
                {/* Depan (saat tertutup) */}
                <div
                  className="absolute inset-0 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br from-green-400 to-green-600 shadow-md"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  🕌
                </div>

                {/* Belakang (saat terbuka) */}
                <div
                  className={`absolute inset-0 rounded-2xl flex items-center justify-center p-2 text-center shadow-md ${
                    k.isMatched
                      ? "bg-gradient-to-br from-yellow-400 to-orange-400"
                      : "bg-white border-2 border-green-300"
                  }`}
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <span className={`font-bold leading-tight ${k.isMatched ? "text-white" : "text-gray-800"} ${k.content.length > 15 ? "text-xs" : "text-sm"}`}>
                    {k.content}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={handleReset}
          className="w-full mt-6 py-3 border-2 border-gray-200 hover:border-green-400 text-gray-500 hover:text-green-600 rounded-2xl font-medium transition-all"
        >
          🔄 Mulai Ulang
        </button>

      </div>
    </div>
  );
}