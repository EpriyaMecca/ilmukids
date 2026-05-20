"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function Home() {
  return (
<main className="pt-16 min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 flex flex-col items-center text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium"
        >
          <span>✨</span>
          <span>Platform Belajar Islam #1 untuk Anak SD</span>
        </motion.div>

        {/* Judul */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-300 mb-6 leading-tight"
        >
          Belajar Islam
          <span className="text-green-500"> Sambil </span>
          <span className="text-yellow-500">Bermain!</span>
          <span className="ml-3">🎮</span>
        </motion.h1>

        {/* Deskripsi */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed"
        >
          Platform gamifikasi Islami untuk anak SD kelas 4–6.
          Belajar Al-Quran, Hadits, dan akhlak mulia dengan cara yang
          <strong className="text-green-600"> menyenangkan dan interaktif</strong>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <Link
            href="/register"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-green-200 hover:scale-105"
          >
            🚀 Mulai Belajar Gratis
          </Link>
          <Link
            href="/login"
            className="bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-gray-200 hover:scale-105"
          >
            🎮 Masuk Sekarang
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-8 sm:gap-16"
        >
          {[
            { nilai: "500+", label: "Soal Islami", warna: "text-green-600" },
            { nilai: "10+", label: "Mini Games", warna: "text-yellow-500" },
            { nilai: "3", label: "Level Kesulitan", warna: "text-green-600" },
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeUp} className="text-center">
              <div className={`text-3xl font-bold ${stat.warna}`}>{stat.nilai}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-gray-800 mb-12 dark:text-white"
        >
        Kenapa IlmuKids? 🌟
        </motion.h2>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: "🎯",
              judul: "Quiz Interaktif",
              deskripsi: "Ratusan soal Al-Quran, Hadits, dan akhlak dengan sistem poin dan badge.",
              warna: "bg-green-50 border-green-100",
            },
            {
              icon: "🏆",
              judul: "Leaderboard",
              deskripsi: "Bersaing dengan teman sekelas dan raih posisi teratas papan peringkat.",
              warna: "bg-yellow-50 border-yellow-100",
            },
            {
              icon: "⭐",
              judul: "Sistem XP & Badge",
              deskripsi: "Kumpulkan XP, naik level, dan dapatkan badge spesial setiap pencapaian.",
              warna: "bg-blue-50 border-blue-100",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -8, scale: 1.02 }}
className={`${card.warna} rounded-2xl p-6 shadow-sm border hover:shadow-md transition-shadow dark:bg-slate-700 dark:border-slate-600`}            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{card.judul}</h3>
              <p className="text-gray-500 dark:text-gray-300">{card.deskripsi}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonial / CTA Bottom */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-12 text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10 text-9xl flex items-center justify-center select-none">
            🕌
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">
              Siap Mulai Perjalanan Belajar? 🚀
            </h2>
            <p className="text-green-100 mb-8 text-lg">
              Bergabung dengan ribuan siswa yang sudah belajar Islam dengan cara yang menyenangkan.
            </p>
            <Link
              href="/register"
              className="inline-block bg-white text-green-600 font-bold px-8 py-4 rounded-full hover:scale-105 transition-all shadow-lg"
            >
              Daftar Gratis Sekarang →
            </Link>
          </div>
        </motion.div>
      </section>

    </main>
  );
}