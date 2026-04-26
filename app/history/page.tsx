import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Story } from "@/lib/types";
import HistoryClient from "./HistoryClient";

export default async function HistoryPage() {
  const supabase = await createServerSupabaseClient();
  const { data: stories } = await supabase
    .from("stories")
    .select("*")
    .order("year", { ascending: true });

  return <HistoryClient stories={(stories as Story[]) ?? []} />;
}
