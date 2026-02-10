# 💰 Finans - Kişisel Finans Yönetim Uygulaması

Modern, kullanıcı dostu bir mobil finans yönetim uygulaması. Gelir, gider, borç ve taksit takibi için tasarlanmış, tamamen yerel veri depolama ile çalışan bir React Native (Expo) uygulamasıdır.

## 📱 Özellikler

### ✅ Temel Özellikler
- **Gelir/Gider Takibi**: Manuel işlem girişi (tarih, kategori, tutar, açıklama)
- **Taksit Yönetimi**: Taksitli alışverişleri otomatik aylık bölümlere ayırma
- **Borç/Alacak Takibi**: Kişi bazlı borç ve alacak yönetimi
- **Dashboard**: Aylık gelir, gider, net bakiye özeti
- **Analiz ve Grafikler**: 
  - Kategori bazlı pasta grafik
  - Aylık gelir/gider karşılaştırma çubuk grafik
- **Excel Dışa Aktarma**: Tüm verileri .xlsx formatında indirme
- **Tema Desteği**: Açık/Koyu tema otomatik geçişi

### 🎨 Kullanıcı Arayüzü
- Modern, temiz ve sezgisel tasarım
- Türkçe dil desteği
- Tek elle kullanım için optimize edilmiş
- Material Design 3 (React Native Paper)
- Responsive layout

### 💾 Veri Yönetimi
- **Tamamen Yerel Depolama**: SQLite veritabanı (expo-sqlite)
- **Veri Güvenliği**: Tüm veriler cihazda saklanır
- **Gelecek Hazırlık**: Bulut senkronizasyonu için genişletilebilir yapı

## 🛠️ Teknoloji Yığını

### Core
- **Framework**: React Native (Expo SDK 54)
- **Dil**: TypeScript
- **Veritabanı**: SQLite (expo-sqlite)
- **State Management**: Zustand

### UI & Navigation
- **UI Library**: React Native Paper (Material Design 3)
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Charts**: react-native-gifted-charts
- **Icons**: MaterialCommunityIcons

### Form & Validation
- **Form Handling**: react-hook-form
- **Validation**: Zod
- **Date Picker**: @react-native-community/datetimepicker

### Utilities
- **Date Handling**: date-fns
- **Excel Export**: xlsx + expo-sharing
- **File System**: expo-file-system

## 📂 Proje Yapısı

```
Finans/
├── src/
│   ├── components/          # Yeniden kullanılabilir bileşenler
│   │   └── SummaryCard.tsx  # Dashboard özet kartı
│   ├── database/            # Veritabanı katmanı
│   │   ├── db.ts           # SQLite başlatma
│   │   └── repository.ts   # CRUD işlemleri
│   ├── navigation/          # Navigasyon yapılandırması
│   │   └── index.tsx       # Stack + Tab navigasyon
│   ├── screens/             # Uygulama ekranları
│   │   ├── DashboardScreen.tsx
│   │   ├── TransactionsScreen.tsx
│   │   ├── AddTransactionScreen.tsx
│   │   ├── DebtsScreen.tsx
│   │   ├── AddDebtScreen.tsx
│   │   ├── StatsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── store/               # Global state yönetimi
│   │   └── index.ts        # Zustand store
│   ├── theme/               # Tema yapılandırması
│   │   └── index.ts        # Light/Dark temalar
│   ├── types/               # TypeScript tipleri
│   │   └── index.ts        # Interface tanımları
│   └── utils/               # Yardımcı fonksiyonlar
│       ├── format.ts       # Para ve tarih formatlama
│       └── excel.ts        # Excel dışa aktarma
├── assets/                  # Görseller ve ikonlar
├── App.tsx                  # Ana uygulama bileşeni
├── app.json                 # Expo yapılandırması
├── eas.json                 # EAS Build yapılandırması
├── package.json             # Bağımlılıklar
└── tsconfig.json           # TypeScript yapılandırması
```

## 🗄️ Veritabanı Şeması

### Transactions (İşlemler)
```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount REAL NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT,
  installmentId INTEGER,
  FOREIGN KEY (installmentId) REFERENCES installments(id)
);
```

### Installments (Taksitler)
```sql
CREATE TABLE installments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  totalAmount REAL NOT NULL,
  totalMonths INTEGER NOT NULL,
  remainingMonths INTEGER NOT NULL,
  startDate TEXT NOT NULL,
  description TEXT
);
```

### Debts (Borçlar/Alacaklar)
```sql
CREATE TABLE debts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK (type IN ('debt', 'receivable')),
  personName TEXT NOT NULL,
  amount REAL NOT NULL,
  dueDate TEXT,
  isPaid INTEGER DEFAULT 0,
  description TEXT
);
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Expo CLI
- Android Studio (Android build için) veya Xcode (iOS build için)

### Adımlar

1. **Bağımlılıkları Yükleyin**
```bash
npm install
```

2. **Geliştirme Sunucusunu Başlatın**
```bash
npx expo start
```

3. **Platform Seçin**
- Android: `a` tuşuna basın veya `npx expo start --android`
- iOS: `i` tuşuna basın veya `npx expo start --ios`
- Web: `w` tuşuna basın veya `npx expo start --web` (Not: SQLite web'de çalışmaz)

## 📦 APK Oluşturma

### EAS Build ile (Önerilen)

1. **EAS CLI Kurulumu**
```bash
npm install -g eas-cli
```

2. **Expo Hesabına Giriş**
```bash
eas login
```

3. **Build Başlatma**
```bash
eas build -p android --profile preview
```

4. **APK İndirme**
Build tamamlandığında verilen linkten APK dosyasını indirin.

### Yerel Build

```bash
npx expo prebuild
cd android
./gradlew assembleRelease
```

## 🎯 Kullanım Senaryoları

### 1. Gelir/Gider Ekleme
- Dashboard'daki FAB butonuna tıklayın
- Gelir veya Gider seçin
- Tutarı, kategoriyi ve tarihi girin
- Kaydet

### 2. Taksitli İşlem
- Yeni işlem eklerken "Taksitli İşlem" switch'ini açın
- Taksit sayısını girin
- İlk taksit otomatik eklenir, diğerleri aylık takip edilir

### 3. Borç/Alacak Takibi
- Borçlar sekmesine gidin
- FAB butonuna tıklayın
- "Alacağım Var" veya "Borcum Var" seçin
- Kişi adı, tutar ve vade tarihi girin

### 4. Analiz Görüntüleme
- Analiz sekmesine gidin
- "Kategori Dağılımı" veya "Aylık Özet" seçin
- Grafiklerle harcamalarınızı inceleyin

### 5. Excel Dışa Aktarma
- Ayarlar sekmesine gidin
- "Verileri Excel Olarak İndir" butonuna tıklayın
- Dosya cihazınıza indirilir

## 🔧 Yapılandırma

### Kategoriler
Kategoriler `src/screens/AddTransactionScreen.tsx` dosyasında tanımlıdır:

```typescript
const CATEGORIES = {
  income: ['Maaş', 'Ek Gelir', 'Yatırım', 'Diğer'],
  expense: ['Gıda', 'Ulaşım', 'Fatura', 'Eğlence', 'Kira', 'Sağlık', 'Giyim', 'Teknoloji', 'Diğer'],
};
```

### Tema Renkleri
Temalar `src/theme/index.ts` dosyasında özelleştirilebilir:

```typescript
customIncome: '#4CAF50',    // Yeşil (Gelir)
customExpense: '#F44336',   // Kırmızı (Gider)
```

## 🐛 Bilinen Sorunlar ve Çözümler

### Web Preview
- **Sorun**: SQLite web platformunda çalışmaz
- **Çözüm**: Sadece mobil platformlarda (Android/iOS) test edin

### Build Hataları
- **Sorun**: Keystore oluşturma hatası
- **Çözüm**: Interactive modda build yapın: `eas build -p android --profile preview`

## 📝 Gelecek Geliştirmeler

- [ ] Bulut senkronizasyonu (Firebase/Supabase)
- [ ] Bütçe planlama ve uyarılar
- [ ] Fatura hatırlatıcıları
- [ ] Çoklu para birimi desteği
- [ ] Kategori özelleştirme
- [ ] Veri yedekleme/geri yükleme
- [ ] Widget desteği
- [ ] Karanlık tema özelleştirme

## 👨‍💻 Geliştirici

**Proje Sahibi**: mediaconfig55-afk  
**Geliştirme Tarihi**: Şubat 2026  
**Lisans**: MIT

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 🙏 Teşekkürler

- Expo ekibine harika bir framework için
- React Native Paper ekibine Material Design 3 implementasyonu için
- Tüm açık kaynak katkıda bulunanlara

---

**Not**: Bu uygulama tamamen eğitim ve kişisel kullanım amaçlıdır. Finansal danışmanlık sağlamaz.
