"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { Person } from "@/lib/types";

type Form = {
  name: string; nickname: string; gender: "m" | "f";
  birth_year: string; death_year: string; photo_url: string;
  father_id: string; mother_id: string; spouse_id: string;
  destination_village: string; generation: string; notes: string;
};

const EMPTY: Form = {
  name: "", nickname: "", gender: "m", birth_year: "", death_year: "",
  photo_url: "", father_id: "", mother_id: "", spouse_id: "",
  destination_village: "", generation: "", notes: "",
};

export default function AdminPeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [form, setForm] = useState<Form>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");

  const supabase = createClient();

  async function fetchPeople() {
    const { data } = await supabase
      .from("people")
      .select("*")
      .order("generation")
      .order("birth_year");
    setPeople((data as Person[]) ?? []);
  }

  useEffect(() => { fetchPeople(); }, []);

  async function uploadPhoto(): Promise<string | null> {
    if (!uploadFile) return null;
    const ext = uploadFile.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("village-photos")
      .upload(path, uploadFile, { upsert: true });
    if (error) { setMsg("Fotoğraf yüklenemedi."); return null; }
    const { data } = supabase.storage.from("village-photos").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    setMsg("");

    let photoUrl = form.photo_url || null;
    if (uploadFile) {
      const uploaded = await uploadPhoto();
      if (uploaded) photoUrl = uploaded;
    }

    const payload = {
      name: form.name.trim(),
      nickname: form.nickname || null,
      gender: form.gender,
      birth_year: form.birth_year ? parseInt(form.birth_year) : null,
      death_year: form.death_year ? parseInt(form.death_year) : null,
      photo_url: photoUrl,
      father_id: form.father_id || null,
      mother_id: form.mother_id || null,
      spouse_id: form.spouse_id || null,
      destination_village: form.destination_village || null,
      generation: form.generation ? parseInt(form.generation) : 1,
      notes: form.notes || null,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("people").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("people").insert(payload));
    }

    setLoading(false);
    if (error) { setMsg("Hata: " + error.message); return; }
    setMsg(editingId ? "Güncellendi!" : "Eklendi!");
    setForm(EMPTY); setEditingId(null); setUploadFile(null);
    fetchPeople();
    setTimeout(() => setMsg(""), 3000);
  }

  function startEdit(p: Person) {
    setEditingId(p.id);
    setForm({
      name: p.name, nickname: p.nickname ?? "", gender: p.gender,
      birth_year: p.birth_year ? String(p.birth_year) : "",
      death_year: p.death_year ? String(p.death_year) : "",
      photo_url: p.photo_url ?? "", father_id: p.father_id ?? "",
      mother_id: p.mother_id ?? "", spouse_id: p.spouse_id ?? "",
      destination_village: p.destination_village ?? "",
      generation: p.generation ? String(p.generation) : "",
      notes: p.notes ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu kişiyi silmek istediğinize emin misiniz?")) return;
    await supabase.from("people").delete().eq("id", id);
    fetchPeople();
  }

  const males = people.filter((p) => p.gender === "m");
  const females = people.filter((p) => p.gender === "f");
  const filtered = people.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.nickname ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const inp = (field: keyof Form) => (
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }))
  );

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Kişi Yönetimi</h1>

      {/* Form */}
      <div className="bg-white rounded-xl border border-stone-100 p-6 mb-8">
        <h2 className="font-semibold text-stone-700 mb-4">
          {editingId ? "✏️ Kişiyi Düzenle" : "➕ Yeni Kişi Ekle"}
        </h2>

        {msg && (
          <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${msg.startsWith("Hata") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Ad Soyad *</label>
              <input className="input" value={form.name} onChange={inp("name")} required />
            </div>
            <div>
              <label className="label">Lakap</label>
              <input className="input" value={form.nickname} onChange={inp("nickname")} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Cinsiyet</label>
              <select className="input" value={form.gender} onChange={inp("gender")}>
                <option value="m">Erkek</option>
                <option value="f">Kadın</option>
              </select>
            </div>
            <div>
              <label className="label">Doğum Yılı</label>
              <input className="input" type="number" value={form.birth_year} onChange={inp("birth_year")} placeholder="1920" />
            </div>
            <div>
              <label className="label">Vefat Yılı</label>
              <input className="input" type="number" value={form.death_year} onChange={inp("death_year")} placeholder="(hayattaysa boş)" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Nesil (1, 2, 3...)</label>
              <input className="input" type="number" value={form.generation} onChange={inp("generation")} />
            </div>
            <div>
              <label className="label">Gittiği Köy (evlenen kadın)</label>
              <input className="input" value={form.destination_village} onChange={inp("destination_village")} placeholder="Örn: Yeşiltepe Köyü" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Baba</label>
              <select className="input" value={form.father_id} onChange={inp("father_id")}>
                <option value="">Seçiniz</option>
                {males.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Anne</label>
              <select className="input" value={form.mother_id} onChange={inp("mother_id")}>
                <option value="">Seçiniz</option>
                {females.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Eş</label>
              <select className="input" value={form.spouse_id} onChange={inp("spouse_id")}>
                <option value="">Seçiniz</option>
                {people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          {/* Photo */}
          <div>
            <label className="label">Fotoğraf</label>
            <div className="flex gap-2 items-center">
              <input
                className="input"
                placeholder="Fotoğraf URL yapıştırın..."
                value={form.photo_url}
                onChange={inp("photo_url")}
              />
              <span className="text-stone-400 text-xs whitespace-nowrap">veya</span>
              <input
                type="file"
                accept="image/*"
                className="text-xs text-stone-600"
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          <div>
            <label className="label">Notlar</label>
            <textarea className="input" rows={2} value={form.notes} onChange={inp("notes")} />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Kaydediliyor..." : editingId ? "Güncelle" : "Kaydet"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => { setForm(EMPTY); setEditingId(null); }}
              >
                İptal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-stone-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-stone-700">
            Kayıtlı Kişiler ({people.length})
          </h2>
          <input
            className="input w-48 text-sm"
            placeholder="Ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between py-2.5 border-b border-stone-50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-1.5 h-8 rounded-full flex-shrink-0 ${p.gender === "m" ? "bg-blue-300" : "bg-pink-300"}`}
                />
                <div>
                  <p className="text-sm font-medium text-stone-800">{p.name}</p>
                  <p className="text-xs text-stone-400">
                    {p.nickname && <span className="text-amber-600 mr-2">{p.nickname}</span>}
                    {p.birth_year && <span>{p.birth_year} – {p.death_year ?? "•"}</span>}
                    {p.generation && <span className="ml-2 text-stone-300">Nesil {p.generation}</span>}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(p)}
                  className="btn-secondary text-xs py-1 px-3"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="btn-danger"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
