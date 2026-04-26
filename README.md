# 🌳 Köy Soy Ağacı | Dara Malbatê

Türkçe ve Kürtçe (Kurmanji) destekli, tam özellikli köy ve aile soy ağacı sitesi.
Next.js 15 + Supabase ile geliştirilmiştir.

---

## Özellikler

- **Soy Ağacı** — Nesillere göre gruplanmış görsel aile ağacı
- **Kişi Profilleri** — Fotoğraf, lakap, doğum/ölüm, baba/anne/eş/çocuk bağlantıları
- **Kadın Evlilik Bilgisi** — Hangi köye, kiminle evlendiği
- **İstatistikler** — Toplam/Erkek/Kadın/Vefat/Bağlı köy sayıları
- **Fotoğraf Galerisi** — Supabase Storage + URL destekli, lightbox görüntüleyici
- **Tarih & Hikayeler** — Kategorili (Tarih, Folklor, Savaş, Göç, Kültür, Din)
- **İki Dil** — Türkçe / Kürtçe (Kurmanji) tam destek
- **Admin Paneli** — /admin rotasında, Supabase Auth korumalı
  - Kişi ekle/düzenle/sil
  - Hikaye ekle/düzenle/sil
  - Fotoğraf yükle veya URL ekle/sil
  - Köy bilgisini düzenle

---

## Kurulum Adımları

### 1. Projeyi indirin

```bash
git clone <repo-url>
cd village-family-tree
npm install
```

### 2. Supabase projesi oluşturun

1. [supabase.com](https://supabase.com) adresine gidin
2. Yeni proje oluşturun
3. **Project URL** ve **anon key**'i kopyalayın

### 3. Veritabanı şemasını çalıştırın

Supabase Dashboard → **SQL Editor** → `supabase/schema.sql` dosyasının tamamını yapıştırın → **Run**

### 4. Admin kullanıcısı oluşturun

Supabase Dashboard → **Authentication** → **Users** → **Add User**

```
Email:    admin@koysoyagaci.com  (istediğiniz bir email)
Password: güvenli-bir-şifre
```

### 5. .env.local dosyasını oluşturun

```bash
cp .env.local.example .env.local
```

`.env.local` dosyasını düzenleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://XXXXXXXXXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyXXXXXXXXXXXXXX
```

### 6. Geliştirme sunucusunu başlatın

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000` adresine gidin.

---

## Admin Paneli Kullanımı

1. `http://localhost:3000/admin` adresine gidin
2. Supabase'de oluşturduğunuz email ve şifre ile giriş yapın
3. Sol menüden istediğiniz bölüme gidin:
   - **Genel Bakış** — Hızlı istatistikler
   - **Kişi Yönetimi** — Soy ağacına kişi ekleme/düzenleme
   - **Hikaye Yönetimi** — Tarih ve folklor hikayeleri
   - **Fotoğraf Yönetimi** — Galeri yönetimi
   - **Köy Bilgisi** — Ana sayfadaki köy açıklamasını düzenleme

---

## Kişi Ekleme İpuçları

- **Nesil numarası** önemlidir: 1 = en büyük ata, 2 = çocukları, 3 = torunları vb.
- Baba ve anne alanları dropdown ile seçilir (önceden eklenmiş kişilerden)
- **Kadınlar** için "Gittiği Köy" alanını doldurun (örn: "Yeşiltepe Köyü")
- Fotoğraf için dosya yükleyebilir veya Google Drive / Cloudinary URL'si yapıştırabilirsiniz

---

## Dil Sistemi

- Her hikaye ve köy bilgisi **Türkçe + Kürtçe** ayrı ayrı girilebilir
- Kullanıcı sağ üstteki TR/KU butonuyla dil değiştirir
- Tercih tarayıcı hafızasına (localStorage) kaydedilir
- Kürtçe girilmemişse Türkçe içerik gösterilir

---

## Yayına Alma (Deployment)

### Vercel (Önerilen)

```bash
npm install -g vercel
vercel
```

Vercel dashboard'da Environment Variables ekleyin:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Diğer platformlar

`npm run build` ile build alın, `npm start` ile başlatın.

---

## Proje Yapısı

```
village-family-tree/
├── app/
│   ├── page.tsx              ← Ana Sayfa
│   ├── tree/                 ← Soy Ağacı
│   ├── people/               ← Kişiler listesi
│   │   └── [id]/             ← Kişi detay sayfası
│   ├── gallery/              ← Fotoğraf galerisi
│   ├── history/              ← Tarih & Hikayeler
│   └── admin/                ← Admin paneli (korumalı)
│       ├── page.tsx          ← Giriş sayfası
│       ├── dashboard/        ← Genel bakış
│       ├── people/           ← Kişi yönetimi
│       ├── stories/          ← Hikaye yönetimi
│       ├── photos/           ← Fotoğraf yönetimi
│       └── village/          ← Köy bilgisi
├── components/
│   ├── Navbar.tsx
│   └── PersonCard.tsx
├── contexts/
│   └── LanguageContext.tsx   ← TR/KU dil yönetimi
├── lib/
│   ├── supabase.ts           ← Browser client
│   ├── supabase-server.ts    ← Server client
│   └── types.ts              ← TypeScript tipleri
├── middleware.ts             ← Admin rota koruması
└── supabase/
    └── schema.sql            ← Veritabanı şeması
```

---

## Geliştirme Notları

- Tüm public sayfalar **Server Component** olarak çalışır (SEO dostu)
- Etkileşimli bölümler **Client Component** (`"use client"`) olarak ayrılmıştır
- Admin sayfaları middleware ile korunur, giriş yapmadan erişilirse `/admin`'e yönlendirilir
- Fotoğraflar Supabase Storage `village-photos` bucket'ına yüklenir
- RLS politikaları ile sadece authenticated kullanıcılar yazabilir
