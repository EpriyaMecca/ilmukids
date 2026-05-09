export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 flex flex-col items-center text-center">
        
        {/* Badge atas */}
        <div className="mb-6 inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
          <span>✨</span>
          <span>Platform Belajar Islam #1 untuk Anak SD</span>
        </div>

        {/* Judul utama */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
          Belajar Islam
          <span className="text-green-500"> Sambil </span>
          <span className="text-yellow-500">Bermain!</span>
          <span className="ml-3">🎮</span>
        </h1>

        {/* Deskripsi */}
        <p className="text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed">
          Platform gamifikasi Islami untuk anak SD kelas 4–6. 
          Belajar Al-Quran, Hadits, dan akhlak mulia dengan cara yang 
          <strong className="text-green-600"> menyenangkan dan interaktif</strong>.
        </p>

        {/* Tombol CTA */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <a href="/register" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-green-200 hover:scale-105">
            🚀 Mulai Belajar Gratis
          </a>
          <a href="/games" className="bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-md border border-gray-200 hover:scale-105">
            🎮 Lihat Games
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">500+</div>
            <div className="text-gray-500 text-sm mt-1">Soal Islami</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">10+</div>
            <div className="text-gray-500 text-sm mt-1">Mini Games</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">3</div>
            <div className="text-gray-500 text-sm mt-1">Level Kesulitan</div>
          </div>
        </div>

      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Kenapa IlmuKids? 🌟
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Quiz Interaktif</h3>
            <p className="text-gray-500">Ratusan soal Al-Quran, Hadits, dan akhlak dengan sistem poin dan badge.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Leaderboard</h3>
            <p className="text-gray-500">Bersaing dengan teman sekelas dan raih posisi teratas papan peringkat.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Sistem XP & Badge</h3>
            <p className="text-gray-500">Kumpulkan XP, naik level, dan dapatkan badge spesial setiap pencapaian.</p>
          </div>

        </div>
      </section>

    </main>
  );
}