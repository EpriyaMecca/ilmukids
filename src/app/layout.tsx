import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/layout/NavbarWrapper";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IlmuKids — Belajar Islam Sambil Bermain",
  description: "Platform belajar Islam yang fun dan interaktif untuk anak SD",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={geist.className}>
        <NavbarWrapper />
        {children}
      </body>
    </html>
  );
}