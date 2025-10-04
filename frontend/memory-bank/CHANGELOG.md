# Changelog - Memory Bank Updates

Historia zmian w dokumentacji memory-bank.

---

## [2.0.1] - 2025-10-04 - UI Alignment Update

### ✏️ Zaktualizowane
- `11-zus-calculator-specifics.md` — nowe specyfikacje hero (badge PLN, hover CTA), karty „Czy wiesz, że…”, gradientowy wykres, baner cookies
- `12-implementation-summary.md` — aktualny stan komponentów (`page.tsx`, `Header.tsx`, `ChartPlaceholder.tsx`, `OwlMascot.tsx`)
- `_INDEX.md` — status checklista odzwierciedla finalny UI

---

## [2.0.0] - 2025-10-04 - MAJOR UPDATE: Zmiana projektu

### 🔄 Zmiana kontekstu projektu
**Z**: Memory-Bank (offline notes app)  
**Na**: Kalkulator Emerytur ZUS (pension calculator)

### ➕ Dodane pliki
- `00-ACTUAL-PROJECT.md` - Kompletny opis rzeczywistego projektu ZUS
- `11-zus-calculator-specifics.md` - Szczegóły specyficzne dla kalkulatora
- `12-implementation-summary.md` - Podsumowanie implementacji
- `CHANGELOG.md` (ten plik)

### ✏️ Zaktualizowane pliki
- `README.md` - Całkowicie przepisany dla projektu ZUS
  - Dodano status implementacji
  - Dodano opis rzeczywistego stacku
  - Dodano checklistę zaimplementowanych komponentów
  - Oznaczono które guideline są zastosowane (✅) a które nie (❌)

### 📦 Pliki zachowane jako reference (design guidelines)
- `03-design-system.md` - Design tokens, typografia, spacing ✅ STOSOWANE
- `07-performance.md` - Performance budgets ✅ STOSOWANE
- `08-accessibility.md` - WCAG 2.2 AA guidelines ✅ STOSOWANE

### ⚠️ Pliki legacy (nieaktualne dla ZUS)
- `01-project-overview.md` - Cel Memory-Bank (nie ZUS) ❌
- `02-routing-navigation.md` - Routes dla notes app ❌
- `04-data-model.md` - Model IndexedDB (używamy API) ❌
- `05-state-architecture.md` - Offline architecture (nie stosujemy) ❌
- `06-features.md` - Features notes app (CRUD, tags) ❌
- `09-testing-i18n.md` - Testing setup (do implementacji) ⏳
- `10-fixtures.md` - Fixtures dla notes app ❌

---

## [1.0.0] - 2025-10-04 - Inicjalna wersja

### ➕ Utworzone (Memory-Bank guidelines - pierwotny brief)
- `README.md` - Indeks dokumentacji Memory-Bank
- `01-project-overview.md` - Cel projektu Memory-Bank (offline notes)
- `02-routing-navigation.md` - 9 widoków, Nielsen heuristics
- `03-design-system.md` - Tokens, komponenty, motion
- `04-data-model.md` - TypeScript types (Tag, MemoryEntry)
- `05-state-architecture.md` - Zustand, IndexedDB, SW
- `06-features.md` - MVP + Plus features
- `07-performance.md` - Budżety, Core Web Vitals
- `08-accessibility.md` - WCAG 2.2 AA
- `09-testing-i18n.md` - Vitest, Playwright, i18n
- `10-fixtures.md` - Przykładowe dane JSON

**Uwaga**: Te pliki były dla innego projektu (Memory-Bank brief), ale zawierają wartościowe wytyczne designu.

---

## Przyszłe aktualizacje (planowane)

### [2.1.0] - API Integration
- Dodać dokumentację integracji z UserService
- Opisać flow submit calculation
- Error handling guidelines
- Loading states patterns

### [2.2.0] - Additional Pages
- `/dashboard` - lista kalkulacji
- `/dane-metody` - metodologia
- `/pomoc` - FAQ
- `/calculations/[id]` - szczegóły wyników

### [2.3.0] - Testing
- Unit tests setup (Vitest)
- E2E tests (Playwright)
- Accessibility tests (axe)
- Performance monitoring

### [2.4.0] - Advanced Features
- Recharts integration
- React Hook Form + Zod
- Multi-step wizard
- PDF download

---

**Ostatnia aktualizacja**: 4 października 2025  
**Wersja**: 2.0.0  
**Projekt**: ZUS Pension Calculator (#RAND0M6)

