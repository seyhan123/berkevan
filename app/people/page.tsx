import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Person } from "@/lib/types";
import PeopleClient from "./PeopleClient";

export default async function PeoplePage() {
  const supabase = await createServerSupabaseClient();
  const { data: people } = await supabase
    .from("people")
    .select("*")
    .order("generation", { ascending: true })
    .order("birth_year", { ascending: true });

  return <PeopleClient people={(people as Person[]) ?? []} />;
}
