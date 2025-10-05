#!/bin/bash

# Skrypt do uruchamiania backendu

echo "🚀 Uruchamiam backend ZUS Simulator..."
echo ""

# Sprawdź czy baza danych istnieje
if [ ! -f "hackathon.db" ]; then
    echo "⚠️  Baza danych nie istnieje. Tworzę bazę..."
    poetry run alembic upgrade head
    echo "✅ Baza danych utworzona!"
    echo ""
fi

echo "🔧 Uruchamiam serwer na http://localhost:8000"
echo "📚 Dokumentacja API: http://localhost:8000/docs"
echo ""
echo "Aby zatrzymać serwer, naciśnij Ctrl+C"
echo ""

poetry run uvicorn hackathon.main:app --reload --port 8000

