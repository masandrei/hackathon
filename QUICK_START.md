# ⚡ Quick Start - Integracja Frontend-Backend

## 🚀 Uruchomienie w 3 krokach

### 1️⃣ Backend (Terminal 1)

```bash
cd backend

# Instalacja zależności
poetry install

# Utworzenie bazy danych (tylko przy pierwszym uruchomieniu)
poetry run alembic upgrade head

# Uruchomienie serwera
poetry run uvicorn hackathon.main:app --reload --port 8000

# LUB użyj skryptu:
# ./START_BACKEND.sh
```

✅ Backend: `http://localhost:8000`
📚 Docs: `http://localhost:8000/docs`

**⚠️ Problem z instalacją?** Zobacz `BACKEND_SETUP.md`

---

### 2️⃣ Frontend - Konfiguracja (Terminal 2)

```bash
cd frontend

# Utwórz plik .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_ENV=development
EOF
```

---

### 3️⃣ Frontend - Uruchomienie

```bash
npm install
npm run dev
```

✅ Frontend: `http://localhost:3000`

---

## ✅ Weryfikacja

### Test 1: Health Check

```bash
curl http://localhost:8000/health
```

Powinno zwrócić:
```json
{"status":"healthy","timestamp":"..."}
```

### Test 2: Symulacja emerytalna

1. Otwórz `http://localhost:3000`
2. Kliknij "Przejdź do symulacji"
3. Wypełnij formularz
4. Na końcu sprawdź czy wyniki się pojawiają

### Test 3: Admin Panel

1. Otwórz `http://localhost:3000/admin`
2. Powinieneś zobaczyć listę kalkulacji (lub pusty stan)
3. Kliknij "Pobierz raport XLS" - powinien się pobrać plik Excel

---

## 🐛 Szybkie rozwiązania problemów

### Backend nie startuje

```bash
cd backend

# Reinstaluj
poetry install

# Utwórz bazę danych jeśli nie istnieje
poetry run alembic upgrade head

# Uruchom ponownie
poetry run uvicorn hackathon.main:app --reload --port 8000
```

**Szczegóły:** Zobacz `BACKEND_SETUP.md`

### Frontend pokazuje błędy API

```bash
# Sprawdź czy backend działa
curl http://localhost:8000/health

# Sprawdź plik .env.local
cat frontend/.env.local

# Restart frontend
cd frontend
npm run dev
```

### "Module not found" w frontend

```bash
cd frontend
rm -rf node_modules .next
npm install
npm run dev
```

---

## 📊 Kluczowe endpointy

| Endpoint | Metoda | Opis |
|----------|--------|------|
| `/health` | GET | Sprawdź czy backend działa |
| `/calculations` | POST | Utwórz kalkulację |
| `/calculations` | GET | Lista kalkulacji (admin) |
| `/calculations/export` | GET | Pobierz XLS |
| `/statistics` | GET | Wszystkie statystyki |

---

## 🎯 Co jest zintegrowane

✅ **Symulator** - Wysyła dane do `/calculations`
✅ **Admin Panel** - Pobiera listę z `/calculations`
✅ **Export XLS** - Pobiera z `/calculations/export`
✅ **Fallback** - Automatyczne mock data gdy backend offline
✅ **Health Check** - Hook `useApiHealth`

---

## 📖 Pełna dokumentacja

- **Integracja:** `INTEGRATION.md`
- **Zmienne env:** `frontend/ENV_VARIABLES.md`
- **Deployment:** `DEPLOYMENT.md`

---

## 💡 Pro Tips

1. **Zawsze sprawdzaj logi backendu** - pokazują wszystkie requesty
2. **Używaj Network tab w DevTools** - zobacz co frontend wysyła
3. **Backend auto-reload** - zmiany w kodzie Python automatycznie się aplikują
4. **Frontend wymaga restartu** - po zmianie `.env.local`

---

## 🆘 Potrzebujesz pomocy?

```bash
# Sprawdź porty
lsof -i :8000  # Backend
lsof -i :3000  # Frontend

# Logi backendu
cd backend
poetry run uvicorn hackathon.main:app --reload --log-level debug

# Logi frontendu - sprawdź terminal gdzie jest npm run dev
```

---

**Gotowe! 🎉** Aplikacja powinna teraz działać z pełną integracją frontend-backend.

