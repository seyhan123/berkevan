import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { CemeteryRecord } from "@/lib/types";
import CemeteryClient from "./CemeteryClient";

export default async function CemeteryPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("cemetery_records")
    .select("*")
    .order("death_year", { ascending: false });
  return <CemeteryClient records={(data as CemeteryRecord[]) ?? []} />;
}
