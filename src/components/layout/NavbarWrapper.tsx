"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  // Sembunyikan navbar di halaman dashboard
  const isDashboard = pathname?.startsWith("/dashboard");
  
  if (isDashboard) return null;
  
  return <Navbar />;
}