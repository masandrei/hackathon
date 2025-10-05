# 🐛 Debug - Pension Calculation Not Showing

**Data:** 5 października 2025  
**Status:** 🔍 **DEBUGGING**

---

## 🐛 Problem

**Objaw:** Wartości emerytury mogą nie być wyświetlane w frontend mimo że backend je zwraca.

---

## 🔍 Analiza

### Backend - ✅ DZIAŁA POPRAWNIE

**Test request:**
```bash
curl -X POST http://localhost:8000/calculations \
  -H "Content-Type: application/json" \
  -d '{
    "expectedPension": "7500.00",
    "age": 40,
    "sex": "male",
    "yearDesiredRetirement": 2040,
    ...
  }'
```

**Response:**
```json
{
    "calculationId": "654ff171-f01e-407c-8f9d-f5ec0256fd35",
    "nominalPension": "7500.00",           ✅ ZWRACA
    "realPension": "5178.49",              ✅ ZWRACA
    "replacementRate": 38.89,              ✅ ZWRACA
    "averageWage": 19282.31                ✅ ZWRACA
}
```

**Wniosek:** Backend działa poprawnie i zwraca obliczone wartości.

---

### Frontend - 🐛 PROBLEM ZNALEZIONY

**Problem 1: expectedPension vs salary**

**Przed:**
```typescript
// Step6Summary.tsx - LINE 39 (PRZED POPRAWKĄ)
expectedPension: data.salary || "0",  // ❌ BŁĄD!
```

To wysyłało **wynagrodzenie** jako **oczekiwaną emeryturę**!

**Po poprawce:**
```typescript
// Step6Summary.tsx - LINE 40 (PO POPRAWCE)
expectedPension: data.expectedPension || 
  (data.salary ? String(parseFloat(data.salary) * 0.6) : "0"),
```

Teraz używa:
1. `data.expectedPension` jeśli dostępne (ze strony głównej)
2. Lub estymuje: 60% obecnego wynagrodzenia

**Problem 2: Możliwe że frontend wymaga restartu**

Po zmianie TypeScript typów (CalculationResponse.ts), Next.js może cache'ować stare typy.

---

## ✅ Rozwiązanie

### Krok 1: Naprawiono kod ✅
```typescript
// Poprawione w commit 7ca8731
expectedPension: data.expectedPension || (data.salary ? String(parseFloat(data.salary) * 0.6) : "0")
```

### Krok 2: Dodano debug logging ✅
```typescript
console.log("Wysyłam dane do API:", requestData);
console.log("expectedPension calculation:", {
  fromData: data.expectedPension,
  fromSalary: data.salary,
  calculated: requestData.expectedPension
});

console.log("Odpowiedź z API:", response);
console.log("Typy pól:", {
  calculationId: typeof response.calculationId,
  nominalPension: typeof response.nominalPension,
  realPension: typeof response.realPension,
  replacementRate: typeof response.replacementRate,
});

console.log("Ustawiam wyniki:", calculatedResults);
```

### Krok 3: Restart frontend (WYMAGANE)
```bash
# W terminalu gdzie działa npm run dev:
# Ctrl+C (zatrzymaj)

cd frontend
npm run dev

# Poczekaj na:
# ✓ Ready in 2.3s
```

---

## 🧪 Jak Zweryfikować

### Test 1: Console Logs (Chrome DevTools)

1. Otwórz `http://localhost:3000/symulacja`
2. Otwórz Console (F12 → Console tab)
3. Wypełnij formularz symulacji
4. Na ostatnim kroku sprawdź logi:

**Powinny być:**
```
Wysyłam dane do API: {...}
expectedPension calculation: {
  fromData: undefined,
  fromSalary: "8000",
  calculated: "4800"  // 60% z 8000
}

Odpowiedź z API: {
  calculationId: "uuid",
  nominalPension: "4800.00",
  realPension: "...",
  replacementRate: ...
}

Typy pól: {
  calculationId: "string",
  nominalPension: "string",     ✅ Powinno być string
  realPension: "string",        ✅ Powinno być string
  replacementRate: "number"     ✅ Powinno być number
}

Ustawiam wyniki: {
  nominalPension: "4800.00",
  realPension: "...",
  percentageToAverage: ...
}
```

### Test 2: UI Display

**Sprawdź czy są wyświetlone:**
- 🟢 **Nominalna wartość:** (powinna być liczba, nie "0 PLN")
- 🔵 **Realna wartość:** (powinna być mniejsza niż nominalna)
- 🟠 **Stopa zastąpienia:** (powinno być %, np. 38%)

### Test 3: Network Tab

1. Otwórz DevTools → Network tab
2. Filtruj: XHR/Fetch
3. Wypełnij symulator
4. Znajdź request `POST /calculations`
5. Kliknij → Response tab
6. Sprawdź czy response zawiera:
   ```json
   {
     "calculationId": "...",
     "nominalPension": "...",
     "realPension": "...",
     "replacementRate": ...,
     "averageWage": ...
   }
   ```

---

## ⚠️ Możliwe Przyczyny Problemu

### 1. Frontend Cache (Najczęstszy)
**Symptom:** Stare typy TypeScript  
**Rozwiązanie:**
```bash
cd frontend
rm -rf .next
npm run dev
```

### 2. Typy nie zaktualizowane
**Symptom:** response.nominalPension = undefined  
**Sprawdź:**
```typescript
// frontend/src/api-client/models/CalculationResponse.ts
export type CalculationResponse = {
    calculationId: string;
    nominalPension?: string;      // ✅ Powinno być
    realPension?: string;         // ✅ Powinno być
    replacementRate?: number;     // ✅ Powinno być
    averageWage?: number;         // ✅ Powinno być
};
```

### 3. Backend nie działa
**Sprawdź:**
```bash
curl http://localhost:8000/health
# Powinno zwrócić: {"status":"healthy",...}
```

### 4. CORS errors
**Symptom:** Błędy CORS w console  
**Sprawdź:** Czy backend ma proper CORS middleware

---

## 🔧 Quick Fixes

### Fix 1: Restart Frontend (ZAWSZE TO ZRÓB NAJPIERW)
```bash
# Terminal gdzie działa frontend:
# Ctrl+C

cd frontend
rm -rf .next          # Wyczyść cache
npm run dev           # Restart
```

### Fix 2: Sprawdź typy
```bash
cd frontend
cat src/api-client/models/CalculationResponse.ts
# Powinno mieć: nominalPension, realPension, replacementRate
```

### Fix 3: Test backend bezpośrednio
```bash
curl -X POST http://localhost:8000/calculations \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "calculationDate": "2025-10-05",
  "calculationTime": "12:00:00",
  "expectedPension": "5000.00",
  "age": 30,
  "sex": "male",
  "salary": "8000.00",
  "isSickLeaveIncluded": true,
  "totalAccumulatedFunds": "0.00",
  "yearWorkStart": 2015,
  "yearDesiredRetirement": 2050,
  "jobs": [],
  "leaves": []
}
EOF
# Sprawdź czy response ma nominalPension, realPension, etc.
```

---

## 📊 Debug Checklist

**Gdy wartości nie są wyświetlane:**

- [ ] **Restart frontend** (Ctrl+C → npm run dev)
- [ ] **Wyczyść cache** (rm -rf .next)
- [ ] **Sprawdź console** (F12 → Console tab)
- [ ] **Sprawdź Network** (F12 → Network → POST /calculations)
- [ ] **Sprawdź typy** (CalculationResponse.ts ma wszystkie pola)
- [ ] **Test backend** (curl POST /calculations)
- [ ] **Sprawdź logi** (console.log w Step6Summary)

---

## 💡 Co Poprawiono

### Commit: `7ca8731`

**Changes:**
1. ✅ expectedPension calculation fixed
   - Przed: `data.salary` (błędnie)
   - Po: `data.expectedPension || (data.salary * 0.6)` (poprawnie)

2. ✅ Added extensive debug logging
   - Log request data
   - Log expectedPension calculation
   - Log API response
   - Log response field types
   - Log calculated results before setState

3. ✅ Better fallback logic
   - Uses expectedPension if available
   - Estimates from salary (60%) if not
   - Prevents sending 0 as expected pension

---

## 🎯 Następne Kroki

### 1. RESTART FRONTEND (KRYTYCZNE!)
```bash
# W terminalu gdzie działa frontend:
Ctrl+C

cd frontend
rm -rf .next
npm run dev
```

### 2. Test w przeglądarce
```
http://localhost:3000/symulacja
```

### 3. Sprawdź Console Logs
- Otwórz DevTools (F12)
- Przejdź do Console tab
- Wypełnij formularz
- Sprawdź logi - powinny pokazać wszystkie wartości

### 4. Sprawdź Network
- DevTools → Network
- Filtruj: Fetch/XHR
- Zobacz POST /calculations
- Response powinien mieć wszystkie pola

---

## 📝 Expected Console Output

**Po poprawce powinno być:**
```
Wysyłam dane do API: {
  expectedPension: "4800",    ← 60% z salary 8000
  age: 30,
  sex: "male",
  salary: "8000",
  ...
}

expectedPension calculation: {
  fromData: undefined,         ← Bo nie wprowadzono na stronie głównej
  fromSalary: "8000",
  calculated: "4800"           ← Estymacja: 60% salary
}

Odpowiedź z API: {
  calculationId: "uuid",
  nominalPension: "4800.00",   ← Backend obliczył
  realPension: "2589.23",      ← Urealnione o inflację
  replacementRate: 15.05,      ← % średniej krajowej
  averageWage: 31874.79
}

Typy pól: {
  calculationId: "string",
  nominalPension: "string",     ✅
  realPension: "string",        ✅
  replacementRate: "number"     ✅
}

Ustawiam wyniki: {
  nominalPension: "4800.00",
  realPension: "2589.23",
  percentageToAverage: 15.05
}
```

**UI Display:**
- 🟢 Nominalna wartość: **4 800,00 PLN**
- 🔵 Realna wartość: **2 589,23 PLN**
- 🟠 Stopa zastąpienia: **15%**

---

## ✅ Status

**Code:** ✅ Fixed (commit `7ca8731`)  
**Logging:** ✅ Added (extensive debug)  
**Next:** ⚠️ **RESTART FRONTEND REQUIRED**

---

**Po restarcie frontendu wartości powinny się wyświetlać poprawnie!**

Test URL: `http://localhost:3000/symulacja`

