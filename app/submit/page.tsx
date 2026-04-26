"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useLang } from "@/contexts/LanguageContext";

export default function SubmitPage() {
  const { lang } = useLang();
  const [form, setForm] = useState({ name: "", contact: "", subject: "", message: "" });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.subject || !form.message) return;
    setLoading(true); setError("");

    let photoUrl: string | null = null;
    if (file) {
      const ext = file.name.split(".").pop();
      const path = `submissions/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("village-photos")
        .upload(path, file);
      if (!uploadError) {
        photoUrl = supabase.storage.from("village-photos").getPublicUrl(path).data.publicUrl;
      }
    }

    const { error: insertError } = await supabase.from("info_submissions").insert({
      submitter_name: form.name || null,
      submitter_contact: form.contact || null,
      subject: form.subject,
      message: form.message,
      photo_url: photoUrl,
    });

    setLoading(false);
    if (insertError) { setError(lang === "tr" ? "Gönderim başarısız." : "Şandina nexweş bû."); return; }
    setSent(true);
  }

  const inp = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  if (sent) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-5xl mb-4">✉️</div>
        <h2 className="text-2xl font-bold text-stone-900 mb-3" style={{ fontFamily: "'Libre Baskerville',serif" }}>
          {lang === "tr" ? "Teşekkürler!" : "Spas!"}
        </h2>
        <p className="text-stone-600 mb-6">
          {lang === "tr"
            ? "Bilginiz bize ulaştı. En kısa sürede inceleyeceğiz."
            : "Agahiya we gihîşt me. Em ê zû binêrin."}
        </p>
        <button onClick={() => { setSent(false); setForm({ name: "", contact: "", subject: "", message: "" }); }}
          className="btn-primary">
          {lang === "tr" ? "Yeni Bilgi Gönder" : "Agahiya Nû Bişîne"}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="page-title">{lang === "tr" ? "Bilgi Gönder" : "Agahî Bişîne"}</h1>
      <p className="page-subtitle">
        {lang === "tr"
          ? "Soy ağacındaki eksikleri tamamlamak için fotoğraf veya bilgi gönderin."
          : "Ji bo dagirtina kêmasiyên dara malbatê, wêne an agahî bişînin."}
      </p>

      <div className="card p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">{lang === "tr" ? "Adınız (isteğe bağlı)" : "Navê we (bijartî)"}</label>
              <input className="input" value={form.name} onChange={inp("name")}
                placeholder={lang === "tr" ? "Mehmet Demir" : "Navê xwe"} />
            </div>
            <div>
              <label className="label">{lang === "tr" ? "İletişim (isteğe bağlı)" : "Têkilî (bijartî)"}</label>
              <input className="input" value={form.contact} onChange={inp("contact")}
                placeholder={lang === "tr" ? "Telefon veya e-posta" : "Têlefon an e-posta"} />
            </div>
          </div>

          <div>
            <label className="label">{lang === "tr" ? "Konu *" : "Mijar *"}</label>
            <input className="input" value={form.subject} onChange={inp("subject")} required
              placeholder={lang === "tr" ? "Örn: Hasan Demir'in doğum yılı hakkında" : "Mînak: Derbarê sala jidayikbûna Hasan Demir"} />
          </div>

          <div>
            <label className="label">{lang === "tr" ? "Bilgi / Mesaj *" : "Agahî / Peyam *"}</label>
            <textarea className="input min-h-[120px]" value={form.message} onChange={inp("message")} required
              placeholder={lang === "tr"
                ? "Eklemek istediğiniz bilgiyi buraya yazın..."
                : "Agahiya ku hûn dixwazin zêde bikin binivîsin..."} />
          </div>

          <div>
            <label className="label">{lang === "tr" ? "Fotoğraf (isteğe bağlı)" : "Wêne (bijartî)"}</label>
            <input type="file" accept="image/*"
              className="block text-sm text-stone-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#2d5a3d]/10 file:text-[#2d5a3d] hover:file:bg-[#2d5a3d]/20 transition-colors"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <p className="text-xs text-stone-400 mt-1.5">
              {lang === "tr" ? "Fotoğraf, belge veya mezartaşı resmi yükleyebilirsiniz." : "Hûn dikarin wêne, belge an wêneyek kevirê gorî bar bikin."}
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading
                ? (lang === "tr" ? "Gönderiliyor..." : "Tê şandin...")
                : (lang === "tr" ? "Gönder" : "Bişîne")}
            </button>
            <p className="text-xs text-stone-400 self-center">
              {lang === "tr" ? "Bilgileriniz admin tarafından incelenecektir." : "Agahiyên we dê ji hêla admin ve werin vekolîn."}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
