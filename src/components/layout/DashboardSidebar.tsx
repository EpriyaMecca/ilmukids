"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const menuItems = [
  { href: "/dashboard/guru", icon: "🏠", label: "Beranda" },
  { href: "/dashboard/guru/siswa", icon: "👦", label: "Daftar Siswa" },
  { href: "/dashboard/guru/kelas", icon: "🏫", label: "Kelas" },
  { href: "/dashboard/guru/quiz", icon: "📝", label: "Quiz" },
  { href: "/dashboard/guru/nilai", icon: "📊", label: "Nilai & Progress" },
];

export default function DashboardSidebar({ namaGuru }: { namaGuru: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 shadow-sm flex flex-col z-40">

      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🕌</span>
          <span className="text-xl font-bold text-green-600">
            Ilmu<span className="text-yellow-500">Kids</span>
          </span>
        </Link>
        <p className="text-xs text-gray-400 mt-1 ml-8">Panel Guru</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? "bg-green-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-green-600"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile & Logout */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-lg">
            👨‍🏫
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 truncate w-32">
              {namaGuru}
            </p>
            <p className="text-xs text-gray-400">Guru</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
        >
          <span>🚪</span>
          <span>Keluar</span>
        </button>
      </div>

    </aside>
  );
}