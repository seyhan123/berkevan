"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "tr" | "ku";

export const translations = {
  tr: {
    siteName: "Köy Soy Ağacı",
    nav: {
      home: "Ana Sayfa",
      tree: "Soy Ağacı",
      people: "Kişiler",
      gallery: "Galeri",
      history: "Tarih & Hikayeler",
    },
    home: {
      importantInfo: "Önemli Bilgiler",
      connectedVillages: "Akraba Köyler",
      founded: "Kuruluş",
      quickNav: "Hızlı Erişim",
    },
    stats: {
      total: "Toplam Kişi",
      male: "Erkek",
      female: "Kadın",
      deceased: "Vefat",
      villages: "Bağlı Köy",
    },
    people: {
      title: "Kişiler",
      search: "İsim veya lakap ile ara...",
      all: "Tümü",
      male: "Erkek",
      female: "Kadın",
      alive: "Hayatta",
      deceased: "Vefat",
      noResults: "Sonuç bulunamadı.",
    },
    person: {
      born: "Doğum",
      died: "Vefat",
      nickname: "Lakap",
      gender: "Cinsiyet",
      male: "Erkek",
      female: "Kadın",
      father: "Baba",
      mother: "Anne",
      spouse: "Eş",
      marriedTo: "Evlendiği Köy",
      children: "Çocuklar",
      noChildren: "Kayıtlı çocuk yok.",
      notes: "Notlar",
      unknown: "Bilinmiyor",
      alive: "Hayatta",
      backToPeople: "← Kişilere Dön",
      backToTree: "← Soy Ağacına Dön",
      generation: "Nesil",
    },
    tree: {
      title: "Soy Ağacı",
      generation: "Nesil",
      clickToView: "Detay için tıklayın",
    },
    gallery: {
      title: "Köy Fotoğrafları",
      noPhotos: "Henüz fotoğraf eklenmemiş.",
    },
    history: {
      title: "Tarih & Hikayeler",
      noStories: "Henüz hikaye eklenmemiş.",
      year: "Yıl",
    },
    admin: {
      title: "Admin Paneli",
      login: "Giriş Yap",
      logout: "Çıkış Yap",
      email: "E-posta",
      password: "Şifre",
      loginBtn: "Giriş",
      loginError: "E-posta veya şifre hatalı.",
      dashboard: "Genel Bakış",
      managePeople: "Kişi Yönetimi",
      manageStories: "Hikaye Yönetimi",
      managePhotos: "Fotoğraf Yönetimi",
      manageVillage: "Köy Bilgisi",
      addPerson: "Yeni Kişi Ekle",
      addStory: "Yeni Hikaye Ekle",
      addPhoto: "Fotoğraf Ekle",
      save: "Kaydet",
      cancel: "İptal",
      delete: "Sil",
      edit: "Düzenle",
      confirmDelete: "Silmek istediğinize emin misiniz?",
      saved: "Başarıyla kaydedildi.",
      deleted: "Silindi.",
      error: "Bir hata oluştu.",
      name: "Ad Soyad",
      nickname: "Lakap",
      gender: "Cinsiyet",
      male: "Erkek",
      female: "Kadın",
      birthYear: "Doğum Yılı",
      deathYear: "Vefat Yılı",
      father: "Baba",
      mother: "Anne",
      spouse: "Eş",
      destinationVillage: "Gittiği Köy (Kadınlar için)",
      generation: "Nesil (1, 2, 3...)",
      notes: "Notlar",
      photoUrl: "Fotoğraf URL",
      uploadPhoto: "Fotoğraf Yükle",
      orEnterUrl: "veya URL girin",
      titleTr: "Başlık (Türkçe)",
      titleKu: "Başlık (Kürtçe)",
      contentTr: "İçerik (Türkçe)",
      contentKu: "İçerik (Kürtçe)",
      category: "Kategori",
      year: "Yıl",
      captionTr: "Açıklama (Türkçe)",
      captionKu: "Açıklama (Kürtçe)",
      villageName: "Köy Adı",
      descTr: "Açıklama (Türkçe)",
      descKu: "Açıklama (Kürtçe)",
      importantTr: "Önemli Bilgi (Türkçe)",
      importantKu: "Önemli Bilgi (Kürtçe)",
      founded: "Kuruluş Yılı",
      selectParent: "Seçiniz",
      categories: ["Tarih", "Folklor", "Savaş", "Göç", "Kültür", "Din"],
      totalPeople: "Toplam Kişi",
      totalStories: "Toplam Hikaye",
      totalPhotos: "Toplam Fotoğraf",
      recentPeople: "Son Eklenen Kişiler",
    },
  },
  ku: {
    siteName: "Dara Malbatê",
    nav: {
      home: "Rûpela Sereke",
      tree: "Dara Malbatê",
      people: "Kes û Kar",
      gallery: "Galerî",
      history: "Dîrok & Çîrok",
    },
    home: {
      importantInfo: "Agahiyên Girîng",
      connectedVillages: "Gundên Girêdayî",
      founded: "Damezrandin",
      quickNav: "Bigihîje Bilez",
    },
    stats: {
      total: "Tevahî Kesan",
      male: "Mêr",
      female: "Jin",
      deceased: "Wefat",
      villages: "Gundên Têkildar",
    },
    people: {
      title: "Kes û Kar",
      search: "Bi nav an navê xweş bigere...",
      all: "Hemû",
      male: "Mêr",
      female: "Jin",
      alive: "Zindî",
      deceased: "Wefat",
      noResults: "Encam nehat dîtin.",
    },
    person: {
      born: "Jidayikbûn",
      died: "Wefat",
      nickname: "Navê Xweş",
      gender: "Zayend",
      male: "Mêr",
      female: "Jin",
      father: "Bav",
      mother: "Dê",
      spouse: "Hevjîn",
      marriedTo: "Gundê Zewacê",
      children: "Zarok",
      noChildren: "Tomarek zarok tuneye.",
      notes: "Notên",
      unknown: "Nenas",
      alive: "Zindî",
      backToPeople: "← Vegere Kesan",
      backToTree: "← Vegere Darê",
      generation: "Nifş",
    },
    tree: {
      title: "Dara Malbatê",
      generation: "Nifş",
      clickToView: "Bikirtîne ji bo hûrgulî",
    },
    gallery: {
      title: "Wêneyên Gund",
      noPhotos: "Hê wêneyeke nehatiye zêdekirin.",
    },
    history: {
      title: "Dîrok & Çîrok",
      noStories: "Hê çîrokeke nehatiye zêdekirin.",
      year: "Sal",
    },
    admin: {
      title: "Panela Admin",
      login: "Têkeve",
      logout: "Derkeve",
      email: "E-posta",
      password: "Şîfre",
      loginBtn: "Têkeve",
      loginError: "E-posta an şîfre xelet e.",
      dashboard: "Tabloya Giştî",
      managePeople: "Rêveberiya Kesan",
      manageStories: "Rêveberiya Çîrokan",
      managePhotos: "Rêveberiya Wêneyan",
      manageVillage: "Agahiya Gund",
      addPerson: "Kesê Nû Zêde Bike",
      addStory: "Çîroka Nû Zêde Bike",
      addPhoto: "Wêne Zêde Bike",
      save: "Tomar Bike",
      cancel: "Betal Bike",
      delete: "Jê Bibe",
      edit: "Biguherîne",
      confirmDelete: "Hûn dixwazin jê bikin?",
      saved: "Bi serkeftî hate tomarkirin.",
      deleted: "Hate jêbirin.",
      error: "Çewtiyeke çêbû.",
      name: "Nav û Nasname",
      nickname: "Navê Xweş",
      gender: "Zayend",
      male: "Mêr",
      female: "Jin",
      birthYear: "Sala Jidayikbûnê",
      deathYear: "Sala Wefatê",
      father: "Bav",
      mother: "Dê",
      spouse: "Hevjîn",
      destinationVillage: "Gundê Çûyî (Ji bo jinan)",
      generation: "Nifş (1, 2, 3...)",
      notes: "Not",
      photoUrl: "Girêdana Wêneyê",
      uploadPhoto: "Wêne Bar Bike",
      orEnterUrl: "an girêdan binivîse",
      titleTr: "Sernav (Tirkî)",
      titleKu: "Sernav (Kurdî)",
      contentTr: "Naverok (Tirkî)",
      contentKu: "Naverok (Kurdî)",
      category: "Kategorî",
      year: "Sal",
      captionTr: "Rave (Tirkî)",
      captionKu: "Rave (Kurdî)",
      villageName: "Navê Gund",
      descTr: "Danasîn (Tirkî)",
      descKu: "Danasîn (Kurdî)",
      importantTr: "Agahiya Girîng (Tirkî)",
      importantKu: "Agahiya Girîng (Kurdî)",
      founded: "Sala Damezrandinê",
      selectParent: "Hilbijêre",
      categories: ["Dîrok", "Folklor", "Şer", "Koç", "Çand", "Ol"],
      totalPeople: "Tevahî Kesan",
      totalStories: "Tevahî Çîrokan",
      totalPhotos: "Tevahî Wêneyan",
      recentPeople: "Yên Dawî Hatine Zêdekirin",
    },
  },
} as const;

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof translations.tr;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "tr",
  setLang: () => {},
  t: translations.tr,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("tr");

  useEffect(() => {
    const saved = localStorage.getItem("village-lang") as Lang | null;
    if (saved === "tr" || saved === "ku") setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("village-lang", l);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
