"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  if (pathname.startsWith("/admin")) return null;

  const links = [
    { href: "/",           label: lang==="tr"?"Ana Sayfa":"Sereke" },
    { href: "/tree",       label: lang==="tr"?"Soy Ağacı":"Dara Malbatê" },
    { href: "/people",     label: lang==="tr"?"Kişiler":"Kesan" },
    { href: "/places",     label: lang==="tr"?"Yer İsimleri":"Navên Cihan" },
    { href: "/structures", label: lang==="tr"?"Tarihi Yapılar":"Avahî" },
    { href: "/cemetery",   label: lang==="tr"?"Mezarlık":"Goristan" },
    { href: "/gallery",    label: lang==="tr"?"Galeri":"Galerî" },
    { href: "/history",    label: lang==="tr"?"Tarih":"Dîrok" },
    { href: "/submit",     label: lang==="tr"?"Bilgi Gönder":"Agahî Bişîne" },
  ];

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#2d5a3d] flex items-center justify-center text-base">🌳</div>
          <span className="font-bold text-stone-900 text-sm hidden md:block" style={{fontFamily:"'Libre Baskerville',serif"}}>{t.siteName}</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-0.5 flex-1 overflow-x-auto">
          {links.map(({ href, label }) => {
            const active = href==="/" ? pathname==="/" : pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  active ? "bg-[#2d5a3d]/10 text-[#2d5a3d]" : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
                }`}>{label}</Link>
            );
          })}
        </nav>
        <div className="lg:hidden flex-1" />
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5 bg-stone-100 rounded-lg p-0.5">
            {(["tr","ku"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  lang===l ? "bg-[#2d5a3d] text-white shadow-sm" : "text-stone-500 hover:text-stone-700"
                }`}>{l.toUpperCase()}</button>
            ))}
          </div>
          <button className="lg:hidden p-2 rounded-lg hover:bg-stone-100" onClick={() => setOpen(!open)}>
            <div className="w-4 h-0.5 bg-stone-600 mb-1"></div>
            <div className="w-4 h-0.5 bg-stone-600 mb-1"></div>
            <div className="w-4 h-0.5 bg-stone-600"></div>
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden bg-white border-t border-stone-100 px-5 py-3 grid grid-cols-2 gap-1">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-50">
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
