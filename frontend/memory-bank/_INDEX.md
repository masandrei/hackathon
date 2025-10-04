# 📚 Memory-Bank Index - Szybka Nawigacja

Kompletny indeks dokumentacji projektu **Kalkulator Emerytur ZUS**.

---

## 🌟 START HERE

### Dla nowych członków zespołu:
1. 📖 **[README.md](README.md)** - Przegląd projektu i quick start
2. 🎯 **[00-ACTUAL-PROJECT.md](00-ACTUAL-PROJECT.md)** - Pełny opis projektu ZUS
3. 📝 **[12-implementation-summary.md](12-implementation-summary.md)** - Co zostało zrobione

### Dla deweloperów:
1. 📋 **[../IMPLEMENTATION-NOTES.md](../IMPLEMENTATION-NOTES.md)** - Szczegóły techniczne
2. 🔤 **[../FONTS-INFO.md](../FONTS-INFO.md)** - Konfiguracja fontów
3. 🎨 **[03-design-system.md](03-design-system.md)** - Design tokens i komponenty

---

## 📂 Struktura folderów (15 plików)

### ⭐ Dokumenty projektu ZUS (aktualne)
```
00-ACTUAL-PROJECT.md          Kompletny opis projektu, stack, status
11-zus-calculator-specifics.md Specyfika: flow, API, komponenty (hero, wykres)
12-implementation-summary.md   Podsumowanie: stan UI po aktualizacjach 04.10
CHANGELOG.md                   Historia zmian dokumentacji
README.md                      Główny indeks (ten plik powinien być czytany pierwszy)
_INDEX.md                      Ten plik - szybka nawigacja
```

### ✅ Design Guidelines (STOSOWANE w ZUS)
```
03-design-system.md           Tokens, typografia, spacing, motion ✅
07-performance.md             Budżety, Core Web Vitals, optymalizacje ✅
08-accessibility.md           WCAG 2.2 AA, keyboard nav, ARIA ✅
```

### ⚠️ Legacy docs (Memory-Bank brief - NIE stosowane)
```
01-project-overview.md        Memory-Bank cel i stack ❌
02-routing-navigation.md      Routes dla notes app ❌
04-data-model.md              IndexedDB models ❌
05-state-architecture.md      Offline architecture (Zustand+Dexie) ❌
06-features.md                Features notes app (CRUD, tags) ❌
09-testing-i18n.md            Testing setup (do zaimplementowania) ⏳
10-fixtures.md                Fixtures dla notes app ❌
```

---

## 🎯 Użycie tego folderów

### Scenariusz 1: "Jak zaimplementować nowy komponent?"
```
1. Przeczytaj: 03-design-system.md
   → Znajdź design tokens (kolory, spacing, typografia)
   
2. Zobacz: 12-implementation-summary.md
   → Sprawdź jakie komponenty już istnieją
   
3. Dodaj komponent w: src/components/
   → Użyj tokens z globals.css
   → Zastosuj shadcn/ui pattern
```

### Scenariusz 2: "Jak podłączyć API?"
```
1. Przeczytaj: 11-zus-calculator-specifics.md
   → Zobacz model danych (CalculationRequest)
   
2. Zobacz: src/api-client/
   → UserService.submitCalculation() już istnieje
   
3. Zaimplementuj w komponencie:
   import { UserService } from '@/api-client';
   const result = await UserService.submitCalculation(data);
```

### Scenariusz 3: "Jak dodać nową stronę?"
```
1. Przeczytaj: 02-routing-navigation.md (jako inspiracja struktury)
2. Przeczytaj: 00-ACTUAL-PROJECT.md (sekcja "Następne kroki")
3. Utwórz: src/app/nazwa-strony/page.tsx
4. Użyj: Layout pattern z page.tsx
```

### Scenariusz 4: "Jak zapewnić dostępność?"
```
1. Przeczytaj: 08-accessibility.md
   → WCAG 2.2 AA requirements
   → Keyboard navigation
   → ARIA patterns
   
2. Test: ESLint jsx-a11y plugin
3. Test: Lighthouse accessibility audit
4. Test: Keyboard-only navigation
```

---

## 🗂️ Mapowanie: Design Guideline → Kod

| Guideline | Plik źródłowy | Implementacja | Status |
|-----------|---------------|---------------|--------|
| **Kolory ZUS** | 03-design-system.md | globals.css (lines 47-95) | ✅ |
| **Typografia** | 03-design-system.md | layout.tsx + Google Fonts | ✅ |
| **Spacing** | 03-design-system.md | Tailwind classes (8pt grid) | ✅ |
| **Border radius** | 03-design-system.md | 4px, 22px, 24px (z XML) | ✅ |
| **Motion** | 03-design-system.md | cubic-bezier(.2,.8,.2,1) 120-180ms | ⏳ |
| **Accessibility** | 08-accessibility.md | ARIA labels, keyboard nav | ✅ |
| **Performance** | 07-performance.md | Bundle <200kB, LCP <2.5s | ✅ |
| **Components** | 03-design-system.md | shadcn/ui (button, input, card) | ✅ |

---

## 🔍 Szukasz czegoś konkretnego?

### "Jakie kolory użyć?"
→ **[03-design-system.md](03-design-system.md)** (linia 5-20)
→ **[00-ACTUAL-PROJECT.md](00-ACTUAL-PROJECT.md)** (sekcja "Design Tokens")

### "Jakie wymiary komponentów?"
→ **[11-zus-calculator-specifics.md](11-zus-calculator-specifics.md)** (tabela "Wymiary")
→ **[../IMPLEMENTATION-NOTES.md](../IMPLEMENTATION-NOTES.md)** (sekcja "Wymiary")

### "Jak działa API?"
→ **[00-ACTUAL-PROJECT.md](00-ACTUAL-PROJECT.md)** (sekcja "API Endpoints")
→ **[11-zus-calculator-specifics.md](11-zus-calculator-specifics.md)** (sekcja "Model danych")

### "Jakie testy napisać?"
→ **[09-testing-i18n.md](09-testing-i18n.md)** (przykłady Vitest + Playwright)
→ **[08-accessibility.md](08-accessibility.md)** (testy a11y)

### "Jak zoptymalizować wydajność?"
→ **[07-performance.md](07-performance.md)** (budżety, Core Web Vitals)
→ **[12-implementation-summary.md](12-implementation-summary.md)** (obecne metryki)

### "Co zrobić dalej?"
→ **[00-ACTUAL-PROJECT.md](00-ACTUAL-PROJECT.md)** (sekcja "Następne kroki")
→ **[CHANGELOG.md](CHANGELOG.md)** (planowane wersje)

---

## 📊 Status projektu (snapshot)

### ✅ Ukończone (100%)
- [x] Design System setup
- [x] shadcn/ui installation
- [x] Kolory ZUS + fonty
- [x] Header (sticky, logo ZUS, CTA 4 px)
- [x] Hero section z formularzem (PLN badge, hover amber)
- [x] CTA button (rounded 18 px)
- [x] Info cards (layout jak w makiecie)
- [x] Chart placeholder (gradient bars + linia trendu)
- [x] Owl mascot (final graphic)
- [x] Cookie banner 82 px (tekst + akcje inline)
- [x] Responsywność
- [x] Accessibility (WCAG 2.2 AA)
- [x] Dokumentacja zaktualizowana

### ⏳ W toku (0%)
- [ ] API integration
- [ ] Form validation (Zod)
- [ ] Routing (/dashboard, /pomoc, etc.)
- [ ] Recharts implementation
- [ ] Testy (unit + e2e)

### 🔮 Zaplanowane
- [ ] Multi-step wizard
- [ ] Results page
- [ ] PDF download
- [ ] Authentication flow
- [ ] Dashboard z historią
- [ ] I18n (EN)
- [ ] Analytics tracking

---

## 🔗 External Resources

### Dokumentacja projektu (poza memory-bank)
- `../IMPLEMENTATION-NOTES.md` - Szczegóły implementacji
- `../FONTS-INFO.md` - Inter vs Avenir, Google Fonts setup
- `../components.json` - shadcn/ui config
- `../package.json` - Dependencies list

### API Documentation
- `../../openapi.json` - OpenAPI spec (w root projektu)
- `../src/api-client/` - Auto-generated API client

---

## 🆘 Troubleshooting

### "Fonty się nie ładują"
→ Sprawdź: **[../FONTS-INFO.md](../FONTS-INFO.md)**  
→ Verify: Google Fonts CDN w layout.tsx

### "Kolory nie pasują"
→ Sprawdź: globals.css (lines 47-95)  
→ Verify: CSS variables `--green`, `--navy`, etc.

### "Komponenty shadcn/ui nie działają"
→ Sprawdź: components.json  
→ Reinstall: `npx shadcn@latest add button`

### "Build fails"
→ Check: TypeScript errors (`npm run type-check`)  
→ Check: ESLint (`npm run lint`)

---

## 📞 Kontakt

**Projekt**: Hackathon ZUS #RAND0M6  
**Data**: 4 października 2025  
**Team**: [Twój zespół]  
**Repo**: [Link do repo]

---

**Instrukcja użycia tego indexu**:
1. Zawsze zacznij od README.md
2. Użyj tego _INDEX.md do szybkiej nawigacji
3. Sprawdzaj CHANGELOG.md dla historii zmian
4. Guidelines (03, 07, 08) są uniwersalne - stosuj je!
5. Legacy docs (01, 02, 04-06, 10) - tylko jako inspiracja

