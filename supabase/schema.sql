-- ============================================================
-- KÖY SOY AĞACI - Supabase Şeması
-- Supabase Dashboard > SQL Editor'de çalıştırın
-- ============================================================

-- Kişiler
CREATE TABLE IF NOT EXISTS people (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text NOT NULL,
  nickname    text,
  gender      text NOT NULL CHECK (gender IN ('m', 'f')),
  birth_year  integer,
  death_year  integer,
  photo_url   text,
  father_id   uuid REFERENCES people(id) ON DELETE SET NULL,
  mother_id   uuid REFERENCES people(id) ON DELETE SET NULL,
  spouse_id   uuid REFERENCES people(id) ON DELETE SET NULL,
  destination_village text,
  generation  integer DEFAULT 1,
  notes       text,
  created_at  timestamptz DEFAULT now()
);

-- Hikayeler / Tarih
CREATE TABLE IF NOT EXISTS stories (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title_tr    text NOT NULL,
  title_ku    text,
  content_tr  text NOT NULL,
  content_ku  text,
  category    text DEFAULT 'Tarih',
  year        integer,
  created_at  timestamptz DEFAULT now()
);

-- Galeri fotoğrafları
CREATE TABLE IF NOT EXISTS photos (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  url         text NOT NULL,
  caption_tr  text,
  caption_ku  text,
  year        integer,
  is_storage  boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- Köy bilgisi (tek satır)
CREATE TABLE IF NOT EXISTS village_info (
  id                  integer DEFAULT 1 PRIMARY KEY,
  name                text NOT NULL DEFAULT 'Köyümüz',
  description_tr      text,
  description_ku      text,
  important_info_tr   text,
  important_info_ku   text,
  founded             text,
  updated_at          timestamptz DEFAULT now()
);

-- Başlangıç köy kaydı
INSERT INTO village_info (id, name, description_tr, important_info_tr, founded)
VALUES (
  1,
  'Köyümüz',
  'Köyümüzün açıklamasını buraya ekleyin.',
  'Önemli bilgiler buraya eklenecek.',
  '~1800'
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- RLS (Row Level Security) Politikaları
-- ============================================================

ALTER TABLE people       ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos       ENABLE ROW LEVEL SECURITY;
ALTER TABLE village_info ENABLE ROW LEVEL SECURITY;

-- Herkese okuma izni (public site)
CREATE POLICY "public_read_people"       ON people       FOR SELECT USING (true);
CREATE POLICY "public_read_stories"      ON stories      FOR SELECT USING (true);
CREATE POLICY "public_read_photos"       ON photos       FOR SELECT USING (true);
CREATE POLICY "public_read_village_info" ON village_info FOR SELECT USING (true);

-- Sadece giriş yapmış (admin) kullanıcıya yazma izni
CREATE POLICY "admin_insert_people"  ON people       FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_update_people"  ON people       FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "admin_delete_people"  ON people       FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "admin_insert_stories" ON stories      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_update_stories" ON stories      FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "admin_delete_stories" ON stories      FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "admin_insert_photos"  ON photos       FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_update_photos"  ON photos       FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "admin_delete_photos"  ON photos       FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "admin_update_village" ON village_info FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================================
-- Storage Bucket (fotoğraflar için)
-- Dashboard > Storage > New Bucket ile de oluşturulabilir
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('village-photos', 'village-photos', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "public_read_photos_storage"
  ON storage.objects FOR SELECT USING (bucket_id = 'village-photos');

CREATE POLICY "admin_upload_photos_storage"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'village-photos' AND auth.role() = 'authenticated');

CREATE POLICY "admin_delete_photos_storage"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'village-photos' AND auth.role() = 'authenticated');

-- ============================================================
-- YENİ TABLOLAR (v2)
-- ============================================================

-- Eski yer isimleri
CREATE TABLE IF NOT EXISTS place_names (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name         text NOT NULL,
  description_tr text,
  description_ku text,
  category     text DEFAULT 'mevki', -- tarla, tepe, dere, mevki, orman, yol
  lat          decimal(10,7),
  lng          decimal(10,7),
  created_at   timestamptz DEFAULT now()
);

-- Tarihi yapılar
CREATE TABLE IF NOT EXISTS historic_structures (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name_tr         text NOT NULL,
  name_ku         text,
  type            text DEFAULT 'ev', -- cami, çeşme, değirmen, ev, ahır, köprü
  description_tr  text,
  description_ku  text,
  photo_url       text,
  year_built      text,
  year_demolished text,
  status          text DEFAULT 'ayakta', -- ayakta, harabe, yıkılmış
  created_at      timestamptz DEFAULT now()
);

-- Mezarlık arşivi
CREATE TABLE IF NOT EXISTS cemetery_records (
  id                   uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  person_name          text NOT NULL,
  nickname             text,
  birth_year           integer,
  death_year           integer,
  gravestone_photo_url text,
  location_desc        text,
  person_id            uuid REFERENCES people(id) ON DELETE SET NULL,
  notes                text,
  created_at           timestamptz DEFAULT now()
);

-- Kullanıcı bilgi gönderimleri
CREATE TABLE IF NOT EXISTS info_submissions (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  submitter_name   text,
  submitter_contact text,
  subject          text NOT NULL,
  message          text NOT NULL,
  photo_url        text,
  status           text DEFAULT 'beklemede', -- beklemede, incelendi, kabul edildi
  created_at       timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE place_names         ENABLE ROW LEVEL SECURITY;
ALTER TABLE historic_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE cemetery_records    ENABLE ROW LEVEL SECURITY;
ALTER TABLE info_submissions    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_places"     ON place_names         FOR SELECT USING (true);
CREATE POLICY "public_read_structures" ON historic_structures FOR SELECT USING (true);
CREATE POLICY "public_read_cemetery"   ON cemetery_records    FOR SELECT USING (true);

CREATE POLICY "admin_all_places"       ON place_names         FOR ALL USING (auth.role()='authenticated');
CREATE POLICY "admin_all_structures"   ON historic_structures FOR ALL USING (auth.role()='authenticated');
CREATE POLICY "admin_all_cemetery"     ON cemetery_records    FOR ALL USING (auth.role()='authenticated');
CREATE POLICY "public_insert_submissions" ON info_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_read_submissions" ON info_submissions    FOR SELECT USING (auth.role()='authenticated');
CREATE POLICY "admin_update_submissions" ON info_submissions  FOR UPDATE USING (auth.role()='authenticated');
CREATE POLICY "admin_delete_submissions" ON info_submissions  FOR DELETE USING (auth.role()='authenticated');
