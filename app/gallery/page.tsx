import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Photo } from "@/lib/types";
import GalleryClient from "./GalleryClient";

export default async function GalleryPage() {
  const supabase = await createServerSupabaseClient();
  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .order("year", { ascending: false });

  return <GalleryClient photos={(photos as Photo[]) ?? []} />;
}
