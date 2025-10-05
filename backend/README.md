# ZUS Simulator - Backend API

FastAPI backend dla aplikacji ZUS Simulator.

## 🚀 Quick Start

### Instalacja

```bash
poetry install
```

### Uruchomienie

```bash
poetry run uvicorn hackathon.main:app --reload --port 8000
```

API będzie dostępne pod: `http://localhost:8000`

Interaktywna dokumentacja: `http://localhost:8000/docs`

## 📚 Endpointy

### Health Check
- `GET /health` - Sprawdzenie stanu API

### Calculations
- `POST /calculations` - Utwórz kalkulację
- `GET /calculations` - Lista kalkulacji (paginacja)
- `GET /calculations/{id}` - Pobierz szczegóły kalkulacji
- `GET /calculations/export` - Export wszystkich kalkulacji do XLS

### Statistics
- `GET /statistics` - Wszystkie statystyki
- `GET /statistics/growth-rate` - Tempo wzrostu
- `GET /statistics/average-wage` - Średnie wynagrodzenie
- `GET /statistics/valorization` - Waloryzacja
- `GET /statistics/inflation` - Inflacja

### Chat & AI
- `POST /chat/owl` - Chat z maskotką ZUŚka
- `GET /chat/owl/info` - Informacje o maskotce
- `POST /calculations/analyze` - Analiza kalkulacji przez Gemini AI

## 🗄️ Database

### Migracje

```bash
# Utwórz nową migrację
alembic revision --autogenerate -m "opis zmian"

# Zastosuj migracje
alembic upgrade head
```

## 🔧 Konfiguracja

### Zmienne środowiskowe

- `DATABASE_URL` - URL do bazy danych (domyślnie: `sqlite:///hackathon.db`)

## 🛠️ Tech Stack

- **Framework:** FastAPI
- **Python:** 3.11+
- **ORM:** SQLAlchemy + Alembic
- **Database:** SQLite (dev), PostgreSQL (prod)
- **AI:** Google Generative AI (Gemini)

## 📖 Dokumentacja

Pełna dokumentacja integracji: `../INTEGRATION.md`

