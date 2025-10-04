# Implementation Notes - ZUS Pension Calculator

## ✅ Zaimplementowano zgodnie z XML Figma

### Typografia
- **Font**: Avenir (z fallbackiem systemowym)
- **Mono**: JetBrains Mono dla #RAND0M6
- **Rozmiary**: Dokładnie z XML (72px h1, 30px p, 26px input, 20px nav)

### Kolory (z XML)
- Tekst główny: `#000` (czarny)
- Tekst pomocniczy: `#626262`, `#afafaf`
- Nawigacja: `#006e2d` (zielony ZUS)
- CTA button: `#ffb34f` (amber/pomarańczowy)
- Cookie banner: `#002911` (ciemnozielony)
- Info cards: `#00416e` (navy)

### Wymiary (px-perfect z XML)
- Header: 107px height
- Input: 520x79px, rounded 24px
- CTA Button: 312x65px, rounded 22px
- Auth buttons: 217x42px i 200x42px, rounded 4px
- Info cards: 350x149px, rounded 24px
- Cookie banner: 82px height

### Struktura zgodna z XML
```
SCREEN (1728x1117)
├── Header (logo + nav + auth)
├── Hero Section
│   ├── Title (72px Avenir)
│   ├── Subtitle (30px)
│   ├── Input (520x79px)
│   ├── CTA Button (312x65px)
│   └── Info Cards (350x149px x2)
├── Chart Area (right column)
└── Cookie Banner (82px fixed bottom)
```

## 📦 Wymagane Assets

Należy dodać do `/public/assets/`:

1. **image_a6f7d465.png** - Logo ZUS z zielonym falującym podkreśleniem
2. **image_1f5d9df6.png** - Ikona żarówki (lightbulb) 48x48px
3. **image_5d2a2d19.png** - Ilustracja sowy (owl mascot)
4. **image_a65f7b7c.png** - Wykres słupkowy (chart)

## 🔤 Fonty

### Inter (z Google Fonts)
Używamy **Inter** jako zamiennika dla Avenir (komercyjny font niedostępny dla web).
Inter jest bardzo podobny wizualnie do Avenir.

```html
<!-- Wczytywane z Google Fonts w <head> -->
https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800
```

### JetBrains Mono (z Google Fonts)
Dla `#RAND0M6` w headerze.

```html
https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700
```

### Fallback Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
```

## 🎨 Różnice względem pierwszej implementacji

| Element | Przed | Po (XML) |
|---------|-------|----------|
| Font | Inter | Inter (zamiennik Avenir) + JetBrains Mono |
| H1 size | 56px | 72px |
| Paragraph | 18px | 30px |
| Input height | 56px | 79px |
| Button style | rounded-full | rounded-[22px] |
| Logo | SVG text | Image (PNG) |
| Nav color | #6B7280 | #006e2d |

## 🚀 Responsive Behavior

- Desktop: 1728px design basis
- Tablet: Grid kolaps do 1 kolumny
- Mobile: Zachowane proporcje, zmniejszone spacing
- Touch targets: ≥44px zgodnie z WCAG

## ♿ Accessibility (WCAG 2.2 AA)

- ✅ Kontrasty kolorów sprawdzone
- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Focus indicators
- ✅ Skip links (w headerze)

## 📝 Następne kroki

1. Dodaj rzeczywiste pliki obrazów do `/public/assets/`
2. Dodaj pliki fontów Avenir do `/public/fonts/` (opcjonalnie)
3. Zaimplementuj Chart komponent (Recharts)
4. Podłącz API do formularza
5. Dodaj walidację React Hook Form + Zod

