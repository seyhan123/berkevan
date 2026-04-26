"use client";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";
import type { Person } from "@/lib/types";

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
}

export default function PersonDetailClient({ person, relatedMap, children }: {
  person: Person; relatedMap: Record<string, Person>; children: Person[];
}) {
  const { t } = useLang();
  const isM = person.gender === "m";
  const father = person.father_id ? relatedMap[person.father_id] : null;
  const mother = person.mother_id ? relatedMap[person.mother_id] : null;
  const spouse = person.spouse_id ? relatedMap[person.spouse_id] : null;

  function RelLink({ p }: { p: Person | null }) {
    if (!p) return <span className="text-[#444]">{t.person.unknown}</span>;
    return <Link href={`/people/${p.id}`} className="text-[#c9a96e] hover:text-[#d4b87e] transition-colors">{p.name}</Link>;
  }

  return (
    <div>
      <Link href="/people" className="inline-flex items-center gap-2 text-xs text-[#555] hover:text-[#aaa] transition-colors mb-8">
        ← {t.person.backToPeople}
      </Link>
      <div className="card p-8">
        <div className="flex items-start gap-6 mb-8 pb-8 border-b border-[#1a1a1a]">
          {person.photo_url ? (
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-[#2a2a2a] flex-shrink-0">
              <Image src={person.photo_url} alt={person.name} fill className="object-cover" />
            </div>
          ) : (
            <div className={`w-24 h-24 rounded-2xl flex items-center justify-content-center items-center justify-center text-3xl font-semibold flex-shrink-0 ${isM ? "bg-[#172030] text-[#6b9fd4]" : "bg-[#2a1520] text-[#d47a8f]"}`}>
              {getInitials(person.name)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-light text-[#f0ebe3] leading-tight mb-2" style={{fontFamily:"'Fraunces',serif"}}>
              {person.name}
            </h1>
            {person.nickname && <p className="text-[#c9a96e] italic text-sm mb-3">"{person.nickname}"</p>}
            <div className="flex gap-2 flex-wrap">
              <span className={`badge ${isM ? "badge-m" : "badge-f"}`}>{isM ? t.person.male : t.person.female}</span>
              {person.death_year && <span className="badge badge-dead">†</span>}
              {person.generation && <span className="badge badge-gen">{t.person.generation} {person.generation}</span>}
            </div>
            <p className="text-[#444] text-sm mt-3">
              {person.birth_year ?? "?"} — {person.death_year ?? <span className="text-[#7abf8e]">{t.person.alive}</span>}
            </p>
          </div>
        </div>
        <div>
          {[
            { label: t.person.father,  value: <RelLink p={father} /> },
            { label: t.person.mother,  value: <RelLink p={mother} /> },
            { label: t.person.spouse,  value: <RelLink p={spouse} /> },
            ...(person.destination_village ? [{ label: t.person.marriedTo, value: <span>{person.destination_village}</span> }] : []),
            ...(person.notes ? [{ label: t.person.notes, value: <span>{person.notes}</span> }] : []),
          ].map(({ label, value }) => (
            <div key={label} className="info-row">
              <span className="info-label">{label}</span>
              <span className="info-value">{value}</span>
            </div>
          ))}
          <div className="info-row">
            <span className="info-label">{t.person.children}</span>
            <span className="info-value">
              {children.length === 0 ? (
                <span className="text-[#444]">{t.person.noChildren}</span>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {children.map((ch) => (
                    <Link key={ch.id} href={`/people/${ch.id}`} className="text-[#c9a96e] hover:text-[#d4b87e] text-sm transition-colors">{ch.name}</Link>
                  ))}
                </div>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
