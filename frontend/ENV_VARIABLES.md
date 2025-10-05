# 🔧 Zmienne Środowiskowe - Konfiguracja

## Dla Deweloperów

### Tworzenie pliku `.env.local`

Utwórz plik `.env.local` w katalogu `/frontend`:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_TIMEOUT=10000

# Environment
NEXT_PUBLIC_ENV=development
```

### Opis zmiennych

| Zmienna | Opis | Domyślna wartość |
|---------|------|------------------|
| `NEXT_PUBLIC_API_BASE_URL` | URL do backendu FastAPI | `http://localhost:8000` |
| `NEXT_PUBLIC_API_TIMEOUT` | Timeout dla requestów API (ms) | `10000` |
| `NEXT_PUBLIC_ENV` | Środowisko (development/production) | `development` |

## Dla Produkcji

### Tworzenie pliku `.env.production`

```bash
# API Configuration - Production
NEXT_PUBLIC_API_BASE_URL=https://your-production-api.com
NEXT_PUBLIC_API_TIMEOUT=15000

# Environment
NEXT_PUBLIC_ENV=production
```

## Weryfikacja

Po uruchomieniu aplikacji, sprawdź w konsoli developerskiej:

```javascript
console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
// Powinno pokazać: http://localhost:8000 (lub Twój URL)
```

## Troubleshooting

### Problem: API zwraca błąd CORS
- Sprawdź czy backend ma poprawną konfigurację CORS
- Backend FastAPI powinien mieć:
  ```python
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["*"],  # lub ["http://localhost:3000"]
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```

### Problem: API nie odpowiada
- Sprawdź czy backend jest uruchomiony: `http://localhost:8000/health`
- Sprawdź czy port `8000` jest dostępny
- Aplikacja frontend automatycznie używa mockowych danych jako fallback

### Problem: Zmienne środowiskowe nie działają
- **Ważne:** Po zmianie plików `.env.*` musisz zrestartować serwer Next.js
- Zatrzymaj: `Ctrl+C`
- Uruchom ponownie: `npm run dev`

## Integracja z API

### Automatyczna konfiguracja
Aplikacja automatycznie konfiguruje API client przy starcie:
- Odczytuje `NEXT_PUBLIC_API_BASE_URL` z env
- Ustawia timeout
- Konfiguruje fallback na mocki w development mode

### Używanie API w kodzie

```typescript
import { UserService, AdminService, StatisticsService } from '@/api-client';

// Przykład 1: Pobieranie obliczeń (admin)
const data = await AdminService.listCalculations(1, 20);

// Przykład 2: Tworzenie kalkulacji
const response = await UserService.submitCalculation(requestData);

// Przykład 3: Pobieranie statystyk
const stats = await StatisticsService.getStatistics();
```

## Health Check

Endpoint sprawdzający czy backend działa:

```bash
curl http://localhost:8000/health
```

Odpowiedź:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-05T12:00:00.000Z"
}
```

## Ważne uwagi

1. **Nie commituj plików `.env.local` i `.env.production`** - są one w `.gitignore`
2. **Zawsze używaj prefixu `NEXT_PUBLIC_`** dla zmiennych dostępnych w przeglądarce
3. **Restart serwera** jest wymagany po każdej zmianie env vars
4. **W production** upewnij się że ustawiono poprawny URL API w `.env.production`

