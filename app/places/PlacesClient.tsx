"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import type { PlaceName } from "@/lib/types";

const CAT_COLORS: Record<string, string> = {
  tarla: "bg-green-50 text-green-700",
  tepe: "bg-amber-50 text-amber-700",
  dere: "bg-blue-50 text-blue-700",
  mevki: "bg-purple-50 text-purple-700",
  orman: "bg-emerald-50 text-emerald-700",
  yol: "bg-orange-50 text-orange-700",
};

export default function PlacesClient({ places }: { places: PlaceName[] }) {
  const { lang } = useLang();
  const mapRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<PlaceName | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapLoaded) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      const L = (window as any).L;
      const withCoords = places.filter((p) => p.lat && p.lng);
      const center: [number, number] = withCoords.length > 0
        ? [withCoords[0].lat!, withCoords[0].lng!]
        : [39.0, 35.0];

      const map = L.map(mapRef.current!).setView(center, 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      withCoords.forEach((place) => {
        const icon = L.divIcon({
          html: `<div style="background:#2d5a3d;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.25)">${place.name[0]}</div>`,
          className: "",
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
        const marker = L.marker([place.lat!, place.lng!], { icon }).addTo(map);
        marker.on("click", () => setSelected(place));
        marker.bindTooltip(place.name, { permanent: false, direction: "top" });
      });
      setMapLoaded(true);
    };
    document.head.appendChild(script);
  }, [places, mapLoaded]);

  const categories = [...new Set(places.map((p) => p.category).filter(Boolean))];

  return (
    <div>
      <h1 className="page-title">
        {lang === "tr" ? "Eski Yer İsimleri" : "Navên Cihên Kevin"}
      </h1>
      <p className="page-subtitle">
        {lang === "tr"
          ? "Köy çevresindeki tarlalar, tepeler, dereler ve mevkilerin halk arasındaki isimleri"
          : "Navên gel ên zevî, girî, çem û cihên derdora gund"}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        {/* Map */}
        <div className="card overflow-hidden">
          <div ref={mapRef} style={{ height: "480px", width: "100%" }}>
            {!mapLoaded && (
              <div className="h-full flex flex-col items-center justify-center bg-stone-50 gap-3">
                <div className="w-8 h-8 border-2 border-[#2d5a3d] border-t-transparent rounded-full animate-spin" />
                <p className="text-stone-400 text-sm">Harita yükleniyor...</p>
              </div>
            )}
          </div>
          {selected && (
            <div className="p-4 border-t border-stone-100 bg-stone-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-bold text-stone-900">{selected.name}</p>
                  {selected.category && (
                    <span className={`badge text-xs mt-1 inline-block ${CAT_COLORS[selected.category] ?? "bg-stone-100 text-stone-600"}`}>
                      {selected.category}
                    </span>
                  )}
                  <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                    {lang === "tr" ? selected.description_tr : (selected.description_ku || selected.description_tr)}
                  </p>
                </div>
                <button onClick={() => setSelected(null)} className="text-stone-400 hover:text-stone-700 text-lg ml-4">✕</button>
              </div>
            </div>
          )}
          {places.filter((p) => p.lat && p.lng).length === 0 && mapLoaded && (
            <p className="text-xs text-stone-400 text-center py-3 border-t border-stone-100">
              Koordinat girilmiş yer yok — admin panelinden ekleyin.
            </p>
          )}
        </div>

        {/* Sidebar list */}
        <div className="space-y-3 overflow-y-auto max-h-[520px] pr-1">
          {places.length === 0 && (
            <div className="card p-6 text-center">
              <p className="text-stone-400 text-sm">Henüz yer adı eklenmemiş.</p>
            </div>
          )}
          {categories.map((cat) => (
            <div key={cat} className="card p-4">
              <span className={`badge mb-3 inline-block ${CAT_COLORS[cat!] ?? "bg-stone-100 text-stone-600"}`}>{cat}</span>
              <div className="space-y-1">
                {places.filter((p) => p.category === cat).map((place) => (
                  <div key={place.id}
                    className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                      selected?.id === place.id
                        ? "bg-[#2d5a3d]/10 border border-[#2d5a3d]/20"
                        : "hover:bg-stone-50"
                    }`}
                    onClick={() => setSelected(place)}>
                    <p className="font-semibold text-stone-900 text-sm">{place.name}</p>
                    <p className="text-xs text-stone-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {lang === "tr" ? place.description_tr : (place.description_ku || place.description_tr)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
