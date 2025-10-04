# ZUS Pension Calculator - Guidelines & Documentation

⚠️ **UWAGA**: Ten folder początkowo zawierał wytyczne dla innego projektu (Memory-Bank). 
Został zaktualizowany o rzeczywisty projekt: **Kalkulator Emerytur ZUS**.

## 🎯 Rzeczywisty projekt

**Kalkulator Emerytur ZUS** - aplikacja webowa do symulacji przyszłej emerytury
- Frontend: Next.js 15 + TypeScript + Tailwind v4 + shadcn/ui
- Backend: FastAPI z REST API (istniejący)
- Design: Pixel-perfect z Figma XML
- Status: ✅ MVP Frontend ukończony (4 października 2025)

## 📚 Dokumentacja rzeczywistego projektu

### 🌟 Główne dokumenty (START HERE)
1. **[00-ACTUAL-PROJECT.md](00-ACTUAL-PROJECT.md)** ⭐ - Kompletny przegląd projektu
2. **[../IMPLEMENTATION-NOTES.md](../IMPLEMENTATION-NOTES.md)** - Szczegóły implementacji
3. **[../FONTS-INFO.md](../FONTS-INFO.md)** - Konfiguracja fontów (Inter + JetBrains Mono)

### 📖 Wytyczne zastosowane (z Memory-Bank brief)
Te dokumenty są wartościowe jako **design guidelines** i zostały **zastosowane** w projekcie:

- ✅ **[03-design-system.md](03-design-system.md)** - Tokens, typografia, spacing, komponenty
  - Kolory ZUS: green, navy, amber, blue
  - 8pt spacing grid
  - Border radius 16-24px
  - Motion: 120-180ms, cubic-bezier(.2,.8,.2,1)

- ✅ **[08-accessibility.md](08-accessibility.md)** - WCAG 2.2 AA compliance
  - Kontrasty ≥4.5:1
  - Keyboard navigation
  - ARIA labels
  - Focus traps
  - Touch targets ≥44px

- ✅ **[07-performance.md](07-performance.md)** - Budżety i optymalizacje
  - Bundle budgets (JS ≤200kB, CSS ≤50kB)
  - Core Web Vitals
  - Lazy loading
  - Code splitting

### ⚠️ Dokumenty NIE stosowane (dotyczą Memory-Bank)
- ❌ **01-project-overview.md** - cel i stack Memory-Bank (nie ZUS)
- ❌ **02-routing-navigation.md** - routing dla notes app (inna struktura)
- ❌ **04-data-model.md** - model dla offline notes (używamy API)
- ❌ **05-state-architecture.md** - IndexedDB + offline (nie używamy)
- ❌ **06-features.md** - funkcje notes app (CRUD, tags, wersjonowanie)
- ❌ **09-testing-i18n.md** - testy do zaimplementowania później
- ❌ **10-fixtures.md** - przykładowe dane dla notes app

---

## ✅ Co zostało zaimplementowane

### Layout & Komponenty
```
✅ src/components/Header.tsx
  - Logo ZUS + #RAND0M6 (JetBrains Mono)
  - Nawigacja: Start, Dashboard, Dane & Metody, Pomoc/FAQ
  - Auth buttons: Zarejestruj + Zaloguj do PUE/eZUS

✅ src/components/ChartPlaceholder.tsx
  - Wykres słupkowy 2005-2045
  - Zielona linia trendu z kropkami
  - Labels 200%, 300%

✅ src/components/OwlMascot.tsx
  - Placeholder dla maskotki sowy
  - Badge "💡 AI Asystent"

✅ src/app/page.tsx
  - Hero section z formularzem
  - Input emerytury (520×79px)
  - CTA button "Przejdź do symulacji" (312×65px)
  - Info cards "Czy wiesz, że..." (2x 350×149px)
  - Cookie banner (82px fixed bottom)

✅ src/components/ui/
  - button.tsx (shadcn/ui)
  - input.tsx (shadcn/ui)
  - card.tsx (shadcn/ui)
  - tooltip.tsx (shadcn/ui)
```

### Design System
```css
✅ Kolory ZUS (z Figma XML)
--green: #00993F
--navy: #00416E
--amber: #ffb34f
--blue: #3F84D2
--gray: #BEC3CE

✅ Typografia
Font: Inter (Google Fonts) - zamiennik Avenir
Mono: JetBrains Mono (Google Fonts)
H1: 72px / 100px line-height
Body: 30px / 42px
Input: 26px

✅ Spacing
8pt grid system
Container: max-w-7xl (1280px)
Padding: px-4 sm:px-6 lg:px-8

✅ Border Radius
Small: 4px (auth buttons)
Medium: 22-24px (inputs, cards)
Large: rounded-full (nie używany w tym projekcie)
```

### Responsywność
```
✅ Desktop: 1728px (design basis)
✅ Tablet: lg breakpoint (1024px)
✅ Mobile: sm breakpoint (640px)
✅ Grid: lg:grid-cols-[1fr_1.1fr]
```

### Accessibility (WCAG 2.2 AA)
```
✅ Kontrasty sprawdzone (≥4.5:1)
✅ Keyboard navigation
✅ ARIA labels na buttons i inputs
✅ Tooltips z pomocniczymi informacjami
✅ Focus indicators (blue ring)
✅ Touch targets ≥44px
```

---

## 📦 Assets

Dodane do `/public/assets/`:
- ✅ **Bulb_image.png** - ikona żarówki (info cards)
- ✅ **Owl_image.png** - grafika sowy (maskotka)
- ⏳ **image_a6f7d465.png** - logo ZUS (placeholder w kodzie)
- ⏳ **image_a65f7b7c.png** - wykres (placeholder w kodzie)

---

## 🚀 Quick Start

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

---

## 📊 API Integration (TODO)

### Backend Endpoints (istniejące)
- `POST /calculations` - submit kalkulacji
- `GET /calculations/{id}` - szczegóły
- `GET /calculations/{id}/download` - PDF

### Model danych
```typescript
CalculationRequest {
  expectedPension: string;  // ← główny input w UI
  age: number;
  sex: 'male' | 'female';
  salary: string;
  jobs: Job[];
  leaves: Leave[];
  // ... więcej pól
}
```

---

## 🎯 Następne kroki

1. ⏳ Integracja formularza z API
2. ⏳ React Hook Form + Zod walidacja
3. ⏳ Strony: /dashboard, /dane-metody, /pomoc
4. ⏳ Recharts dla wykresu (zamienić placeholder)
5. ⏳ Testy: Vitest + Playwright
6. ⏳ Podłączyć rzeczywiste obrazy (logo ZUS)

---

## 💡 Priorytet (zachowany z guidelines)

- **UX szybkości** - ≤60s do pierwszej symulacji
- **Klarowność informacji** - prosty, intuicyjny formularz
- **Dostępność** - WCAG 2.2 AA
- **Wydajność** - LCP ≤2.5s, bundle budgets

---

**Ostatnia aktualizacja**: 4 października 2025  
**Projekt**: Kalkulator Emerytur ZUS (#RAND0M6)  
**Status**: ✅ Frontend MVP ukończony, gotowy do API integration

