# 💰 Kişisel Finans Uygulaması

Modern, minimalist ve kullanıcı dostu Android finans takip uygulaması.

## 🚀 Özellikler

### 🔐 Kimlik Doğrulama & Güvenlik
- Email/Şifre ile giriş (Firebase Auth)
- Biyometrik giriş (Parmak izi / Yüz tanıma)
- Güvenli veri saklama (AsyncStorage persistence)

### 📊 Ana Özellikler
- **Dashboard**: Bakiye özeti, son işlemler, borç takibi
- **Gizlilik Modu**: Telefonu sallayarak bakiyeleri gizle
- **İşlem Ekleme**: Hızlı gelir/gider/borç ekleme
- **İstatistikler**: Pasta grafiği ile harcama dağılımı
- **Bütçe Planlama**: Kategori bazlı limitler ve uyarılar
- **Excel Çıktısı**: İşlemleri `.xlsx` formatında indirme
- **Borç Takibi**: Yaklaşan ödemeler ve hatırlatıcılar

### 🎨 Tasarım
- **Pitch Black** tema (AMOLED friendly)
- Neon yeşil/kırmızı vurgular
- Haptic feedback (Titreşim geri bildirimi)
- Dinamik renk yoğunluğu

## 📦 Teknolojiler

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **State Management**: React Hooks
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Forms**: React Hook Form + Zod
- **Charts**: React Native Gifted Charts
- **Excel**: XLSX.js

## 🛠️ Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase projesi (Auth + Firestore aktif)

### Adımlar

1. **Projeyi Klonlayın**
```bash
git clone https://github.com/mediaconfig55-afk/finans.git
cd finans
```

2. **Bağımlılıkları Yükleyin**
```bash
npm install
```

3. **Firebase Konfigürasyonu**
`src/config/firebaseConfig.js` dosyasındaki Firebase API anahtarlarını kendi proje bilgilerinizle değiştirin:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ...
};
```

4. **Geliştirme Sunucusunu Başlatın**
```bash
npx expo start
```

5. **Test Edin**
- **Android**: Expo Go uygulamasını açın, QR kodu okutun
- **iOS**: Kamera ile QR kodu okutun

## 📱 APK Oluşturma

```bash
# EAS CLI kurulumu (ilk kez)
npm install -g eas-cli

# Giriş yapın
eas login

# APK oluşturma
eas build -p android --profile preview
```

Build tamamlandığında indirme linki terminalde görünecektir.

## 📂 Proje Yapısı

```
project/
├── assets/              # Icon, splash screen
├── src/
│   ├── components/      # Yeniden kullanılabilir bileşenler
│   ├── config/          # Firebase ve diğer konfigürasyonlar
│   ├── constants/       # Renkler, boyutlar
│   ├── navigation/      # Auth ve Tab navigasyon
│   ├── screens/         # Ekranlar (Auth, Dashboard vb.)
│   └── utils/           # Yardımcı fonksiyonlar
├── App.js               # Ana giriş noktası
├── babel.config.js      # Babel konfigürasyonu
├── app.json             # Expo konfigürasyonu
└── package.json         # Bağımlılıklar
```

## 🎯 Yapılacaklar

- [ ] Android Widget ekle
- [ ] Tekrar eden işlem otomasyonu
- [ ] Bildirim sistemi
- [ ] Firestore offline support iyileştir
- [ ] Unit test coverage artır
- [ ] TypeScript desteği

## 📄 Lisans

MIT

## 👨‍💻 Geliştirici

[VAS6150F](https://github.com/mediaconfig55-afk)

---

⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!
