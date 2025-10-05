# Changelog - Memory Bank Updates

Historia zmian w dokumentacji memory-bank.

---

## [3.1.0] - 2025-10-05 - Pension Calculation Integration

### 🧮 Dodane
- **Algorytm kalkulacji emerytury** zintegrowany z POST /calculations
- Backend zwraca obliczone wartości: nominalPension, realPension, replacementRate, averageWage
- Frontend (Step6Summary) wyświetla rzeczywiste obliczenia zamiast mock data
- Rozszerzona CalculationResponse z polami kalkulacji

### 🔧 Zmiany
- `backend/src/hackathon/main.py` - dodana logika kalkulacji w submit_calculation
- `backend/src/hackathon/algorithm.py` - naprawione relative imports
- `backend/src/hackathon/schemas.py` - rozszerzona CalculationResponse
- `frontend/src/api-client/models/CalculationResponse.ts` - zaktualizowany model
- `frontend/src/components/simulator/steps/Step6Summary.tsx` - używa prawdziwych danych

### 📊 Formuła kalkulacji
- **Nominalna:** Oczekiwana emerytura w przyszłości
- **Realna:** Urealniona o inflację (2.5% rocznie) do dzisiejszej wartości
- **Stopa zastąpienia:** Procent średniej krajowej w roku emerytury

### ⚠️ Note
Obecnie używana uproszczona formuła. Pełny algorytm (compute_pension_funds) wymaga refactoringu.

---

## [3.0.1] - 2025-10-05 - Excel Export Blob Fix

### 🐛 Naprawione
- **Excel export download:** API Client teraz poprawnie obsługuje binary responses (blob)
- **Content-Type detection:** Dodano rozpoznawanie Excel, PDF, i innych formatów binarnych
- Funkcja `getResponseBody` w `request.ts` teraz zwraca `blob()` dla plików binarnych

### 📊 Impact
- ✅ Admin Panel: "Pobierz raport XLS" działa poprawnie
- ✅ Gotowość do pobierania PDF (gdy zaimplementowane)
- ✅ Wsparcie dla wszystkich typów binarnych (Excel, PDF, images, etc.)

---

## [3.0.0] - 2025-10-05 - Backend Integration Complete

### 🔗 Full Stack Integration
**Added:** Complete integration of Next.js frontend with FastAPI backend

### ➕ Dodane
- **14-backend-integration.md** — Kompletna dokumentacja integracji backend-frontend
- API Client z konfiguracją zmiennych środowiskowych
- StatisticsService dla endpointów statystyk i health check
- Hook `useApiHealth` i komponent `ApiStatusIndicator`
- 7 nowych plików dokumentacji w root: `INTEGRATION.md`, `QUICK_START.md`, `BACKEND_SETUP.md`, etc.
- Skrypty setup: `START_BACKEND.sh`, `CREATE_ENV_FILE.sh`
- Clean database migration z poprawnym schematem

### 🐛 Naprawione
- **Sex field mapping:** male/female → M/F w backendzie
- **Database schema:** Poprawione nazwy kolumn (calculation_id, calculation_datetime)
- **JSON serialization:** Datetime objects w error responses
- **AdminService:** Endpoint /download → /export
- **CORS errors:** Rozwiązane błędy 500 z proper exception handling
- **Blob responses:** API Client obsługuje binary downloads (Excel, PDF)

### ✏️ Zmienione
- Backend models: Rozdzielone Pydantic (schemas) i SQLAlchemy (models)
- Admin Panel: Refactor na typed API client
- Error handling: Graceful fallback na mock data
- OpenAPI config: Dynamic base URL z environment variables

### 🗄️ Technical
- **Database:** SQLite z migracją `f093b4da986c_initial_schema_with_dbcalculation`
- **API Endpoints:** POST/GET /calculations, GET /calculations/export, GET /health, GET /statistics
- **Environment:** .env.local support z NEXT_PUBLIC_API_BASE_URL
- **Data Storage:** backend/hackathon.db (SQLite)

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

