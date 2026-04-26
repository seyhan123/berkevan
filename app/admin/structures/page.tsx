"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { HistoricStructure } from "@/lib/types";

const TYPES = ["cami", "çeşme", "değirmen", "ev", "ahır", "köprü", "okul", "diğer"];
const STATUSES = ["ayakta", "harabe", "yıkılmış"];

type Form = { name_tr: string; name_ku: string; type: string; description_tr: string; description_ku: string; photo_url: string; year_built: string; year_demolished: string; status: string; };
const EMPTY: Form = { name_tr: "", name_ku: "", type: "ev", description_tr: "", description_ku: "", photo_url: "", year_built: "", year_demolished: "", status: "ayakta" };

export default function AdminStructuresPage() {
  const [items, setItems] = useState<HistoricStructure[]>([]);
  const [form, setForm] = useState<Form>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const supabase = createClient();

  async function fetchItems() {
    const { data } = await supabase.from("historic_structures").select("*").order("type");
    setItems((data as HistoricStructure[]) ?? []);
  }
  useEffect(() => { fetchItems(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name_tr.trim()) return;
    setLoading(true);
    let photoUrl = form.photo_url || null;
    if (uploadFile) {
      const ext = uploadFile.name.split(".").pop();
      const path = `structures/${Date.now()}.${ext}`;
      await supabase.storage.from("village-photos").upload(path, uploadFile);
      photoUrl = supabase.storage.from("village-photos").getPublicUrl(path).data.publicUrl;
    }
    const payload = { name_tr: form.name_tr, name_ku: form.name_ku || null, type: form.type, description_tr: form.description_tr || null, description_ku: form.description_ku || null, photo_url: photoUrl, year_built: form.year_built || null, year_demolished: form.year_demolished || null, status: form.status };
    let error;
    if (editingId) ({ error } = await supabase.from("historic_structures").update(payload).eq("id", editingId));
    else ({ error } = await supabase.from("historic_structures").insert(payload));
    setLoading(false);
    if (error) { setMsg("Hata: " + error.message); return; }
    setMsg(editingId ? "Güncellendi!" : "Eklendi!"); setForm(EMPTY); setEditingId(null); setUploadFile(null);
    fetchItems(); setTimeout(() => setMsg(""), 3000);
  }

  const inp = (f: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((prev) => ({ ...prev, [f]: e.target.value }));

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Tarihi Yapı Yönetimi</h1>
      <div className="bg-white rounded-xl border border-stone-100 p-6 mb-6">
        <h2 className="font-semibold text-stone-700 mb-4">{editingId ? "✏️ Düzenle" : "➕ Yeni Yapı Ekle"}</h2>
        {msg && <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${msg.startsWith("Hata") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{msg}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Ad (Türkçe) *</label><input className="input" value={form.name_tr} onChange={inp("name_tr")} required /></div>
            <div><label className="label">Ad (Kürtçe)</label><input className="input" value={form.name_ku} onChange={inp("name_ku")} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="label">Tür</label><select className="input" value={form.type} onChange={inp("type")}>{TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
            <div><label className="label">Durum</label><select className="input" value={form.status} onChange={inp("status")}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label className="label">İnşa Yılı</label><input className="input" value={form.year_built} onChange={inp("year_built")} placeholder="1850" /></div>
          </div>
          <div><label className="label">Açıklama (Türkçe)</label><textarea className="input" rows={3} value={form.description_tr} onChange={inp("description_tr")} /></div>
          <div><label className="label">Açıklama (Kürtçe)</label><textarea className="input" rows={2} value={form.description_ku} onChange={inp("description_ku")} /></div>
          <div>
            <label className="label">Fotoğraf</label>
            <input type="file" accept="image/*" className="block text-sm text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-stone-100" onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)} />
            <input className="input mt-2" placeholder="veya URL yapıştırın" value={form.photo_url} onChange={inp("photo_url")} />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Kaydediliyor..." : editingId ? "Güncelle" : "Kaydet"}</button>
            {editingId && <button type="button" className="btn-secondary" onClick={() => { setForm(EMPTY); setEditingId(null); }}>İptal</button>}
          </div>
        </form>
      </div>
      <div className="bg-white rounded-xl border border-stone-100 p-6">
        <h2 className="font-semibold text-stone-700 mb-4">Kayıtlı Yapılar ({items.length})</h2>
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2.5 border-b border-stone-50 last:border-0">
            <div>
              <span className="font-medium text-stone-800 text-sm">{item.name_tr}</span>
              <span className="text-xs text-stone-400 ml-2">{item.type}</span>
              <span className={`text-xs ml-2 px-2 py-0.5 rounded-full ${item.status === "ayakta" ? "bg-green-50 text-green-700" : item.status === "harabe" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"}`}>{item.status}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingId(item.id); setForm({ name_tr: item.name_tr, name_ku: item.name_ku ?? "", type: item.type ?? "ev", description_tr: item.description_tr ?? "", description_ku: item.description_ku ?? "", photo_url: item.photo_url ?? "", year_built: item.year_built ?? "", year_demolished: item.year_demolished ?? "", status: item.status ?? "ayakta" }); }} className="btn-secondary text-xs py-1 px-3">Düzenle</button>
              <button onClick={async () => { if (confirm("Sil?")) { await supabase.from("historic_structures").delete().eq("id", item.id); fetchItems(); } }} className="btn-danger">Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
