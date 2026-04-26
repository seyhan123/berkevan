"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import type { InfoSubmission } from "@/lib/types";

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<InfoSubmission[]>([]);
  const [selected, setSelected] = useState<InfoSubmission | null>(null);
  const [filter, setFilter] = useState("beklemede");
  const supabase = createClient();

  async function fetchData() {
    const { data } = await supabase.from("info_submissions").select("*").order("created_at", { ascending: false });
    setSubmissions((data as InfoSubmission[]) ?? []);
  }
  useEffect(() => { fetchData(); }, []);

  async function updateStatus(id: string, status: string) {
    await supabase.from("info_submissions").update({ status }).eq("id", id);
    fetchData();
    if (selected?.id === id) setSelected((s) => s ? { ...s, status } : null);
  }

  const filtered = filter === "tümü" ? submissions : submissions.filter(s => s.status === filter);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-stone-800 mb-2">Gelen Bilgi Gönderimleri</h1>
      <p className="text-stone-500 text-sm mb-6">Kullanıcıların "Bilgi Gönder" formuyla ilettiği mesajlar.</p>

      <div className="flex gap-2 mb-6">
        {["beklemede", "incelendi", "kabul edildi", "tümü"].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={filter === s ? "filter-btn-active" : "filter-btn"}>
            {s} {s !== "tümü" && <span className="ml-1">({submissions.filter(x => x.status === s).length})</span>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-5">
        <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
          {filtered.length === 0 && <p className="text-stone-400 text-sm p-6">Gönderim yok.</p>}
          {filtered.map((s) => (
            <div key={s.id}
              className={`flex items-start gap-3 p-4 border-b border-stone-50 last:border-0 cursor-pointer hover:bg-stone-50 transition-colors ${selected?.id === s.id ? "bg-[#2d5a3d]/5" : ""}`}
              onClick={() => setSelected(s)}>
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${s.status === "beklemede" ? "bg-amber-400" : s.status === "kabul edildi" ? "bg-green-500" : "bg-stone-300"}`} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-stone-800 text-sm truncate">{s.subject}</p>
                <p className="text-xs text-stone-400 mt-0.5">
                  {s.submitter_name ?? "Anonim"} · {new Date(s.created_at).toLocaleDateString("tr-TR")}
                </p>
                <p className="text-xs text-stone-500 mt-1 line-clamp-1">{s.message}</p>
              </div>
            </div>
          ))}
        </div>

        {selected ? (
          <div className="bg-white rounded-xl border border-stone-100 p-5 h-fit sticky top-20">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-stone-900 text-base leading-tight">{selected.subject}</h3>
              <button onClick={() => setSelected(null)} className="text-stone-400 hover:text-stone-600 text-lg ml-2">✕</button>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex gap-3"><span className="text-stone-400 w-20 flex-shrink-0">Gönderen</span><span className="text-stone-800">{selected.submitter_name ?? "Anonim"}</span></div>
              <div className="flex gap-3"><span className="text-stone-400 w-20 flex-shrink-0">İletişim</span><span className="text-stone-800">{selected.submitter_contact ?? "—"}</span></div>
              <div className="flex gap-3"><span className="text-stone-400 w-20 flex-shrink-0">Tarih</span><span className="text-stone-800">{new Date(selected.created_at).toLocaleDateString("tr-TR")}</span></div>
            </div>
            <div className="bg-stone-50 rounded-xl p-3 mb-4">
              <p className="text-stone-700 text-sm leading-relaxed">{selected.message}</p>
            </div>
            {selected.photo_url && (
              <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4 border border-stone-100">
                <Image src={selected.photo_url} alt="" fill className="object-cover" />
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => updateStatus(selected.id, "kabul edildi")} className="btn-primary text-xs py-1.5 flex-1">✓ Kabul Et</button>
              <button onClick={() => updateStatus(selected.id, "incelendi")} className="btn-secondary text-xs py-1.5 flex-1">İncelendi</button>
            </div>
          </div>
        ) : (
          <div className="bg-stone-50 rounded-xl border border-dashed border-stone-200 p-8 text-center">
            <p className="text-stone-400 text-sm">Detay görmek için bir gönderi seçin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
