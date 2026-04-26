"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { PlaceName } from "@/lib/types";

const CATS = ["tarla", "tepe", "dere", "mevki", "orman", "yol"];

type Form = { name: string; description_tr: string; description_ku: string; category: string; lat: string; lng: string; };
const EMPTY: Form = { name: "", description_tr: "", description_ku: "", category: "mevki", lat: "", lng: "" };

export default function AdminPlacesPage() {
  const [places, setPlaces] = useState<PlaceName[]>([]);
  const [form, setForm] = useState<Form>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const supabase = createClient();

  async function fetchPlaces() {
    const { data } = await supabase.from("place_names").select("*").order("category");
    setPlaces((data as PlaceName[]) ?? []);
  }
  useEffect(() => { fetchPlaces(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    const payload = {
      name: form.name, description_tr: form.description_tr || null, description_ku: form.description_ku || null,
      category: form.category, lat: form.lat ? parseFloat(form.lat) : null, lng: form.lng ? parseFloat(form.lng) : null,
    };
    let error;
    if (editingId) ({ error } = await supabase.from("place_names").update(payload).eq("id", editingId));
    else ({ error } = await supabase.from("place_names").insert(payload));
    setLoading(false);
    if (error) { setMsg("Hata: " + error.message); return; }
    setMsg(editingId ? "Güncellendi!" : "Eklendi!"); setForm(EMPTY); setEditingId(null);
    fetchPlaces(); setTimeout(() => setMsg(""), 3000);
  }

  const inp = (f: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((prev) => ({ ...prev, [f]: e.target.value }));

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Yer İsimleri Yönetimi</h1>
      <div className="bg-white rounded-xl border border-stone-100 p-6 mb-6">
        <h2 className="font-semibold text-stone-700 mb-4">{editingId ? "✏️ Düzenle" : "➕ Yeni Yer Adı"}</h2>
        {msg && <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${msg.startsWith("Hata") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{msg}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Yer Adı *</label><input className="input" value={form.name} onChange={inp("name")} required /></div>
            <div>
              <label className="label">Kategori</label>
              <select className="input" value={form.category} onChange={inp("category")}>{CATS.map(c => <option key={c}>{c}</option>)}</select>
            </div>
          </div>
          <div><label className="label">Açıklama (Türkçe)</label><textarea className="input" rows={2} value={form.description_tr} onChange={inp("description_tr")} /></div>
          <div><label className="label">Açıklama (Kürtçe)</label><textarea className="input" rows={2} value={form.description_ku} onChange={inp("description_ku")} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Enlem (lat)</label><input className="input" type="number" step="0.0000001" value={form.lat} onChange={inp("lat")} placeholder="39.123456" /></div>
            <div><label className="label">Boylam (lng)</label><input className="input" type="number" step="0.0000001" value={form.lng} onChange={inp("lng")} placeholder="35.123456" /></div>
          </div>
          <p className="text-xs text-stone-400">💡 Koordinat bulmak için Google Maps'te yere sağ tıklayın.</p>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Kaydediliyor..." : editingId ? "Güncelle" : "Kaydet"}</button>
            {editingId && <button type="button" className="btn-secondary" onClick={() => { setForm(EMPTY); setEditingId(null); }}>İptal</button>}
          </div>
        </form>
      </div>
      <div className="bg-white rounded-xl border border-stone-100 p-6">
        <h2 className="font-semibold text-stone-700 mb-4">Kayıtlı Yer İsimleri ({places.length})</h2>
        {places.map((p) => (
          <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-stone-50 last:border-0">
            <div>
              <span className="font-medium text-stone-800 text-sm">{p.name}</span>
              <span className="text-xs text-stone-400 ml-2">{p.category}</span>
              {p.lat && <span className="text-xs text-stone-300 ml-2">📍</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingId(p.id); setForm({ name: p.name, description_tr: p.description_tr ?? "", description_ku: p.description_ku ?? "", category: p.category ?? "mevki", lat: p.lat ? String(p.lat) : "", lng: p.lng ? String(p.lng) : "" }); }} className="btn-secondary text-xs py-1 px-3">Düzenle</button>
              <button onClick={async () => { if (confirm("Sil?")) { await supabase.from("place_names").delete().eq("id", p.id); fetchPlaces(); } }} className="btn-danger">Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
