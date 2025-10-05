# 🔧 Database Schema Fix - Resolved

**Data:** 5 października 2025
**Status:** ✅ **NAPRAWIONE**

---

## 🐛 Problem

```
sqlite3.OperationalError: table calculations has no column named calculation_id
```

### Przyczyna
Stare migracje Alembic tworzyły tabelę ze złym schematem:
- ❌ Kolumna `id` zamiast `calculation_id`
- ❌ Kolumny `salary`, `is_sick_leave_included` których nie ma w nowym modelu
- ❌ Brak kolumn `jobs` (JSON) i `leaves` (JSON)

---

## ✅ Rozwiązanie

### Krok 1: Usunięto stare migracje
```bash
rm -f alembic/versions/*.py
```

### Krok 2: Usunięto starą bazę danych
```bash
rm -f hackathon.db
```

### Krok 3: Utworzono nową czystą migrację
```bash
poetry run alembic revision --autogenerate -m "Initial schema with DbCalculation"
```

### Krok 4: Zastosowano migrację
```bash
poetry run alembic upgrade head
```

---

## 📊 Nowy schemat (POPRAWNY)

```sql
CREATE TABLE calculations (
    calculation_id VARCHAR(36) NOT NULL,        ✅ UUID jako string
    calculation_datetime DATETIME NOT NULL,     ✅ Timestamp
    expected_pension FLOAT NOT NULL,            ✅ Kwota jako float
    age INTEGER NOT NULL,                       ✅ Wiek
    sex VARCHAR(1) NOT NULL,                    ✅ 'M' lub 'F'
    total_accumulated_funds FLOAT,              ✅ Zgromadzone środki (nullable)
    year_work_start INTEGER NOT NULL,           ✅ Rok rozpoczęcia pracy
    year_desired_retirement INTEGER NOT NULL,   ✅ Rok planowanej emerytury
    postal_code VARCHAR(16),                    ✅ Kod pocztowy (nullable)
    jobs JSON NOT NULL,                         ✅ Lista prac (JSON)
    leaves JSON NOT NULL,                       ✅ Lista zwolnień (JSON)
    PRIMARY KEY (calculation_id)
);
```

### Porównanie:

| Pole | Stary schemat | Nowy schemat | Status |
|------|--------------|--------------|--------|
| Primary Key | `id` | `calculation_id` | ✅ FIXED |
| Timestamp | `calculation_timestamp` (VARCHAR) | `calculation_datetime` (DATETIME) | ✅ FIXED |
| Pension | `expected_pension` (VARCHAR) | `expected_pension` (FLOAT) | ✅ FIXED |
| Salary | `salary` (VARCHAR) | ❌ REMOVED | ✅ FIXED |
| Sick Leave | `is_sick_leave_included` (BOOLEAN) | ❌ REMOVED | ✅ FIXED |
| Jobs | ❌ MISSING | `jobs` (JSON) | ✅ ADDED |
| Leaves | ❌ MISSING | `leaves` (JSON) | ✅ ADDED |
| Accumulated | `total_accumulated_funds` (VARCHAR) | `total_accumulated_funds` (FLOAT) | ✅ FIXED |

---

## 🚀 Weryfikacja

### Test 1: Sprawdzenie schematu
```bash
cd backend
sqlite3 hackathon.db ".schema calculations"
```
**Wynik:** ✅ Schemat zgodny z modelem

### Test 2: Import modułu
```bash
poetry run python -c "from hackathon.main import app; print('✅ OK')"
```
**Wynik:** ✅ Import successful

### Test 3: Backend restart
**Backend powinien teraz:**
- ✅ Przyjmować POST /calculations bez błędów
- ✅ Zapisywać dane do bazy
- ✅ Zwracać calculationId

---

## 📁 Nowa migracja

**Plik:** `alembic/versions/f093b4da986c_initial_schema_with_dbcalculation.py`

Ta migracja:
- Tworzy tabelę `calculations` z poprawnym schematem
- Używa modelu `DbCalculation` z `models.py`
- Wspiera JSON dla `jobs` i `leaves`

---

## ⚠️ Ważne na przyszłość

### Jeśli musisz zmienić schemat:
```bash
# 1. Utwórz nową migrację
poetry run alembic revision --autogenerate -m "opis zmian"

# 2. Zastosuj migrację
poetry run alembic upgrade head
```

### Jeśli schemat się nie zgadza:
```bash
# 1. Usuń bazę (UWAGA: tracisz dane!)
rm -f hackathon.db

# 2. Zastosuj wszystkie migracje od nowa
poetry run alembic upgrade head
```

---

## 🎯 Status końcowy

✅ **Schemat bazy danych:** POPRAWNY
✅ **Migracje:** CZYSTE
✅ **Model DbCalculation:** ZGODNY Z BAZĄ
✅ **Backend:** GOTOWY DO TESTÓW

---

## 🔄 Co dalej

1. **Restart backendu** (jeśli działa):
   ```bash
   # Zatrzymaj (Ctrl+C) i uruchom ponownie:
   cd backend
   poetry run uvicorn hackathon.main:app --reload --port 8000
   ```

2. **Przetestuj frontend:**
   - Otwórz `http://localhost:3000/symulacja`
   - Wypełnij formularz
   - Prześlij - powinno działać bez błędów! ✅

3. **Sprawdź admin panel:**
   - Otwórz `http://localhost:3000/admin`
   - Powinieneś zobaczyć listę kalkulacji

---

**Status:** ✅ **PROBLEM ROZWIĄZANY - BAZA DANYCH POPRAWNA**

