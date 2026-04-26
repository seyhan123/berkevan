import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Person } from "@/lib/types";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient();

  const [
    { count: peopleCount },
    { count: storyCount },
    { count: photoCount },
    { data: recentPeople },
  ] = await Promise.all([
    supabase.from("people").select("*", { count: "exact", head: true }),
    supabase.from("stories").select("*", { count: "exact", head: true }),
    supabase.from("photos").select("*", { count: "exact", head: true }),
    supabase.from("people").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "Toplam Kişi", value: peopleCount ?? 0, href: "/admin/people", icon: "👥" },
    { label: "Toplam Hikaye", value: storyCount ?? 0, href: "/admin/stories", icon: "📜" },
    { label: "Toplam Fotoğraf", value: photoCount ?? 0, href: "/admin/photos", icon: "🖼️" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-8">Genel Bakış</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <div className="bg-white rounded-xl border border-stone-100 p-5 hover:border-amber-200 hover:shadow-sm transition-all">
              <div className="text-2xl mb-2">{s.icon}</div>
              <p className="text-3xl font-bold text-stone-800">{s.value}</p>
              <p className="text-sm text-stone-400 mt-1">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent people */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-stone-700">Son Eklenen Kişiler</h2>
          <Link href="/admin/people" className="text-xs text-amber-700 hover:underline">
            Tümünü gör →
          </Link>
        </div>
        <div className="space-y-2">
          {(recentPeople as Person[])?.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0"
            >
              <div>
                <span className="text-sm font-medium text-stone-800">{p.name}</span>
                {p.nickname && (
                  <span className="text-xs text-amber-700 ml-2">({p.nickname})</span>
                )}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${p.gender === "m" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"}`}>
                {p.gender === "m" ? "Erkek" : "Kadın"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link
          href="/admin/people"
          className="bg-amber-700 text-white rounded-xl p-4 hover:bg-amber-800 transition-colors"
        >
          <p className="font-semibold">+ Yeni Kişi Ekle</p>
          <p className="text-amber-200 text-xs mt-1">Soy ağacına üye ekle</p>
        </Link>
        <Link
          href="/admin/stories"
          className="bg-stone-700 text-white rounded-xl p-4 hover:bg-stone-800 transition-colors"
        >
          <p className="font-semibold">+ Hikaye Ekle</p>
          <p className="text-stone-300 text-xs mt-1">Tarih ve folklor</p>
        </Link>
      </div>
    </div>
  );
}
