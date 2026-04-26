import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { PlaceName } from "@/lib/types";
import PlacesClient from "./PlacesClient";

export default async function PlacesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: places } = await supabase.from("place_names").select("*").order("category");
  return <PlacesClient places={(places as PlaceName[]) ?? []} />;
}
