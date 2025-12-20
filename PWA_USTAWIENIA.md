# ⚙️ Ustawienia PWA (Progressive Web App)

## 📍 Lokalizacje ustawień

PWA ma ustawienia w **dwóch miejscach**:

### 1. `/public/manifest.json` - Manifest PWA
### 2. `/src/app/layout.tsx` - Next.js Metadata

---

## 🎨 Plik `manifest.json` - Dostępne opcje

### **Aktualnie ustawione:**

```json
{
  "name": "RiseGen - Stowarzyszenie",              // Pełna nazwa (wyświetlana przy instalacji)
  "short_name": "RiseGen",                         // Krótka nazwa (pod ikoną na ekranie)
  "description": "Opis aplikacji",                 // Opis widoczny w sklepie/instalacji
  "start_url": "/",                                // Strona startowa po otwarciu PWA
  "display": "standalone",                         // Tryb wyświetlania (patrz poniżej)
  "background_color": "#ffffff",                   // Kolor tła splash screen
  "theme_color": "#4F46E5",                        // Kolor paska narzędzi/statusu
  "orientation": "portrait-primary",               // Preferowana orientacja
  "icons": [...]                                   // Ikony aplikacji
}
```

### **Opcje display:**
- `"standalone"` ✅ **(zalecane)** - Jak natywna app (bez paska przeglądarki)
- `"fullscreen"` - Pełny ekran (ukrywa wszystko)
- `"minimal-ui"` - Minimalne UI przeglądarki
- `"browser"` - Normalny widok przeglądarki

### **Opcje orientation:**
- `"portrait-primary"` ✅ **(domyślne)** - Pionowo
- `"landscape-primary"` - Poziomo
- `"any"` - Dowolna orientacja
- `"portrait"` - Tylko pionowo
- `"landscape"` - Tylko poziomo

### **Dodatkowe opcje** (możesz dodać):

```json
{
  "categories": ["social", "productivity"],        // Kategorie w app store
  "screenshots": [                                 // Screenshots dla sklepu
    {
      "src": "/screenshot1.png",
      "sizes": "1280x720",
      "type": "image/png"
    }
  ],
  "shortcuts": [                                   // Skróty (long press na ikonie)
    {
      "name": "Projekty",
      "url": "/projekty",
      "description": "Zobacz nasze projekty"
    }
  ],
  "lang": "pl",                                    // Język główny
  "dir": "ltr",                                    // Kierunek tekstu (ltr/rtl)
  "scope": "/",                                    // Zakres URL PWA
  "prefer_related_applications": false,            // Preferuj native app?
  "related_applications": []                       // Linki do native apps
}
```

---

## 🍎 Plik `layout.tsx` - Metadata (Apple & więcej)

### **Aktualnie ustawione:**

```tsx
appleWebApp: {
  capable: true,                    // Czy działa jako webapp na iOS
  statusBarStyle: 'default',        // Styl paska statusu (patrz poniżej)
  title: "RiseGen",                 // Tytuł na iOS
}
```

### **Opcje statusBarStyle:**
- `'default'` ✅ - Biały tekst (na ciemnym tle)
- `'black'` - Czarny pasek
- `'black-translucent'` - Przezroczysty czarny

### **Dodatkowe opcje Apple:**

```tsx
appleWebApp: {
  capable: true,
  statusBarStyle: 'default',
  title: "RiseGen",
  startupImage: [                   // Splash screens dla różnych urządzeń
    {
      url: '/splash-iphone.png',
      media: '(device-width: 375px) and (device-height: 812px)'
    }
  ]
}
```

---

## 🎨 Kolory - Gdzie zmieniać?

### **Theme Color (kolor paska narzędzi):**

**manifest.json:**
```json
"theme_color": "#4F46E5"    // Indigo
```

**Inne popularne kolory:**
- `"#3B82F6"` - Blue
- `"#10B981"` - Green  
- `"#F59E0B"` - Amber
- `"#EF4444"` - Red
- `"#8B5CF6"` - Purple

### **Background Color (splash screen):**

```json
"background_color": "#ffffff"    // Biały
```

---

## 🚀 Zaawansowane funkcje PWA

### **1. Service Worker (Offline Mode)**

Aby działała offline, zainstaluj `next-pwa`:

```bash
npm install next-pwa
```

Utwórz `/next.config.js`:
```js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 1 rok
        }
      }
    }
  ]
})

module.exports = withPWA({
  // Twoja istniejąca konfiguracja
})
```


### **3. Share Target API**

Pozwala udostępniać rzeczy DO twojej PWA:
```json
{
  "share_target": {
    "action": "/share",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url"
    }
  }
}
```

---

## 📋 Checklist - Co powinieneś dostosować:

### **Mandatory (obowiązkowe):**
- [x] `name` - Pełna nazwa organizacji
- [x] `short_name` - Krótka nazwa (max 12 znaków)
- [x] `description` - Opis aplikacji
- [x] `theme_color` - Kolor marki
- [x] Ikony (192x192 i 512x512)

### **Recommended (zalecane):**
- [ ] `screenshots` - Zrzuty ekranu (dla Chrome App Install)
- [ ] `shortcuts` - Skróty dla użytkowników
- [ ] `categories` - Kategorie aplikacji
- [ ] Apple splash screens - Dla lepszego UX na iOS

### **Optional (opcjonalne):**
- [ ] Service Worker - Offline mode
- [ ] Share Target API

---

## 🧪 Testowanie PWA

### **1. Chrome DevTools:**
```
F12 → Application → Manifest
```
Sprawdza poprawność manifest.json

### **2. Lighthouse Audit:**
```
F12 → Lighthouse → Generate report
```
Ocenia jakość PWA (0-100 punktów)

### **3. Test instalacji:**
- Desktop: Chrome pokaże ikonę instalacji w pasku adresu
- Mobile: "Dodaj do ekranu głównego" w menu przeglądarki

---

## 🔗 Przydatne narzędzia:

- **Manifest Generator**: https://www.simicart.com/manifest-generator.html
- **PWA Builder**: https://www.pwabuilder.com/
- **Icon Generator**: https://realfavicongenerator.net/
- **Splash Screen Generator**: https://appsco.pe/developer/splash-screens

---

## ❓ FAQ

**Q: Czy PWA działa offline?**  
A: Nie automatycznie. Musisz zainstalować `next-pwa` i skonfigurować Service Worker.

**Q: Czy mogę mieć różne ikony dla iOS i Android?**  
A: Tak, użyj różnych wpisów w `icons` z różnymi `sizes` i `purpose`.

**Q: Jak zmienić kolor aplikacji?**  
A: Zmień `theme_color` w manifest.json

**Q: Czy mogę wyłączyć PWA?**  
A: Tak, usuń `/public/manifest.json` i link `manifest` z layout.tsx

---

**Potrzebujesz więcej pomocy?** Sprawdź oficjalną dokumentację:
- https://web.dev/progressive-web-apps/
- https://developer.mozilla.org/en-US/docs/Web/Manifest
