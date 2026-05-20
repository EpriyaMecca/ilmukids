import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import Providers from "@/components/providers";
import ThemeToggle from "@/components/ui/ThemeToggle";

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
    <html lang="id" suppressHydrationWarning>
      <body className={geist.className}>
        <Providers>
          <NavbarWrapper />
          {children}
          <ThemeToggle />
        </Providers>
      </body>
    </html>
  );
}