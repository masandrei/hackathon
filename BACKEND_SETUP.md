# 🔧 Backend Setup - Rozwiązanie problemów

## ✅ Problem rozwiązany: ModuleNotFoundError

### Objawy
```
ModuleNotFoundError: No module named 'hackathon'
```

### Przyczyna
Brakował plik `backend/README.md` wymagany przez Poetry w `pyproject.toml`.

### Rozwiązanie
✅ **Naprawione!** Utworzono `backend/README.md`.

---

## 🚀 Szybkie uruchomienie

### Metoda 1: Skrypt (zalecane)

```bash
cd backend
./START_BACKEND.sh
```

Skrypt automatycznie:
- Sprawdza czy baza danych istnieje
- Tworzy bazę jeśli trzeba (alembic upgrade head)
- Uruchamia serwer

### Metoda 2: Ręcznie

```bash
cd backend

# 1. Instalacja zależności
poetry install

# 2. Utworzenie bazy danych (jeśli nie istnieje)
poetry run alembic upgrade head

# 3. Uruchomienie serwera
poetry run uvicorn hackathon.main:app --reload --port 8000
```

---

## 🗄️ Baza danych

### Lokalizacja
- **Dev:** `backend/hackathon.db` (SQLite)
- **Prod:** PostgreSQL (ustaw `DATABASE_URL`)

### Tworzenie bazy (pierwsza instalacja)

```bash
cd backend
poetry run alembic upgrade head
```

### Migracje (po zmianach w models.py)

```bash
# Utwórz nową migrację
poetry run alembic revision --autogenerate -m "opis zmian"

# Zastosuj migracje
poetry run alembic upgrade head
```

---

## 🐛 Troubleshooting

### Problem: "No module named 'hackathon'"

**Rozwiązanie:**
```bash
cd backend
poetry install
```

### Problem: "Connection refused" / "Can't connect to database"

**Rozwiązanie:**
```bash
cd backend
# Sprawdź czy baza istnieje
ls -la hackathon.db

# Jeśli nie istnieje, utwórz:
poetry run alembic upgrade head
```

### Problem: Port 8000 zajęty

**Rozwiązanie:**
```bash
# Sprawdź co zajmuje port
lsof -i :8000

# Zabij proces
lsof -ti :8000 | xargs kill -9

# Lub użyj innego portu
poetry run uvicorn hackathon.main:app --reload --port 8001
```

### Problem: Poetry nie może zainstalować projektu

**Objawy:**
```
Error: The current project could not be installed: Readme path ... does not exist.
```

**Rozwiązanie:**
✅ **Naprawione!** Plik `backend/README.md` został utworzony.

Jeśli nadal występuje problem:
```bash
cd backend
# Opcja 1: Wyłącz package mode
poetry config --local installer.no-binary :none:
poetry install --no-root

# Opcja 2: Dodaj do pyproject.toml
[tool.poetry]
package-mode = false
```

---

## 📊 Weryfikacja

### Test 1: Import modułu
```bash
cd backend
poetry run python -c "from hackathon.main import app; print('✅ OK')"
```

### Test 2: Health check
```bash
# Uruchom backend w osobnym terminalu
cd backend
poetry run uvicorn hackathon.main:app --port 8000

# W drugim terminalu:
curl http://localhost:8000/health
# Oczekiwany wynik: {"status":"healthy","timestamp":"..."}
```

### Test 3: Dokumentacja API
Otwórz w przeglądarce: `http://localhost:8000/docs`

---

## 🔧 Konfiguracja

### Zmienne środowiskowe

Utwórz plik `backend/.env` (opcjonalnie):

```bash
DATABASE_URL=sqlite:///hackathon.db
GEMINI_API_KEY=your-api-key-here  # Opcjonalne, dla AI features
```

---

## 📦 Co zostało naprawione

1. ✅ Utworzono `backend/README.md` (wymagany przez Poetry)
2. ✅ Dodano migracje Alembic (baza danych)
3. ✅ Utworzono skrypt `START_BACKEND.sh` dla łatwego uruchomienia
4. ✅ Dodano dokumentację troubleshooting

---

## 🎯 Następne kroki

Po uruchomieniu backendu:

1. **Przetestuj endpoint:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Sprawdź dokumentację:**
   Otwórz `http://localhost:8000/docs`

3. **Uruchom frontend:**
   ```bash
   cd ../frontend
   ./CREATE_ENV_FILE.sh  # Utwórz .env.local
   npm install
   npm run dev
   ```

4. **Przetestuj integrację:**
   - Frontend: `http://localhost:3000`
   - Symulacja: `http://localhost:3000/symulacja`
   - Admin: `http://localhost:3000/admin`

---

## 📚 Dodatkowe zasoby

- **Główna dokumentacja:** `../INTEGRATION.md`
- **Quick start:** `../QUICK_START.md`
- **Frontend setup:** `../frontend/ENV_VARIABLES.md`

---

**Status:** ✅ Backend gotowy do użycia!

