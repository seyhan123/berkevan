"use client";
import Image from "next/image";
import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import type { CemeteryRecord } from "@/lib/types";

export default function CemeteryClient({ records }: { records: CemeteryRecord[] }) {
  const { lang } = useLang();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CemeteryRecord | null>(null);

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    return !q || r.person_name.toLowerCase().includes(q) || (r.nickname ?? "").toLowerCase().includes(q);
  });

  return (
    <div>
      <h1 className="page-title">{lang === "tr" ? "Mezarlık Arşivi" : "Arşîva Gorîstanê"}</h1>
      <p className="page-subtitle">
        {lang === "tr"
          ? "Mezartaşı fotoğrafları ve defin yeri bilgileri"
          : "Wêneyên kevirê gorî û agahiyên şûna veşartinê"}
      </p>

      <input
        type="search"
        className="input mb-6"
        placeholder={lang === "tr" ? "İsim veya lakap ile ara..." : "Bi nav bigere..."}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-stone-400 text-sm">{lang === "tr" ? "Kayıt bulunamadı." : "Tomarek nehat dîtin."}</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filtered.map((rec) => (
          <div key={rec.id} className="card-hover p-4" onClick={() => setSelected(rec)}>
            {rec.gravestone_photo_url ? (
              <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-stone-100">
                <Image src={rec.gravestone_photo_url} alt={rec.person_name} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-full aspect-square rounded-xl bg-stone-100 flex items-center justify-center text-3xl mb-3">🪦</div>
            )}
            <p className="font-bold text-stone-900 text-sm leading-tight">{rec.person_name}</p>
            {rec.nickname && <p className="text-xs text-amber-600 italic mt-0.5">"{rec.nickname}"</p>}
            <p className="text-xs text-stone-400 mt-1.5">
              {rec.birth_year ?? "?"} — {rec.death_year ?? "?"}
            </p>
            {rec.location_desc && (
              <p className="text-xs text-stone-500 mt-1 line-clamp-1">📍 {rec.location_desc}</p>
            )}
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {selected.gravestone_photo_url && (
              <div className="relative w-full h-56 bg-stone-100">
                <Image src={selected.gravestone_photo_url} alt="" fill className="object-cover" />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-xl font-bold text-stone-900 mb-1" style={{ fontFamily: "'Libre Baskerville',serif" }}>
                {selected.person_name}
              </h2>
              {selected.nickname && <p className="text-amber-600 italic text-sm mb-3">"{selected.nickname}"</p>}
              <div className="space-y-2 text-sm">
                <div className="flex gap-3">
                  <span className="text-stone-400 w-24 flex-shrink-0">Doğum</span>
                  <span className="text-stone-800">{selected.birth_year ?? "—"}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-stone-400 w-24 flex-shrink-0">Vefat</span>
                  <span className="text-stone-800">{selected.death_year ?? "—"}</span>
                </div>
                {selected.location_desc && (
                  <div className="flex gap-3">
                    <span className="text-stone-400 w-24 flex-shrink-0">Konum</span>
                    <span className="text-stone-800">{selected.location_desc}</span>
                  </div>
                )}
                {selected.notes && (
                  <div className="flex gap-3">
                    <span className="text-stone-400 w-24 flex-shrink-0">Not</span>
                    <span className="text-stone-600 leading-relaxed">{selected.notes}</span>
                  </div>
                )}
              </div>
              <button onClick={() => setSelected(null)} className="btn-secondary w-full mt-5">Kapat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
