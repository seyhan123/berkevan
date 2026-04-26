"use client";
import Link from "next/link";
import Image from "next/image";
import { Person } from "@/lib/types";

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
}

export default function PersonCard({ person, href }: { person: Person; href?: string }) {
  const isM = person.gender === "m";
  const content = (
    <div className="card-hover p-4">
      <div className="flex items-start gap-3 mb-3">
        {person.photo_url ? (
          <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border border-stone-200">
            <Image src={person.photo_url} alt={person.name} fill className="object-cover" />
          </div>
        ) : (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${isM?"bg-blue-50 text-blue-700":"bg-rose-50 text-rose-600"}`}>
            {getInitials(person.name)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-stone-900 text-sm leading-tight truncate">{person.name}</p>
          {person.nickname && (
            <p className="text-xs text-amber-600 font-medium mt-0.5 truncate italic">"{person.nickname}"</p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-stone-400">{person.birth_year ?? "?"} — {person.death_year ?? "•"}</p>
        <div className="flex gap-1">
          <span className={`badge ${isM?"badge-m":"badge-f"}`}>{isM?"E":"K"}</span>
          {person.death_year && <span className="badge badge-dead">†</span>}
        </div>
      </div>
      {person.destination_village && (
        <p className="text-xs text-[#2d5a3d] font-medium mt-2 border-t border-stone-100 pt-2">→ {person.destination_village}</p>
      )}
    </div>
  );
  if (href) return <Link href={href}>{content}</Link>;
  return content;
}
