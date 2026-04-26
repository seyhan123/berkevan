import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Person, VillageInfo } from "@/lib/types";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();

  const [{ data: people }, { data: villageInfo }, { data: stories }, { data: photos }] =
    await Promise.all([
      supabase.from("people").select("*"),
      supabase.from("village_info").select("*").eq("id", 1).single(),
      supabase.from("stories").select("id").limit(1),
      supabase.from("photos").select("id").limit(1),
    ]);

  const stats = {
    total: people?.length ?? 0,
    male: people?.filter((p: Person) => p.gender === "m").length ?? 0,
    female: people?.filter((p: Person) => p.gender === "f").length ?? 0,
    deceased: people?.filter((p: Person) => p.death_year).length ?? 0,
    villages: [
      ...new Set(
        (people ?? [])
          .filter((p: Person) => p.destination_village)
          .map((p: Person) => p.destination_village)
      ),
    ].length + 1,
  };

  const connectedVillages = [
    ...new Set(
      (people ?? [])
        .filter((p: Person) => p.destination_village)
        .map((p: Person) => p.destination_village as string)
    ),
  ];

  return (
    <HomeClient
      village={villageInfo as VillageInfo | null}
      stats={stats}
      connectedVillages={connectedVillages}
    />
  );
}
