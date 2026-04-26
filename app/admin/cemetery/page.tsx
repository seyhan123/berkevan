"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { CemeteryRecord, Person } from "@/lib/types";

type Form = { person_name: string; nickname: string; birth_year: string; death_year: string; gravestone_photo_url: string; location_desc: string; person_id: string; notes: string; };
const EMPTY: Form = { person_name: "", nickname: "", birth_year: "", death_year: "", gravestone_photo_url: "", location_desc: "", person_id: "", notes: "" };

export default function AdminCemeteryPage() {
  const [records, setRecords] = useState<CemeteryRecord[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [form, setForm] = useState<Form>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const supabase = createClient();

  async function fetchData() {
    const [{ data: recs }, { data: ppl }] = await Promise.all([
      supabase.from("cemetery_records").select("*").order("death_year", { ascending: false }),
      supabase.from("people").select("id,name").order("name"),
    ]);
    setRecords((recs as CemeteryRecord[]) ?? []);
    setPeople((ppl as Person[]) ?? []);
  }
  useEffect(() => { fetchData(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.person_name.trim()) return;
    setLoading(true);
    let photoUrl = form.gravestone_photo_url || null;
    if (uploadFile) {
      const ext = uploadFile.name.split(".").pop();
      const path = `cemetery/${Date.now()}.${ext}`;
      await supabase.storage.from("village-photos").upload(path, uploadFile);
      photoUrl = supabase.storage.from("village-photos").getPublicUrl(path).data.publicUrl;
    }
    const payload = { person_name: form.person_name, nickname: form.nickname || null, birth_year: form.birth_year ? parseInt(form.birth_year) : null, death_year: form.death_year ? parseInt(form.death_year) : null, gravestone_photo_url: photoUrl, location_desc: form.location_desc || null, person_id: form.person_id || null, notes: form.notes || null };
    let error;
    if (editingId) ({ error } = await supabase.from("cemetery_records").update(payload).eq("id", editingId));
    else ({ error } = await supabase.from("cemetery_records").insert(payload));
    setLoading(false);
    if (error) { setMsg("Hata: " + error.message); return; }
    setMsg(editingId ? "Güncellendi!" : "Eklendi!"); setForm(EMPTY); setEditingId(null); setUploadFile(null);
    fetchData(); setTimeout(() => setMsg(""), 3000);
  }

  const inp = (f: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((prev) => ({ ...prev, [f]: e.target.value }));

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Mezarlık Arşivi Yönetimi</h1>
      <div className="bg-white rounded-xl border border-stone-100 p-6 mb-6">
        <h2 className="font-semibold text-stone-700 mb-4">{editingId ? "✏️ Düzenle" : "➕ Yeni Kayıt"}</h2>
        {msg && <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${msg.startsWith("Hata") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{msg}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Ad Soyad *</label><input className="input" value={form.person_name} onChange={inp("person_name")} required /></div>
            <div><label className="label">Lakap</label><input className="input" value={form.nickname} onChange={inp("nickname")} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Doğum Yılı</label><input className="input" type="number" value={form.birth_year} onChange={inp("birth_year")} /></div>
            <div><label className="label">Vefat Yılı</label><input className="input" type="number" value={form.death_year} onChange={inp("death_year")} /></div>
          </div>
          <div>
            <label className="label">Soy Ağacındaki Kişi (bağlantı)</label>
            <select className="input" value={form.person_id} onChange={inp("person_id")}>
              <option value="">Seçiniz</option>
              {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div><label className="label">Mezar Konumu</label><input className="input" value={form.location_desc} onChange={inp("location_desc")} placeholder="Örn: Kuzey bölüm, 3. sıra" /></div>
          <div>
            <label className="label">Mezartaşı Fotoğrafı</label>
            <input type="file" accept="image/*" className="block text-sm text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-stone-100" onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)} />
            <input className="input mt-2" placeholder="veya URL yapıştırın" value={form.gravestone_photo_url} onChange={inp("gravestone_photo_url")} />
          </div>
          <div><label className="label">Notlar</label><textarea className="input" rows={2} value={form.notes} onChange={inp("notes")} /></div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Kaydediliyor..." : editingId ? "Güncelle" : "Kaydet"}</button>
            {editingId && <button type="button" className="btn-secondary" onClick={() => { setForm(EMPTY); setEditingId(null); }}>İptal</button>}
          </div>
        </form>
      </div>
      <div className="bg-white rounded-xl border border-stone-100 p-6">
        <h2 className="font-semibold text-stone-700 mb-4">Kayıtlar ({records.length})</h2>
        {records.map((r) => (
          <div key={r.id} className="flex items-center justify-between py-2.5 border-b border-stone-50 last:border-0">
            <div>
              <span className="font-medium text-stone-800 text-sm">{r.person_name}</span>
              {r.nickname && <span className="text-xs text-amber-600 italic ml-2">"{r.nickname}"</span>}
              <span className="text-xs text-stone-400 ml-2">{r.birth_year ?? "?"} — {r.death_year ?? "?"}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingId(r.id); setForm({ person_name: r.person_name, nickname: r.nickname ?? "", birth_year: r.birth_year ? String(r.birth_year) : "", death_year: r.death_year ? String(r.death_year) : "", gravestone_photo_url: r.gravestone_photo_url ?? "", location_desc: r.location_desc ?? "", person_id: r.person_id ?? "", notes: r.notes ?? "" }); }} className="btn-secondary text-xs py-1 px-3">Düzenle</button>
              <button onClick={async () => { if (confirm("Sil?")) { await supabase.from("cemetery_records").delete().eq("id", r.id); fetchData(); } }} className="btn-danger">Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
