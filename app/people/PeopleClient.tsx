"use client";
import { useState, useMemo } from "react";
import { useLang } from "@/contexts/LanguageContext";
import PersonCard from "@/components/PersonCard";
import type { Person } from "@/lib/types";

type GF = "all"|"m"|"f";
type AF = "all"|"alive"|"dead";

export default function PeopleClient({ people }: { people: Person[] }) {
  const { t } = useLang();
  const [search, setSearch] = useState("");
  const [gF, setGF] = useState<GF>("all");
  const [aF, setAF] = useState<AF>("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return people.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !(p.nickname??"").toLowerCase().includes(q)) return false;
      if (gF !== "all" && p.gender !== gF) return false;
      if (aF === "alive" && p.death_year) return false;
      if (aF === "dead" && !p.death_year) return false;
      return true;
    });
  }, [people, search, gF, aF]);

  return (
    <div>
      <h1 className="page-title">{t.people.title}</h1>
      <p className="page-subtitle">{people.length} kişi kayıtlı</p>
      <div className="relative mb-5">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm">🔍</span>
        <input type="search" className="input pl-10" placeholder={t.people.search} value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="flex items-center gap-2 flex-wrap mb-8">
        {(["all","m","f"] as GF[]).map((g) => (
          <button key={g} onClick={() => setGF(g)} className={g===gF?"filter-btn-active":"filter-btn"}>
            {g==="all"?t.people.all:g==="m"?t.people.male:t.people.female}
          </button>
        ))}
        <div className="w-px h-4 bg-stone-200" />
        {(["all","alive","dead"] as AF[]).map((a) => (
          <button key={a} onClick={() => setAF(a)} className={a===aF?"filter-btn-active":"filter-btn"}>
            {a==="all"?t.people.all:a==="alive"?t.people.alive:t.people.deceased}
          </button>
        ))}
        <span className="text-xs text-stone-400 ml-auto">{filtered.length} / {people.length}</span>
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-16"><p className="text-stone-400 text-sm">{t.people.noResults}</p></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((p) => <PersonCard key={p.id} person={p} href={`/people/${p.id}`} />)}
        </div>
      )}
    </div>
  );
}
