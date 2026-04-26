"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { Story } from "@/lib/types";

const CATEGORIES = ["Tarih", "Folklor", "Savaş", "Göç", "Kültür", "Din"];

type Form = {
  title_tr: string; title_ku: string;
  content_tr: string; content_ku: string;
  category: string; year: string;
};

const EMPTY: Form = {
  title_tr: "", title_ku: "", content_tr: "", content_ku: "",
  category: "Tarih", year: "",
};

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [form, setForm] = useState<Form>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const supabase = createClient();

  async function fetchStories() {
    const { data } = await supabase.from("stories").select("*").order("year");
    setStories((data as Story[]) ?? []);
  }

  useEffect(() => { fetchStories(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title_tr.trim() || !form.content_tr.trim()) return;
    setLoading(true);

    const payload = {
      title_tr: form.title_tr,
      title_ku: form.title_ku || null,
      content_tr: form.content_tr,
      content_ku: form.content_ku || null,
      category: form.category,
      year: form.year ? parseInt(form.year) : null,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("stories").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("stories").insert(payload));
    }

    setLoading(false);
    if (error) { setMsg("Hata: " + error.message); return; }
    setMsg(editingId ? "Güncellendi!" : "Eklendi!");
    setForm(EMPTY); setEditingId(null);
    fetchStories();
    setTimeout(() => setMsg(""), 3000);
  }

  function startEdit(s: Story) {
    setEditingId(s.id);
    setForm({
      title_tr: s.title_tr, title_ku: s.title_ku ?? "",
      content_tr: s.content_tr, content_ku: s.content_ku ?? "",
      category: s.category ?? "Tarih", year: s.year ? String(s.year) : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu hikayeyi silmek istediğinize emin misiniz?")) return;
    await supabase.from("stories").delete().eq("id", id);
    fetchStories();
  }

  const inp = (field: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Hikaye Yönetimi</h1>

      <div className="bg-white rounded-xl border border-stone-100 p-6 mb-8">
        <h2 className="font-semibold text-stone-700 mb-4">
          {editingId ? "✏️ Hikayeyi Düzenle" : "➕ Yeni Hikaye Ekle"}
        </h2>

        {msg && (
          <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${msg.startsWith("Hata") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Kategori</label>
              <select className="input" value={form.category} onChange={inp("category")}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Yıl</label>
              <input className="input" type="number" value={form.year} onChange={inp("year")} placeholder="Örn: 1920" />
            </div>
          </div>

          <div>
            <label className="label">Başlık (Türkçe) *</label>
            <input className="input" value={form.title_tr} onChange={inp("title_tr")} required />
          </div>
          <div>
            <label className="label">Başlık (Kürtçe)</label>
            <input className="input" value={form.title_ku} onChange={inp("title_ku")} />
          </div>
          <div>
            <label className="label">İçerik (Türkçe) *</label>
            <textarea className="input" rows={5} value={form.content_tr} onChange={inp("content_tr")} required />
          </div>
          <div>
            <label className="label">İçerik (Kürtçe)</label>
            <textarea className="input" rows={5} value={form.content_ku} onChange={inp("content_ku")} />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Kaydediliyor..." : editingId ? "Güncelle" : "Kaydet"}
            </button>
            {editingId && (
              <button type="button" className="btn-secondary" onClick={() => { setForm(EMPTY); setEditingId(null); }}>
                İptal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-stone-100 p-6">
        <h2 className="font-semibold text-stone-700 mb-4">
          Kayıtlı Hikayeler ({stories.length})
        </h2>
        <div className="space-y-3">
          {stories.map((s) => (
            <div key={s.id} className="flex items-center justify-between py-3 border-b border-stone-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-stone-800">{s.title_tr}</p>
                <p className="text-xs text-stone-400">
                  {s.category} {s.year && `· ${s.year}`}
                  {s.title_ku && <span className="ml-2 text-amber-600">(KU: {s.title_ku})</span>}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(s)} className="btn-secondary text-xs py-1 px-3">Düzenle</button>
                <button onClick={() => handleDelete(s.id)} className="btn-danger">Sil</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
