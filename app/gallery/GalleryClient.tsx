"use client";
import Image from "next/image";
import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import type { Photo } from "@/lib/types";

export default function GalleryClient({ photos }: { photos: Photo[] }) {
  const { lang, t } = useLang();
  const [selected, setSelected] = useState<Photo | null>(null);
  return (
    <div>
      <h1 className="page-title">{t.gallery.title}</h1>
      {photos.length === 0 && <div className="text-center py-16"><p className="text-stone-400 text-sm">{t.gallery.noPhotos}</p></div>}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((photo) => {
          const caption = lang==="tr" ? photo.caption_tr : photo.caption_ku;
          return (
            <div key={photo.id} onClick={() => setSelected(photo)}
              className="card group cursor-pointer overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="relative w-full aspect-square bg-stone-50">
                <Image src={photo.url} alt={caption??""} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              {(caption||photo.year) && (
                <div className="p-3">
                  {caption && <p className="text-xs text-stone-700 font-medium line-clamp-1">{caption}</p>}
                  {photo.year && <p className="text-xs text-stone-400 mt-0.5">{photo.year}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full aspect-video bg-stone-100">
              <Image src={selected.url} alt="" fill className="object-contain" />
            </div>
            <div className="p-5 flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-stone-900">{lang==="tr" ? selected.caption_tr : selected.caption_ku}</p>
                {selected.year && <p className="text-xs text-stone-400 mt-1">{selected.year}</p>}
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors">✕</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
