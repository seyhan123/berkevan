import { createServerSupabaseClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import type { Person } from "@/lib/types";
import PersonDetailClient from "./PersonDetailClient";

export default async function PersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: person } = await supabase
    .from("people")
    .select("*")
    .eq("id", id)
    .single();

  if (!person) notFound();

  // Bağlı kişileri getir
  const relatedIds = [
    person.father_id,
    person.mother_id,
    person.spouse_id,
  ].filter(Boolean);

  const { data: children } = await supabase
    .from("people")
    .select("*")
    .or(`father_id.eq.${id},mother_id.eq.${id}`);

  const { data: related } = relatedIds.length
    ? await supabase.from("people").select("*").in("id", relatedIds)
    : { data: [] };

  const allRelated = [...(related ?? []), ...(children ?? [])];
  const relatedMap: Record<string, Person> = {};
  allRelated.forEach((p) => (relatedMap[p.id] = p));

  return (
    <PersonDetailClient
      person={person as Person}
      relatedMap={relatedMap}
      children={(children as Person[]) ?? []}
    />
  );
}
