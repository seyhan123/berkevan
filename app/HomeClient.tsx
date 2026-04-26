"use client";
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";
import type { VillageInfo } from "@/lib/types";

interface Props {
  village: VillageInfo | null;
  stats: { total: number; male: number; female: number; deceased: number; villages: number };
  connectedVillages: string[];
}

export default function HomeClient({ village, stats, connectedVillages }: Props) {
  const { lang, t } = useLang();
  const desc = lang==="tr" ? village?.description_tr : village?.description_ku;
  const important = lang==="tr" ? village?.important_info_tr : village?.important_info_ku;

  const sections = [
    { href:"/tree",       icon:"🌳", title:lang==="tr"?"Soy Ağacı":"Dara Malbatê",        sub:lang==="tr"?"Nesil haritası":"Nexşeya nifşan", color:"bg-emerald-50 text-emerald-700" },
    { href:"/people",     icon:"👤", title:lang==="tr"?"Kişiler":"Kesan",                  sub:lang==="tr"?"Tüm bireyler":"Hemû kesan",        color:"bg-blue-50 text-blue-700" },
    { href:"/places",     icon:"📍", title:lang==="tr"?"Yer İsimleri":"Navên Cihan",       sub:lang==="tr"?"İnteraktif harita":"Nexşeya înteraktîf", color:"bg-orange-50 text-orange-700" },
    { href:"/structures", icon:"🏛️", title:lang==="tr"?"Tarihi Yapılar":"Avahiyên Dîrokî", sub:lang==="tr"?"Cami, çeşme, değirmen":"Mizgeft, kanî, asiya", color:"bg-amber-50 text-amber-700" },
    { href:"/cemetery",   icon:"🪦", title:lang==="tr"?"Mezarlık Arşivi":"Arşîva Gorîstan", sub:lang==="tr"?"Mezartaşı kayıtları":"Tomarên kevirê gorî", color:"bg-stone-100 text-stone-700" },
    { href:"/gallery",    icon:"🖼️", title:lang==="tr"?"Galeri":"Galerî",                  sub:lang==="tr"?"Köy fotoğrafları":"Wêneyên gund",   color:"bg-purple-50 text-purple-700" },
    { href:"/history",    icon:"📖", title:lang==="tr"?"Tarih & Hikayeler":"Dîrok & Çîrok",sub:lang==="tr"?"Ata hikayeleri":"Çîrokên bavan",    color:"bg-rose-50 text-rose-700" },
    { href:"/submit",     icon:"✉️", title:lang==="tr"?"Bilgi Gönder":"Agahî Bişîne",      sub:lang==="tr"?"Eksik bilgi ekle":"Agahiyên kêm zêde bike", color:"bg-teal-50 text-teal-700" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="hero-banner">
        <p className="text-emerald-300 text-xs font-semibold uppercase tracking-widest mb-3">{t.siteName}</p>
        <h1 className="text-4xl font-bold text-white mb-3 leading-tight" style={{fontFamily:"'Libre Baskerville',serif"}}>
          {village?.name ?? "Köy Arşivi"}
        </h1>
        {village?.founded && <p className="text-emerald-200 text-sm mb-4">Kuruluş: {village.founded}</p>}
        {desc && <p className="text-emerald-100 text-sm leading-relaxed max-w-2xl">{desc}</p>}
        {connectedVillages.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            <span className="text-emerald-300 text-xs self-center">{t.home.connectedVillages}:</span>
            {connectedVillages.map((v) => (
              <span key={v} className="bg-white/10 text-emerald-100 text-xs px-3 py-1 rounded-full border border-white/20">{v}</span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label:t.stats.total,    value:stats.total,    color:"text-stone-900" },
          { label:t.stats.male,     value:stats.male,     color:"text-blue-700" },
          { label:t.stats.female,   value:stats.female,   color:"text-rose-600" },
          { label:t.stats.deceased, value:stats.deceased, color:"text-stone-500" },
          { label:t.stats.villages, value:stats.villages, color:"text-[#2d5a3d]" },
        ].map((s) => (
          <div key={s.label} className="stat-card text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-stone-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Important info */}
      {important && (
        <div className="card p-5 border-l-4 border-[#2d5a3d]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2d5a3d] mb-2">📌 {t.home.importantInfo}</p>
          <p className="text-stone-600 text-sm leading-relaxed">{important}</p>
        </div>
      )}

      {/* Sections grid */}
      <div>
        <p className="panel-label">{t.home.quickNav}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {sections.map(({ href, icon, title, sub, color }) => (
            <Link key={href} href={href} className="card-hover p-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base mb-3 ${color}`}>{icon}</div>
              <p className="font-semibold text-stone-900 text-sm">{title}</p>
              <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
