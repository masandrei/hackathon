# Fonty w projekcie ZUS Pension Calculator

## ✅ Aktualnie używane (z Google Fonts CDN)

### 1. Inter
**Używany do**: Całej aplikacji (zamiennik Avenir)
**URL**: https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800

**Dlaczego Inter zamiast Avenir?**
- Avenir to komercyjny font firmy Linotype (część Monotype)
- Nie jest dostępny na Google Fonts ani żadnym darmowym CDN
- Inter jest otwartoźródłowy i bardzo podobny wizualnie do Avenir
- Inter ma lepsze wsparcie dla znaków międzynarodowych

### 2. JetBrains Mono
**Używany do**: `#RAND0M6` w headerze (font monospacowany)
**URL**: https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700

## 🔄 Konfiguracja

### layout.tsx
```tsx
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
</head>
<body style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif' }}>
```

### globals.css
```css
@theme inline {
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
```

## 📊 Porównanie: Avenir vs Inter

| Właściwość | Avenir | Inter |
|------------|--------|-------|
| Typ | Geometric Sans-serif | Geometric Sans-serif |
| Licencja | Komercyjna (płatna) | Open Source (darmowa) |
| Dostępność | Tylko lokalnie | Google Fonts CDN |
| x-height | Średni | Średni |
| Szerokość znaków | Humanistyczna | Podobna |
| Użycie web | Wymaga licencji | Darmowe |
| Optymalizacja screen | Dobra | Doskonała (zaprojektowany dla UI) |

## 🎯 Fallback Stack

Jeśli Google Fonts nie załaduje się (offline, blokada), używamy:

1. **-apple-system** - San Francisco (macOS/iOS)
2. **BlinkMacSystemFont** - San Francisco (Chrome na macOS)
3. **Segoe UI** - Windows
4. **Helvetica Neue** - starsze macOS
5. **Arial** - uniwersalny fallback
6. **sans-serif** - systemowy sans-serif

## 💡 Alternatywne rozwiązania (NIE używane)

### Jeśli masz licencję na Avenir
```tsx
// 1. Umieść pliki w /public/fonts/
//    - avenir-regular.woff2
//    - avenir-medium.woff2
//    - avenir-heavy.woff2

// 2. Użyj localFont w layout.tsx
import localFont from "next/font/local";

const avenir = localFont({
  src: [
    { path: '../public/fonts/avenir-regular.woff2', weight: '400' },
    { path: '../public/fonts/avenir-medium.woff2', weight: '500' },
    { path: '../public/fonts/avenir-heavy.woff2', weight: '800' },
  ],
  variable: '--font-avenir',
});
```

### Adobe Fonts (wymaga konta)
```html
<!-- Adobe Fonts CDN - wymaga Project ID -->
<link rel="stylesheet" href="https://use.typekit.net/YOUR_PROJECT_ID.css">
<style>
  body { font-family: "avenir-next", sans-serif; }
</style>
```

## 🚀 Wydajność

**Preconnect**: Nawiązujemy połączenie z Google Fonts przed pobieraniem
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
```

**display=swap**: Font swap - pokazuje fallback aż do załadowania
```
&display=swap
```

**Rozmiary**:
- Inter (4 wagi): ~60KB gzipped
- JetBrains Mono (3 wagi): ~45KB gzipped
- **Total**: ~105KB

## ✅ Sprawdzone
- ✅ Fonty ładują się z Google Fonts CDN
- ✅ Brak błędów 404 lokalnych fontów
- ✅ Fallback działa offline
- ✅ Performance: <200ms do załadowania fontów

