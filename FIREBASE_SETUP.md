# Firebase Yapılandırması

## ⚠️ ÖNEMLİ: Firebase Kurulumu

Uygulamanın auth ve database özelliklerinin çalışması için kendi Firebase projenizi oluşturmanız gerekiyor.

### Adım 1: Firebase Projesi Oluşturun
1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. "Add project" (Proje ekle) butonuna tıklayın
3. Proje adı: "finansim-app" (veya istediğiniz bir ad)
4. Google Analytics (opsiyonel) - İstediğiniz gibi ayarlayın

### Adım 2: Android App Ekleyin
1. Proje sayfasında Android ikonuna tıklayın
2. **Android package name:** `com.finans.app` (AYNI OLMALI!)
3. App nickname: "FİNANSIM"
4. SHA-1 (opsiyonel, şimdilik boş bırakabilirsiniz)
5. "Register app" tıklayın
6. `google-services.json` dosyasını indirin (şimdilik gerekli değil)

### Adım 3: Authentication Aktif Et
1. Sol menüden **Authentication** > **Get Started**
2. **Sign-in method** sekmesine gidin
3. **Email/Password** seçeneğini aktif edin

### Adım 4: Firestore Database Oluşturun
1. Sol menüden **Firestore Database** > **Create database**
2. **Test mode** seçin (development için)
3. Location: Eur3 (Europe) (tercih edebilirsiniz)

### Adım 5: Firebase Config'i Kopyalayın
1. Project Settings (⚙️ ikonu) > **General** sekmesi
2. **Your apps** bölümünde web app ikonuna tıklayın (</> ikonu)
3. App nickname girin, "Firebase Hosting" KAPALI bırakın
4. **Register app** tıklayın
5. Config bilgilerini kopyalayın:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcd1234efgh5678"
};
```

### Adım 6: Config'i Projeye Ekleyin

**Seçenek 1: Doğrudan Dosyaya Yapıştır (Hızlı Test)**
`src/config/firebaseConfig.js` dosyasını açın ve placeholder değerleri değiştirin:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY_HERE", // Kopyaladığınız değeri yapıştırın
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ...
};
```

**Seçenek 2: Environment Variables (Önerilen - Güvenli)**
Proje kök dizininde `.env` dosyası oluşturun:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXX
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcd1234
```

### Adım 7: Test Edin
```bash
npx expo start
```

Kayıt/Giriş ekranları çalışmalı!

### Adım 8: Build Alın
```bash
eas build -p android --profile preview
```

---

## 🚨 Sık Sorulan Sorular

**S: Neden Firebase gerekli?**
A: Uygulama auth (giriş/kayıt) ve veri saklama için Firebase kullanıyor.

**S: Firebase olmadan çalışır mı?**
A: Hayır, ancak SafeMode aktif olduğu için crash olmaz. Sadece giriş/kayıt ekranı çalışmaz.

**S: Firebase ücretsiz mi?**
A: Evet! Spark (ücretsiz) planı günde binlerce işlem için yeterli.

**S: Production'da ne yapmalıyım?**
A: Firestore Security Rules'u güncellemelisiniz:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
