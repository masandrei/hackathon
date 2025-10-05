#!/bin/bash

# Skrypt do automatycznego tworzenia pliku .env.local

echo "🔧 Tworzenie pliku .env.local dla frontendu..."

cd frontend

# Sprawdź czy plik już istnieje
if [ -f .env.local ]; then
    echo "⚠️  Plik .env.local już istnieje!"
    echo "Czy chcesz go nadpisać? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "❌ Anulowano. Istniejący plik nie został zmieniony."
        exit 0
    fi
fi

# Utwórz plik .env.local
cat > .env.local << 'EOF'
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_TIMEOUT=10000

# Environment
NEXT_PUBLIC_ENV=development
EOF

echo "✅ Plik .env.local został utworzony!"
echo ""
echo "📄 Zawartość pliku:"
cat .env.local
echo ""
echo "🚀 Teraz możesz uruchomić frontend:"
echo "   npm run dev"
echo ""
echo "⚠️  WAŻNE: Jeśli frontend już działa, musisz go zrestartować!"
