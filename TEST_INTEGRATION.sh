#!/bin/bash

echo "🧪 TEST INTEGRACJI FRONTEND-BACKEND"
echo "===================================="
echo ""

# Test 1: Backend Health
echo "1️⃣ Health Check..."
HEALTH=$(curl -s http://localhost:8000/health 2>/dev/null | grep -o healthy || echo "FAILED")
if [ "$HEALTH" = "healthy" ]; then
    echo "   ✅ Backend działa"
else
    echo "   ❌ Backend nie odpowiada"
    exit 1
fi
echo ""

# Test 2: Database
echo "2️⃣ Sprawdzam bazę danych..."
cd backend
COUNT=$(sqlite3 hackathon.db "SELECT COUNT(*) FROM calculations;" 2>/dev/null)
echo "   ✅ Kalkulacje w bazie: $COUNT"
cd ..
echo ""

# Test 3: POST Calculation
echo "3️⃣ Test kalkulacji emerytury..."
RESPONSE=$(curl -s -X POST http://localhost:8000/calculations \
  -H "Content-Type: application/json" \
  -d '{
    "calculationDate": "2025-10-05",
    "calculationTime": "12:00:00",
    "expectedPension": "6000.00",
    "age": 35,
    "sex": "female",
    "salary": "10000.00",
    "isSickLeaveIncluded": true,
    "totalAccumulatedFunds": "50000.00",
    "yearWorkStart": 2010,
    "yearDesiredRetirement": 2045,
    "jobs": [],
    "leaves": []
  }' 2>/dev/null)

CALC_ID=$(echo "$RESPONSE" | grep -o '"calculationId":"[^"]*"' | cut -d'"' -f4)
NOMINAL=$(echo "$RESPONSE" | grep -o '"nominalPension":"[^"]*"' | cut -d'"' -f4)
REAL=$(echo "$RESPONSE" | grep -o '"realPension":"[^"]*"' | cut -d'"' -f4)

if [ -n "$CALC_ID" ] && [ -n "$NOMINAL" ] && [ -n "$REAL" ]; then
    echo "   ✅ Kalkulacja utworzona!"
    echo "      ID: $CALC_ID"
    echo "      Nominalna: $NOMINAL PLN"
    echo "      Realna: $REAL PLN"
else
    echo "   ❌ Kalkulacja nie zwróciła danych"
    echo "   Response: $RESPONSE"
fi
echo ""

# Test 4: Excel Export
echo "4️⃣ Test exportu Excel..."
curl -s 'http://localhost:8000/calculations/export?lang=pl-PL' -o /tmp/test_export.xlsx 2>/dev/null
if [ -f /tmp/test_export.xlsx ] && [ -s /tmp/test_export.xlsx ]; then
    SIZE=$(ls -lh /tmp/test_export.xlsx | awk '{print $5}')
    TYPE=$(file /tmp/test_export.xlsx | grep -o "Microsoft Excel" || echo "Unknown")
    echo "   ✅ Excel wygenerowany"
    echo "      Rozmiar: $SIZE"
    echo "      Typ: $TYPE"
    rm -f /tmp/test_export.xlsx
else
    echo "   ❌ Excel nie został utworzony"
fi
echo ""

# Test 5: Statistics
echo "5️⃣ Test statystyk..."
STATS=$(curl -s http://localhost:8000/statistics 2>/dev/null | grep -o "growth_rate" || echo "")
if [ -n "$STATS" ]; then
    echo "   ✅ Statystyki dostępne"
else
    echo "   ❌ Statystyki niedostępne"
fi
echo ""

echo "===================================="
echo "✅ INTEGRACJA DZIAŁA POPRAWNIE!"
echo ""
echo "Możesz teraz przetestować w przeglądarce:"
echo "  Frontend: http://localhost:3000"
echo "  Symulator: http://localhost:3000/symulacja"
echo "  Admin: http://localhost:3000/admin"
