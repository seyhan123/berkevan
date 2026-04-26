"use client";
import { useLang } from "@/contexts/LanguageContext";
import type { Story } from "@/lib/types";

const CAT_STYLE: Record<string,string> = {
  Tarih:"bg-blue-50 text-blue-700", Dîrok:"bg-blue-50 text-blue-700",
  Folklor:"bg-amber-50 text-amber-700", Savaş:"bg-red-50 text-red-600",
  Şer:"bg-red-50 text-red-600", Göç:"bg-emerald-50 text-emerald-700",
  Koç:"bg-emerald-50 text-emerald-700", Kültür:"bg-purple-50 text-purple-700",
  Çand:"bg-purple-50 text-purple-700", Din:"bg-orange-50 text-orange-700",
};

export default function HistoryClient({ stories }: { stories: Story[] }) {
  const { lang, t } = useLang();
  return (
    <div>
      <h1 className="page-title">{t.history.title}</h1>
      {stories.length === 0 && <div className="text-center py-16"><p className="text-stone-400 text-sm">{t.history.noStories}</p></div>}
      <div className="space-y-4">
        {stories.map((story, i) => {
          const title = lang==="tr" ? story.title_tr : (story.title_ku||story.title_tr);
          const content = lang==="tr" ? story.content_tr : (story.content_ku||story.content_tr);
          return (
            <div key={story.id} className="card p-6 border-l-4 border-[#2d5a3d]/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {story.category && <span className={`badge ${CAT_STYLE[story.category]??"bg-stone-100 text-stone-600"}`}>{story.category}</span>}
                  {story.year && <span className="text-xs text-stone-400">{story.year}</span>}
                </div>
                <span className="text-xs text-stone-200 font-mono">#{String(i+1).padStart(2,"0")}</span>
              </div>
              <h2 className="text-lg font-bold text-stone-900 mb-3" style={{fontFamily:"'Libre Baskerville',serif"}}>{title}</h2>
              <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
