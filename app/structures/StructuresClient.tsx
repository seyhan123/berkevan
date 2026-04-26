"use client";
import Image from "next/image";
import { useLang } from "@/contexts/LanguageContext";
import type { HistoricStructure } from "@/lib/types";

const TYPE_ICONS: Record<string, string> = {
  cami: "🕌", çeşme: "💧", değirmen: "⚙️", ev: "🏚️",
  ahır: "🐄", köprü: "🌉", okul: "🏫", diğer: "🏛️",
};

const STATUS_STYLE: Record<string, string> = {
  ayakta: "bg-green-50 text-green-700",
  harabe: "bg-amber-50 text-amber-700",
  yıkılmış: "bg-red-50 text-red-600",
};

export default function StructuresClient({ structures }: { structures: HistoricStructure[] }) {
  const { lang } = useLang();

  return (
    <div>
      <h1 className="page-title">
        {lang === "tr" ? "Tarihi Yapılar" : "Avahiyên Dîrokî"}
      </h1>
      <p className="page-subtitle">
        {lang === "tr"
          ? "Köyün tarihi camisi, çeşmesi, değirmeni ve eski evleri"
          : "Mizgeft, kanî, asiya û malên kevin ên gund"}
      </p>

      {structures.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-stone-400 text-sm">Henüz tarihi yapı eklenmemiş.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {structures.map((s) => {
          const name = lang === "tr" ? s.name_tr : (s.name_ku || s.name_tr);
          const desc = lang === "tr" ? s.description_tr : (s.description_ku || s.description_tr);
          const icon = TYPE_ICONS[s.type ?? ""] ?? "🏛️";
          const statusStyle = STATUS_STYLE[s.status ?? ""] ?? "bg-stone-100 text-stone-500";

          return (
            <div key={s.id} className="card overflow-hidden">
              {s.photo_url ? (
                <div className="relative w-full h-44 bg-stone-100">
                  <Image src={s.photo_url} alt={name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-full h-44 bg-stone-50 flex items-center justify-center text-5xl">
                  {icon}
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="font-bold text-stone-900 text-base leading-tight">{name}</h2>
                  <span className={`badge text-xs flex-shrink-0 ${statusStyle}`}>{s.status}</span>
                </div>
                {s.type && (
                  <span className="badge bg-stone-100 text-stone-600 text-xs mb-2 inline-block">{icon} {s.type}</span>
                )}
                {desc && <p className="text-stone-600 text-sm leading-relaxed mt-2">{desc}</p>}
                <div className="flex gap-4 mt-3 text-xs text-stone-400">
                  {s.year_built && <span>İnşa: {s.year_built}</span>}
                  {s.year_demolished && <span>Yıkım: {s.year_demolished}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
