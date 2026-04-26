"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { VillageInfo } from "@/lib/types";

type Form = {
  name: string; description_tr: string; description_ku: string;
  important_info_tr: string; important_info_ku: string; founded: string;
};

export default function AdminVillagePage() {
  const [form, setForm] = useState<Form>({
    name: "", description_tr: "", description_ku: "",
    important_info_tr: "", important_info_ku: "", founded: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const supabase = createClient();

  useEffect(() => {
    supabase.from("village_info").select("*").eq("id", 1).single().then(({ data }) => {
      if (data) {
        const v = data as VillageInfo;
        setForm({
          name: v.name ?? "",
          description_tr: v.description_tr ?? "",
          description_ku: v.description_ku ?? "",
          important_info_tr: v.important_info_tr ?? "",
          important_info_ku: v.important_info_ku ?? "",
          founded: v.founded ?? "",
        });
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsg("");

    const { error } = await supabase.from("village_info").update({
      name: form.name,
      description_tr: form.description_tr || null,
      description_ku: form.description_ku || null,
      important_info_tr: form.important_info_tr || null,
      important_info_ku: form.important_info_ku || null,
      founded: form.founded || null,
      updated_at: new Date().toISOString(),
    }).eq("id", 1);

    setLoading(false);
    if (error) { setMsg("Hata: " + error.message); return; }
    setMsg("Köy bilgisi güncellendi!");
    setTimeout(() => setMsg(""), 3000);
  }

  const inp = (field: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Köy Bilgisi</h1>

      <div className="bg-white rounded-xl border border-stone-100 p-6">
        {msg && (
          <div className={`mb-5 px-4 py-2 rounded-lg text-sm ${msg.startsWith("Hata") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Köy Adı *</label>
              <input className="input" value={form.name} onChange={inp("name")} required />
            </div>
            <div>
              <label className="label">Kuruluş Yılı</label>
              <input className="input" value={form.founded} onChange={inp("founded")} placeholder="~1800" />
            </div>
          </div>

          <div>
            <label className="label">Köy Açıklaması (Türkçe)</label>
            <textarea className="input" rows={4} value={form.description_tr} onChange={inp("description_tr")} placeholder="Köyün kısa tarihçesi..." />
          </div>
          <div>
            <label className="label">Köy Açıklaması (Kürtçe)</label>
            <textarea className="input" rows={4} value={form.description_ku} onChange={inp("description_ku")} />
          </div>

          <div>
            <label className="label">Önemli Bilgiler (Türkçe)</label>
            <textarea className="input" rows={4} value={form.important_info_tr} onChange={inp("important_info_tr")} placeholder="Köyle ilgili önemli notlar, tarihi bilgiler..." />
          </div>
          <div>
            <label className="label">Önemli Bilgiler (Kürtçe)</label>
            <textarea className="input" rows={4} value={form.important_info_ku} onChange={inp("important_info_ku")} />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </form>
      </div>
    </div>
  );
}
