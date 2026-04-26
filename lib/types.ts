export type Gender = "m" | "f";

export interface Person {
  id: string;
  name: string;
  nickname?: string | null;
  gender: Gender;
  birth_year?: number | null;
  death_year?: number | null;
  photo_url?: string | null;
  father_id?: string | null;
  mother_id?: string | null;
  spouse_id?: string | null;
  destination_village?: string | null;
  generation?: number | null;
  notes?: string | null;
  created_at: string;
}

export interface Story {
  id: string;
  title_tr: string;
  title_ku?: string | null;
  content_tr: string;
  content_ku?: string | null;
  category?: string | null;
  year?: number | null;
  created_at: string;
}

export interface Photo {
  id: string;
  url: string;
  caption_tr?: string | null;
  caption_ku?: string | null;
  year?: number | null;
  is_storage?: boolean;
  created_at: string;
}

export interface VillageInfo {
  id: number;
  name: string;
  description_tr?: string | null;
  description_ku?: string | null;
  important_info_tr?: string | null;
  important_info_ku?: string | null;
  founded?: string | null;
}

export interface PlaceName {
  id: string;
  name: string;
  description_tr?: string | null;
  description_ku?: string | null;
  category?: string | null;
  lat?: number | null;
  lng?: number | null;
  created_at: string;
}

export interface HistoricStructure {
  id: string;
  name_tr: string;
  name_ku?: string | null;
  type?: string | null;
  description_tr?: string | null;
  description_ku?: string | null;
  photo_url?: string | null;
  year_built?: string | null;
  year_demolished?: string | null;
  status?: string | null;
  created_at: string;
}

export interface CemeteryRecord {
  id: string;
  person_name: string;
  nickname?: string | null;
  birth_year?: number | null;
  death_year?: number | null;
  gravestone_photo_url?: string | null;
  location_desc?: string | null;
  person_id?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface InfoSubmission {
  id: string;
  submitter_name?: string | null;
  submitter_contact?: string | null;
  subject: string;
  message: string;
  photo_url?: string | null;
  status?: string | null;
  created_at: string;
}
