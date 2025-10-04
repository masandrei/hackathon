# 03. Design System

## Design Tokens (CSS Variables / Tailwind Config)

### Kolory

```css
/* Paleta główna (ZUS-adjacent) */
--green: #00993F;      /* Akcent pozytywny, sukces */
--navy: #00416E;       /* Nagłówki, elementy ważne */
--amber: #FFB34F;      /* Ostrzeżenia, highlight */
--gray: #BEC3CE;       /* Tekst pomocniczy, borders */
--blue: #3F84D2;       /* Linki, akcje */
--red: #F05E5E;        /* Błędy, destrukcyjne akcje */

/* Neutralne */
--ink: #0B1220;        /* Tekst główny */
--bg: #FFFFFF;         /* Tło główne */
--bg-elev: #F6F8FA;    /* Tło elevated (karty, modalne) */
```

### Tailwind Config Extension

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        green: '#00993F',
        navy: '#00416E',
        amber: '#FFB34F',
        gray: '#BEC3CE',
        blue: '#3F84D2',
        red: '#F05E5E',
        ink: '#0B1220',
        bg: '#FFFFFF',
        'bg-elev': '#F6F8FA',
      }
    }
  }
}
```

## Typografia

### Font
**Inter** - system font fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`

### Skala typograficzna

| Element | Size | Line Height | Weight | Usage |
|---------|------|-------------|--------|-------|
| H1 | 40px | 48px | 700 | Page titles |
| H2 | 32px | 40px | 700 | Section headers |
| H3 | 24px | 32px | 600 | Card titles, subsections |
| Body (L) | 18px | 28px | 400 | Long-form content |
| Body (M) | 16px | 24px | 400 | Default text |
| Small | 14px | 20px | 400 | Captions, meta |
| Tiny | 12px | 16px | 500 | Labels, badges |

### Tailwind Classes

```js
// Przykłady użycia
<h1 className="text-[40px] leading-[48px] font-bold">
<h2 className="text-[32px] leading-[40px] font-bold">
<h3 className="text-2xl leading-8 font-semibold">
<p className="text-lg leading-7">        // Body L
<p className="text-base leading-6">     // Body M
<span className="text-sm leading-5">   // Small
<span className="text-xs leading-4 font-medium"> // Tiny
```

## Spacing System (8pt Grid)

```
4px   = 0.5  (0.5 * 8)
8px   = 1    (1 * 8)
16px  = 2    (2 * 8)
24px  = 3    (3 * 8)
32px  = 4    (4 * 8)
40px  = 5    (5 * 8)
48px  = 6    (6 * 8)
64px  = 8    (8 * 8)
80px  = 10   (10 * 8)
96px  = 12   (12 * 8)
```

## Layout

- **Max-width**: 1200px (container)
- **Grid**: 12 kolumn
- **Gutters**: 24px (desktop), 16px (mobile)
- **Breakpoints**: sm(640px), md(768px), lg(1024px), xl(1280px)

## Border Radius

```css
--radius-sm: 8px;   /* Małe elementy (badges, chips) */
--radius-md: 16px;  /* Standardowe (buttons, inputs, cards) */
--radius-lg: 20px;  /* Duże (modals, sheets) */
```

## Shadows

```css
/* Subtelne cienie dla elevated elements */
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.05);
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.08);
```

## Komponenty bazowe (shadcn/ui + custom)

### Przyciski
- **Button**: Primary, Secondary, Ghost, Destructive
- **IconButton**: Tylko ikona, z tooltipem

### Formularze
- **Input**: z maskami (data, telefon)
- **Textarea**: z auto-grow
- **Select**: natywny + Combobox (search)
- **Checkbox**, **Radio**, **Switch**

### Nawigacja
- **Tabs**: poziome, pionowe
- **Breadcrumbs**
- **Pagination**

### Feedback
- **Toast**: Success, Error, Warning, Info
- **Alert**: Inline alerts
- **Progress**: Bar, Circle, Indeterminate
- **Skeleton**: Loading placeholders

### Overlays
- **Dialog** (Modal): Focus trap
- **Sheet** (Drawer): Slide-in z boku
- **Popover**: Pozycjonowany tooltip
- **Tooltip**: Hover/focus hints

### Data Display
- **Card**: Podstawowy kontener
- **Badge** / **Tag**: Kolorowe, removable
- **Chip**: Filtry, multi-select
- **Empty State**: Ilustracja + CTA
- **Accordion**: Rozwijalne sekcje

## Wizualne Patterny (custom)

### 1. Card-stack (Lista wpisów)
```
┌─────────────────────────────┐
│ Tytuł wpisu                 │
│ Mini-wycinek treści...      │
│ [Tag1] [Tag2]     📅 2 dni  │
└─────────────────────────────┘
```

### 2. Timeline (Historia wersji)
```
Dziś ●─────────● 2 dni temu ─────────○ 1 tydzień
     │         │                       │
     v1.3      v1.2                   v1.1
```

### 3. Diff Viewer
- **Side-by-side**: Dwie kolumny (stara | nowa)
- **Inline**: Unified diff z highlight

### 4. Smart Search Bar
```
┌──────────────────────────────────────────────┐
│ 🔍 Szukaj...  [×Tag1] [×2024-10] [Sortuj ▾] │
└──────────────────────────────────────────────┘
```

### 5. Inspector Panel
```
┌─ Main Content ──┬─ Inspector ─┐
│                 │              │
│ Treść wpisu...  │ Metadane:    │
│                 │ • Utworzono  │
│                 │ • Edytowano  │
│                 │ • Tagi       │
│                 │ [Quick Edit] │
└─────────────────┴──────────────┘
```

## Motion & Animations

### Timing
- **Quick**: 120ms (hover states, tooltips)
- **Standard**: 150ms (modals, dropdowns)
- **Slow**: 180ms (page transitions)

### Easing
```css
--ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
```

### Przykłady animacji

```css
/* Fade in + Slide up */
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Prefers Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0ms !important;
    transition-duration: 0ms !important;
  }
}
```

### Framer Motion (opcjonalnie)

```tsx
// Przykład użycia
<motion.div
  initial={{ opacity: 0, y: 6 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
>
  {children}
</motion.div>
```

## Accessibility w Design System

- **Kontrasty**: ≥ 4.5:1 (WCAG AA)
- **Focus rings**: Widoczne, ≥2px, wysokie kontrasty
- **Touch targets**: ≥44x44px (mobilne)
- **Keyboard navigation**: Tab order, Enter/Space actions
- **ARIA**: labels, descriptions, live regions

