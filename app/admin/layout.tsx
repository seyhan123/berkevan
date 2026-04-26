"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const navItems = [
  { href: "/admin/dashboard",   icon: "📊", label: "Genel Bakış" },
  { href: "/admin/people",      icon: "👥", label: "Kişiler" },
  { href: "/admin/stories",     icon: "📖", label: "Hikayeler" },
  { href: "/admin/photos",      icon: "🖼️",  label: "Fotoğraflar" },
  { href: "/admin/places",      icon: "📍", label: "Yer İsimleri" },
  { href: "/admin/structures",  icon: "🏛️",  label: "Tarihi Yapılar" },
  { href: "/admin/cemetery",    icon: "🪦", label: "Mezarlık" },
  { href: "/admin/submissions", icon: "✉️",  label: "Gönderiler" },
  { href: "/admin/village",     icon: "🏘️",  label: "Köy Bilgisi" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-stone-50 flex">
      <aside className="w-52 bg-white border-r border-stone-100 flex flex-col flex-shrink-0 fixed h-screen shadow-sm">
        <div className="p-4 border-b border-stone-100">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2d5a3d] flex items-center justify-center text-base">🌳</div>
            <div>
              <p className="text-xs font-bold text-stone-900">Admin Paneli</p>
              <p className="text-xs text-stone-400">Köy Soy Ağacı</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, icon, label }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                className={active ? "admin-sidebar-link-active" : "admin-sidebar-link"}>
                <span className="text-sm w-5 text-center">{icon}</span>
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-stone-100 space-y-0.5">
          <Link href="/" className="admin-sidebar-link">
            <span className="text-sm w-5 text-center">↗</span>
            <span>Siteyi Görüntüle</span>
          </Link>
          <button onClick={handleLogout}
            className="admin-sidebar-link w-full text-left text-red-500 hover:text-red-700 hover:bg-red-50">
            <span className="text-sm w-5 text-center">→</span>
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-52 p-8 overflow-auto">{children}</main>
    </div>
  );
}
