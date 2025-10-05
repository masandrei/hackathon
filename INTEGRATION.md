# 🔗 Dokumentacja Integracji Frontend ↔ Backend

## 📊 Status Integracji

✅ **Ukończone:**
- Konfiguracja zmiennych środowiskowych
- Poprawiona konfiguracja OpenAPI client
- Poprawiony endpoint exportu w AdminService (`/calculations/export`)
- Refactor Admin Panel na użycie API client
- Dodano StatisticsService dla endpointów statystyk
- Dodano hook `useApiHealth` do monitorowania stanu API
- Dodano komponent `ApiStatusIndicator`
- Automatyczny fallback na mock data gdy backend niedostępny

## 🏗️ Architektura

### Backend (FastAPI)
**Lokalizacja:** `/backend/src/hackathon/main.py`

**Dostępne endpointy:**
```
POST   /calculations              - Tworzenie kalkulacji
GET    /calculations/{id}         - Pobieranie szczegółów kalkulacji
GET    /calculations              - Lista kalkulacji (admin, z paginacją)
GET    /calculations/export       - Export wszystkich kalkulacji do XLS
GET    /statistics                - Wszystkie statystyki
GET    /statistics/growth-rate    - Tempo wzrostu
GET    /statistics/average-wage   - Średnie wynagrodzenie
GET    /statistics/valorization   - Waloryzacja
GET    /statistics/inflation      - Inflacja
GET    /health                    - Health check
POST   /calculations/analyze      - Analiza z Gemini AI
POST   /chat/owl                  - Chat z maskotką ZUŚka
GET    /chat/owl/info             - Info o maskotce
```

**Konfiguracja CORS:** Backend ma włączone CORS dla wszystkich origins (development).

### Frontend (Next.js)
**Lokalizacja:** `/frontend/src/`

**API Client:**
- `src/api-client/` - Wygenerowany z OpenAPI (z modyfikacjami)
- `src/lib/api-config.ts` - Centralna konfiguracja API

**Serwisy:**
- `UserService` - Endpointy użytkownika (submit, get, download)
- `AdminService` - Endpointy admina (list, export)
- `StatisticsService` - Statystyki i health check

**Hooki:**
- `useApiHealth` - Monitorowanie stanu API

**Komponenty:**
- `ApiStatusIndicator` - Wizualny wskaźnik stanu API

## 🚀 Jak uruchomić

### 1. Backend

```bash
cd backend

# Instalacja zależności (Poetry)
poetry install

# Uruchomienie
poetry run uvicorn hackathon.main:app --reload --host 127.0.0.1 --port 8000
```

Backend będzie dostępny pod: `http://localhost:8000`
Dokumentacja API: `http://localhost:8000/docs`

### 2. Frontend

```bash
cd frontend

# Instalacja zależności
npm install

# Utworzenie pliku .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_ENV=development
EOF

# Uruchomienie
npm run dev
```

Frontend będzie dostępny pod: `http://localhost:3000`

## 📝 Przykłady użycia

### 1. Tworzenie kalkulacji (Step6Summary)

```typescript
import { UserService } from '@/api-client';
import type { CalculationRequest } from '@/api-client/models/CalculationRequest';

const requestData: CalculationRequest = {
  calculationDate: "2025-10-05",
  calculationTime: "12:00:00",
  expectedPension: "5000.00",
  age: 30,
  sex: "male",
  salary: "8000.00",
  isSickLeaveIncluded: true,
  totalAccumulatedFunds: "0.00",
  yearWorkStart: 2020,
  yearDesiredRetirement: 2055,
  jobs: [],
  leaves: [],
};

try {
  const response = await UserService.submitCalculation(requestData);
  console.log('Calculation ID:', response.calculationId);
} catch (error) {
  console.error('Error:', error);
  // Aplikacja automatycznie używa mock data jako fallback
}
```

### 2. Lista kalkulacji (Admin Panel)

```typescript
import { AdminService } from '@/api-client';

try {
  const data = await AdminService.listCalculations(1, 20);
  console.log('Submissions:', data.submissions);
  console.log('Total:', data.totalItems);
} catch (error) {
  console.error('Error:', error);
  // Graceful fallback - pokazuje pusty stan
}
```

### 3. Export do XLS (Admin Panel)

```typescript
import { AdminService } from '@/api-client';

try {
  const blob = await AdminService.downloadAllCalculations('pl-PL');
  
  // Pobierz plik
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `obliczenia-${new Date().toISOString().split('T')[0]}.xlsx`;
  link.click();
} catch (error) {
  alert('Backend niedostępny. Sprawdź czy serwer działa.');
}
```

### 4. Statystyki

```typescript
import { StatisticsService } from '@/api-client';

// Wszystkie statystyki
const stats = await StatisticsService.getStatistics();

// Tylko średnie wynagrodzenie
const wages = await StatisticsService.getAverageWage();

// Health check
const health = await StatisticsService.healthCheck();
console.log('API Status:', health.status); // "healthy"
```

### 5. Monitorowanie stanu API

```typescript
import { useApiHealth } from '@/hooks/useApiHealth';

function MyComponent() {
  // Sprawdź raz przy montowaniu
  const { isHealthy, isChecking, refetch } = useApiHealth();
  
  // LUB: Sprawdzaj co 30 sekund
  const status = useApiHealth(30000);
  
  return (
    <div>
      Status: {isHealthy ? '✅ Online' : '❌ Offline'}
      <button onClick={refetch}>Odśwież</button>
    </div>
  );
}
```

## 🔧 Konfiguracja

### Zmienne środowiskowe

**Plik:** `frontend/.env.local`

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000  # URL do backendu
NEXT_PUBLIC_API_TIMEOUT=10000                   # Timeout (ms)
NEXT_PUBLIC_ENV=development                      # development/production
```

**⚠️ Ważne:**
- Restart Next.js wymagany po zmianie `.env.*`
- Prefix `NEXT_PUBLIC_` jest **obowiązkowy** dla zmiennych w przeglądarce
- Plik `.env.local` jest w `.gitignore` (nie commituj!)

### Zmiana URL API

**Development:**
Edytuj `.env.local`

**Production:**
1. Utwórz `.env.production`
2. Ustaw `NEXT_PUBLIC_API_BASE_URL=https://your-api.com`
3. Deploy

## 🐛 Troubleshooting

### Problem: "Failed to fetch"

**Przyczyny:**
1. Backend nie działa
2. Zły URL w `.env.local`
3. Problem z CORS

**Rozwiązanie:**
```bash
# 1. Sprawdź czy backend działa
curl http://localhost:8000/health

# 2. Sprawdź URL w przeglądarce
console.log(process.env.NEXT_PUBLIC_API_BASE_URL)

# 3. Sprawdź logi backendu czy są błędy CORS
```

**Fallback:** Frontend automatycznie używa mock data w development mode.

### Problem: Dane nie są aktualne

**Rozwiązanie:**
```bash
# Wyczyść cache Next.js
rm -rf .next
npm run dev
```

### Problem: TypeScript pokazuje błędy typów

**Rozwiązanie:**
```bash
# Zregeneruj API client
npx openapi-typescript-codegen --input ../../openapi.json --output ./src/api-client
```

## 📦 Struktura plików

```
frontend/
├── .env.local                      # Zmienne środowiskowe (NIE commituj)
├── src/
│   ├── api-client/                 # Wygenerowany API client
│   │   ├── core/
│   │   │   └── OpenAPI.ts         # ✅ ZMODYFIKOWANY (env vars)
│   │   ├── services/
│   │   │   ├── UserService.ts     # ✅ Generowany
│   │   │   ├── AdminService.ts    # ✅ POPRAWIONY (/export)
│   │   │   └── StatisticsService.ts # ✅ DODANY ręcznie
│   │   ├── models/                # Generowane typy
│   │   └── index.ts               # ✅ ZAKTUALIZOWANY (exports)
│   ├── lib/
│   │   └── api-config.ts          # ✅ NOWY - Centralna konfiguracja
│   ├── hooks/
│   │   └── useApiHealth.ts        # ✅ NOWY - Hook health check
│   ├── components/
│   │   ├── ApiStatusIndicator.tsx # ✅ NOWY - Wskaźnik stanu API
│   │   └── simulator/
│   │       └── steps/
│   │           └── Step6Summary.tsx # ✅ Używa UserService
│   └── app/
│       └── admin/
│           └── page.tsx           # ✅ ZREFACTOROWANY (AdminService)
└── ENV_VARIABLES.md               # ✅ NOWY - Dokumentacja env vars
```

## ✅ Checklist Wdrożenia

- [x] Backend uruchomiony na port 8000
- [x] Frontend uruchomiony na port 3000
- [x] Utworzony plik `.env.local`
- [x] Sprawdzony endpoint `/health`
- [x] Przetestowana kalkulacja w symulatorze
- [x] Przetestowany admin panel
- [x] Przetestowany export XLS
- [ ] **DO ZROBIENIA:** Test wszystkich endpointów
- [ ] **DO ZROBIENIA:** Test produkcyjny z prawdziwym API URL

## 🎯 Co dalej

### Opcjonalne rozszerzenia:

1. **Chat z maskotką ZUŚka**
   - Endpoint: `POST /chat/owl`
   - Dodaj komponent `OwlChat` na stronie głównej

2. **Strona ze statystykami**
   - Wykorzystaj `StatisticsService.getStatistics()`
   - Dodaj wykresy z danymi historycznymi

3. **Analiza Gemini AI**
   - Endpoint: `POST /calculations/analyze`
   - Integruj z podsumowaniem kalkulacji

4. **Pobieranie PDF**
   - Endpoint: `GET /calculations/{id}/download`
   - Wykorzystaj `UserService.downloadCalculationById()`

5. **Error Boundary**
   - Dodaj globalny error boundary
   - Integruj z `ApiStatusIndicator`

## 📞 Support

Jeśli masz pytania:
1. Sprawdź logi backendu: `poetry run uvicorn ... --log-level debug`
2. Sprawdź Network tab w DevTools przeglądarki
3. Sprawdź console.log w aplikacji frontend

## 📚 Dokumentacja API

Dokumentacja interaktywna: `http://localhost:8000/docs`
OpenAPI spec: `http://localhost:8000/openapi.json`

