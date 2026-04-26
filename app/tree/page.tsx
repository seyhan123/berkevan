import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Person } from "@/lib/types";
import TreeClient from "./TreeClient";

export default async function TreePage() {
  const supabase = await createServerSupabaseClient();
  const { data: people } = await supabase
    .from("people")
    .select("*")
    .order("generation", { ascending: true })
    .order("birth_year", { ascending: true });

  return <TreeClient people={(people as Person[]) ?? []} />;
}
