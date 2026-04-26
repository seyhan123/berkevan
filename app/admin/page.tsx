"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError("E-posta veya şifre hatalı."); setLoading(false); }
    else { router.push("/admin/dashboard"); router.refresh(); }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#2d5a3d] flex items-center justify-center text-3xl mx-auto mb-4">🌳</div>
          <h1 className="text-2xl font-bold text-stone-900" style={{fontFamily:"'Libre Baskerville',serif"}}>Admin Girişi</h1>
          <p className="text-sm text-stone-500 mt-1">Köy Soy Ağacı Yönetim Paneli</p>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div><label className="label">E-posta</label><input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus /></div>
            <div><label className="label">Şifre</label><input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
            {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{error}</p>}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
        </div>
        <p className="text-center mt-4">
          <a href="/" className="text-xs text-stone-400 hover:text-stone-700 transition-colors">← Siteye Dön</a>
        </p>
      </div>
    </div>
  );
}
