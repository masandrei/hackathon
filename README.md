# ZUS Simulator

Aplikacja webowa do symulacji przyszłej emerytury z Zakładu Ubezpieczeń Społecznych.

## 🚀 Quick Start

### ⚡ Szybkie uruchomienie z integracją

**Krok 1: Backend** (Terminal 1)
```bash
cd backend
poetry install
poetry run uvicorn hackathon.main:app --reload --port 8000
# ✅ Backend: http://localhost:8000
# 📚 API Docs: http://localhost:8000/docs
```

**Krok 2: Frontend - Konfiguracja** (Terminal 2)
```bash
cd frontend

# Utwórz plik konfiguracyjny .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_ENV=development
EOF

npm install
npm run dev
# ✅ Frontend: http://localhost:3000
```

**📖 Szczegółowy przewodnik:** Zobacz [QUICK_START.md](./QUICK_START.md)

### ✅ Status Integracji

✅ **Frontend ↔ Backend** - W pełni zintegrowane
✅ **Symulator** - Wysyła dane do API
✅ **Admin Panel** - Pobiera listę kalkulacji
✅ **Export XLS** - Działający eksport danych
✅ **Fallback** - Automatyczne mock data gdy backend offline

## 📦 Project Structure

```
hackathon/
├── frontend/              # Next.js 15.5.4 + React 19 + Tailwind CSS v4
│   ├── src/api-client/   # ✅ Zintegrowany API client (OpenAPI)
│   ├── .env.local        # ⚙️ Konfiguracja (utwórz ręcznie)
│   └── ENV_VARIABLES.md  # 📝 Dokumentacja zmiennych env
├── backend/              # FastAPI + Python 3.11 + Poetry
│   └── src/hackathon/   # API endpoints
├── .github/              # GitHub Actions CI/CD
├── INTEGRATION.md        # 🔗 Pełna dokumentacja integracji
├── QUICK_START.md        # ⚡ Szybki start
├── DEPLOYMENT.md         # 🚀 Przewodnik wdrożenia
└── openapi.json          # 📄 OpenAPI specification
```

## 📚 Dokumentacja

| Dokument | Opis |
|----------|------|
| [QUICK_START.md](./QUICK_START.md) | ⚡ Szybkie uruchomienie w 3 krokach |
| [INTEGRATION.md](./INTEGRATION.md) | 🔗 Pełna dokumentacja integracji frontend-backend |
| [BACKEND_SETUP.md](./BACKEND_SETUP.md) | 🔧 Setup backendu + troubleshooting |
| [frontend/ENV_VARIABLES.md](./frontend/ENV_VARIABLES.md) | ⚙️ Konfiguracja zmiennych środowiskowych |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | 🚀 Przewodnik wdrożenia na produkcję |

## 🌐 Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

**⚠️ Ważne przed deploymentem:**
1. Utwórz `.env.production` z prawidłowym API URL
2. Sprawdź konfigurację CORS w backendzie
3. Zobacz szczegóły w [DEPLOYMENT.md](./DEPLOYMENT.md)

### Quick Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd hackathon
vercel
```

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15.5.4 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui + Radix UI
- **Icons:** Lucide React
- **Fonts:** Inter + JetBrains Mono (Google Fonts CDN)
- **Package manager:** npm

### Backend
- **Framework:** FastAPI
- **Language:** Python 3.11
- **Package Manager:** Poetry
- **Database:** SQLite (dev), PostgreSQL (prod)
- **ORM:** SQLAlchemy + Alembic
- **API:** RESTful, OpenAPI 3.0

## 🔧 Development

### 🎯 API Client - Integracja

API client jest **w pełni zintegrowany** z backendem. Używa zmiennych środowiskowych z `.env.local`.

#### Dostępne serwisy:
```typescript
import { UserService, AdminService, StatisticsService } from '@/api-client';

// Tworzenie kalkulacji
await UserService.submitCalculation(data);

// Lista kalkulacji (admin)
await AdminService.listCalculations(page, limit);

// Export do XLS
await AdminService.downloadAllCalculations('pl-PL');

// Statystyki
await StatisticsService.getStatistics();

// Health check
await StatisticsService.healthCheck();
```

#### Regeneracja API Client (po zmianach w openapi.json)

**⚠️ Uwaga:** Niektóre pliki są ręcznie modyfikowane, nie nadpisuj ich!

```bash
cd frontend

# Regeneruj tylko models i podstawowe services
npx openapi-typescript-codegen --input ../openapi.json --output ./src/api-client

# ⚠️ NIE nadpisuj tych plików (są zmodyfikowane):
# - src/api-client/core/OpenAPI.ts (zmienne env)
# - src/api-client/services/AdminService.ts (poprawiony endpoint)
# - src/api-client/services/StatisticsService.ts (ręcznie dodany)
# - src/api-client/index.ts (dodane eksporty)
```

##### Persisting Method Names
- Zawsze ustawiaj `operationId` dla każdego endpointa w `openapi.json`
- Przykład:
  ```json
  "get": {
    "operationId": "getCalculationById",
    ...
  }
  ```

### Front-end

Dev URL: http://localhost:3000

```bash
cd frontend

# Pierwsza konfiguracja
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_ENV=development
EOF

npm install
npm run dev
```

**Strony:**
- `/` - Strona główna z formularzem
- `/symulacja` - Wizard symulacji emerytury (✅ zintegrowany z API)
- `/admin` - Panel administracyjny (✅ zintegrowany z API)
- `/pomoc` - Pomoc i FAQ
- `/trivia` - Ciekawostki

### Back-end

Dev URL: http://localhost:8000

```bash
cd backend
poetry install
poetry run uvicorn hackathon.main:app --reload --port 8000
```

**Interaktywna dokumentacja:** http://localhost:8000/docs

#### Database

Po zmianach w schemacie wykonaj migrację:

```bash
alembic revision --autogenerate -m "<opis migracji>"
alembic upgrade head
```

## 🧪 Testowanie Integracji

### 1. Health Check
```bash
curl http://localhost:8000/health
# {"status":"healthy","timestamp":"..."}
```

### 2. Test kalkulacji
```bash
curl -X POST http://localhost:8000/calculations \
  -H "Content-Type: application/json" \
  -d '{
    "calculationDate": "2025-10-05",
    "calculationTime": "12:00:00",
    "expectedPension": "5000.00",
    "age": 30,
    "sex": "male",
    "salary": "8000.00",
    "isSickLeaveIncluded": true,
    "totalAccumulatedFunds": "0.00",
    "yearWorkStart": 2020,
    "yearDesiredRetirement": 2055,
    "jobs": [],
    "leaves": []
  }'
```

### 3. Test w przeglądarce
1. Frontend: `http://localhost:3000`
2. Przejdź do symulatora
3. Wypełnij formularz
4. Sprawdź Network tab w DevTools - powinieneś zobaczyć request do `http://localhost:8000/calculations`

## 🐛 Troubleshooting

### Backend nie odpowiada
```bash
# Sprawdź czy działa
curl http://localhost:8000/health

# Jeśli nie działa, sprawdź setup
cd backend
poetry install
poetry run alembic upgrade head
poetry run uvicorn hackathon.main:app --reload --port 8000

# Szczegóły: BACKEND_SETUP.md
```

### Frontend - błędy API
```bash
# 1. Sprawdź .env.local
cat .env.local

# 2. Restart Next.js (wymagane po zmianie .env)
# Ctrl+C, potem:
npm run dev

# 3. Wyczyść cache
rm -rf .next
npm run dev
```

### "Module not found" errors
```bash
cd frontend
rm -rf node_modules .next
npm install
npm run dev
```