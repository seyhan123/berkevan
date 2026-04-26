import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { HistoricStructure } from "@/lib/types";
import StructuresClient from "./StructuresClient";

export default async function StructuresPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("historic_structures").select("*").order("type");
  return <StructuresClient structures={(data as HistoricStructure[]) ?? []} />;
}
