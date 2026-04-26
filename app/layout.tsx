import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Köy Soy Ağacı | Dara Malbatê",
  description: "Köyümüzün soy ağacı ve tarihi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-[#f7f4ef] min-h-screen antialiased">
        <LanguageProvider>
          <Navbar />
          <main className="max-w-5xl mx-auto px-5 py-8">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
