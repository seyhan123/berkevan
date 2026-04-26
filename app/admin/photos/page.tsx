"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import type { Photo } from "@/lib/types";

type Form = {
  caption_tr: string; caption_ku: string; year: string; url: string;
};

const EMPTY: Form = { caption_tr: "", caption_ku: "", year: "", url: "" };

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [form, setForm] = useState<Form>(EMPTY);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const supabase = createClient();

  async function fetchPhotos() {
    const { data } = await supabase.from("photos").select("*").order("created_at", { ascending: false });
    setPhotos((data as Photo[]) ?? []);
  }

  useEffect(() => { fetchPhotos(); }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setForm((f) => ({ ...f, url: "" }));
  }

  async function uploadToStorage(file: File): Promise<string | null> {
    const ext = file.name.split(".").pop();
    const path = `gallery/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("village-photos").upload(path, file);
    if (error) { setMsg("Yükleme hatası: " + error.message); return null; }
    return supabase.storage.from("village-photos").getPublicUrl(path).data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.url && !uploadFile) { setMsg("Fotoğraf seçin veya URL girin."); return; }
    setLoading(true); setMsg("");

    let url = form.url;
    let isStorage = false;

    if (uploadFile) {
      const uploaded = await uploadToStorage(uploadFile);
      if (!uploaded) { setLoading(false); return; }
      url = uploaded;
      isStorage = true;
    }

    const { error } = await supabase.from("photos").insert({
      url,
      caption_tr: form.caption_tr || null,
      caption_ku: form.caption_ku || null,
      year: form.year ? parseInt(form.year) : null,
      is_storage: isStorage,
    });

    setLoading(false);
    if (error) { setMsg("Hata: " + error.message); return; }
    setMsg("Fotoğraf eklendi!");
    setForm(EMPTY); setUploadFile(null); setPreviewUrl("");
    fetchPhotos();
    setTimeout(() => setMsg(""), 3000);
  }

  async function handleDelete(photo: Photo) {
    if (!confirm("Bu fotoğrafı silmek istediğinize emin misiniz?")) return;
    if (photo.is_storage) {
      const path = photo.url.split("/village-photos/")[1];
      if (path) await supabase.storage.from("village-photos").remove([path]);
    }
    await supabase.from("photos").delete().eq("id", photo.id);
    fetchPhotos();
  }

  const inp = (field: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Fotoğraf Yönetimi</h1>

      <div className="bg-white rounded-xl border border-stone-100 p-6 mb-8">
        <h2 className="font-semibold text-stone-700 mb-4">➕ Fotoğraf Ekle</h2>

        {msg && (
          <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${msg.startsWith("Hata") || msg.startsWith("Yükleme") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Upload or URL */}
          <div>
            <label className="label">Fotoğraf Yükle</label>
            <input
              type="file"
              accept="image/*"
              className="block text-sm text-stone-600 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200"
              onChange={handleFileChange}
            />
            {previewUrl && (
              <div className="mt-2 relative w-32 h-24 rounded-lg overflow-hidden border border-amber-100">
                <Image src={previewUrl} alt="Önizleme" fill className="object-cover" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px bg-stone-100 flex-1" />
            <span className="text-xs text-stone-400">veya URL girin</span>
            <div className="h-px bg-stone-100 flex-1" />
          </div>

          <div>
            <input
              className="input"
              placeholder="https://example.com/foto.jpg"
              value={form.url}
              onChange={(e) => {
                inp("url")(e);
                setUploadFile(null);
                setPreviewUrl("");
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Açıklama (Türkçe)</label>
              <input className="input" value={form.caption_tr} onChange={inp("caption_tr")} placeholder="Köy meydanı, 1970" />
            </div>
            <div>
              <label className="label">Açıklama (Kürtçe)</label>
              <input className="input" value={form.caption_ku} onChange={inp("caption_ku")} />
            </div>
          </div>

          <div>
            <label className="label">Yıl</label>
            <input className="input" type="number" value={form.year} onChange={inp("year")} placeholder="1970" />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Yükleniyor..." : "Ekle"}
          </button>
        </form>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-xl border border-stone-100 p-6">
        <h2 className="font-semibold text-stone-700 mb-4">
          Galeri ({photos.length} fotoğraf)
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group rounded-lg overflow-hidden border border-stone-100">
              <div className="relative w-full aspect-square">
                <Image src={photo.url} alt={photo.caption_tr ?? ""} fill className="object-cover" />
              </div>
              <div className="p-2 border-t border-stone-50">
                <p className="text-xs text-stone-600 truncate">{photo.caption_tr}</p>
                {photo.year && <p className="text-xs text-stone-400">{photo.year}</p>}
              </div>
              <button
                onClick={() => handleDelete(photo)}
                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
