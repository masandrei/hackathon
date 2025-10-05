# Roadmap rozwoju symulatora emerytalnego

## ✅ Zaimplementowane (MVP)
- [x] 6-krokowy wizard z animacjami
- [x] Progress bar i sidebar navigation
- [x] Podstawowe dane: płeć, wiek, wynagrodzenie, początek kariery, rok emerytury
- [x] Zachowywanie stanu przy cofaniu
- [x] Dynamiczny wykres percentyla zarobków
- [x] Podsumowanie z edycją odpowiedzi
- [x] Mockowe wyniki symulacji

---

## 🚧 Planowane rozszerzenia

### 1. Historia zatrudnienia (Jobs Management)

**Cel**: Użytkownik może dodać wiele miejsc pracy z różnymi zarobkami

**Struktura danych**:
```typescript
interface Job {
  id: string;
  startDate: string;        // YYYY-MM-DD
  endDate?: string;         // YYYY-MM-DD (optional for current job)
  baseSalary: number;       // Monthly gross salary
  companyName?: string;     // Optional
  position?: string;        // Optional
}

// W SimulatorContext:
jobs: Job[];
```

**Nowe ekrany**:
- **Step 4a**: "Czy chcesz dodać szczegółową historię zatrudnienia?"
  - Opcje: "Nie, użyj obecnych danych" / "Tak, chcę dodać szczegóły"
  
- **Step 4b** (jeśli tak): "Twoja historia zatrudnienia"
  - Lista dodanych prac
  - Przycisk "+ Dodaj pracę"
  - Modal/Dialog z formularzem:
    - Data rozpoczęcia (picker)
    - Data zakończenia (picker lub checkbox "Obecna praca")
    - Wynagrodzenie miesięczne brutto
    - Nazwa firmy (opcjonalnie)
    - Stanowisko (opcjonalnie)
  - Walidacja: daty nie mogą się nakładać
  - Sortowanie chronologiczne
  - Możliwość edycji/usunięcia

**Komponenty do stworzenia**:
```
/components/simulator/
├── jobs/
│   ├── JobList.tsx           (lista prac)
│   ├── JobCard.tsx           (pojedyncza karta pracy)
│   ├── JobForm.tsx           (formularz dodawania/edycji)
│   └── JobTimeline.tsx       (wizualizacja czasowa)
└── steps/
    ├── Step4aJobsChoice.tsx  (wybór: szczegóły czy nie)
    └── Step4bJobsManager.tsx (zarządzanie pracami)
```

**UI Features**:
- Timeline view: linia czasu z kafelkami
- Automatyczne wyliczenie średniego wynagrodzenia
- Kolorowe wskaźniki: 
  - Zielony: obecna praca
  - Niebieski: przeszłe prace
- Gap detection: jeśli są przerwy w zatrudnieniu > 6 miesięcy, pokazać ostrzeżenie

---

### 2. Chorobowe (Sick Leave Management)

**Cel**: Uwzględnienie wpływu zwolnień lekarskich na emeryturę

**Struktura danych**:
```typescript
type SickLeaveOption = 'none' | 'average' | 'custom';

interface SickLeaveData {
  option: SickLeaveOption;
  customDays?: number;      // Jeśli option === 'custom'
  customLeaves?: Leave[];   // Szczegółowa lista
}

interface Leave {
  id: string;
  startDate: string;
  endDate?: string;
  type?: 'sick' | 'maternity' | 'other';
}

// W SimulatorContext:
sickLeaveData: SickLeaveData;
```

**Nowy ekran**:
- **Step 4c**: "Czy chcesz uwzględnić chorobowe?"
  
  **Opcja 1: Nie uwzględniaj**
  - "Pomiń chorobowe w obliczeniach"
  - (Domyślnie wybrane)
  
  **Opcja 2: Użyj średniej statystycznej**
  - "Użyj średniej ~7 dni rocznie"
  - Info card: "Statystyczny Polak jest na L4 średnio 7 dni rocznie"
  - Automatyczne wyliczenie na podstawie lat pracy
  
  **Opcja 3: Określ dokładnie**
  - "Chcę podać dokładną ilość"
  - Input: Liczba dni rocznie (0-365)
  - Lub: Przycisk "Dodaj szczegółowe okresy"
    - Modal z formularzem:
      - Data rozpoczęcia
      - Data zakończenia
      - Typ: Chorobowe / Macierzyńskie / Inne
    - Lista dodanych okresów
    - Automatyczne wyliczenie sumy dni

**Komponenty do stworzenia**:
```
/components/simulator/
├── sickleave/
│   ├── SickLeaveChoice.tsx       (3 opcje wyboru)
│   ├── SickLeaveStats.tsx        (statystyki)
│   ├── SickLeaveForm.tsx         (formularz szczegółowy)
│   └── SickLeaveCalendar.tsx     (opcjonalny calendar view)
└── steps/
    └── Step4cSickLeave.tsx       (główny ekran)
```

**UI Features**:
- Karty wyboru (3 opcje) z ikonami
- Dla opcji "średnia": wykres pokazujący lata × 7 dni
- Dla opcji "custom": 
  - Slider 0-30 dni rocznie (quick input)
  - Lub szczegółowy formularz
- Info tooltips: "Jak chorobowe wpływa na emeryturę?"

---

### 3. Kolejność ekranów (po rozszerzeniu)

```
1. Step1: Płeć (K/M)
2. Step2: Wiek (slider)
3. Step3: Wynagrodzenie (input + percentyl)
4. Step4a: Wybór historii zatrudnienia (tak/nie)
   ├─→ NIE: Step5 (rok emerytury)
   └─→ TAK: Step4b (lista prac)
5. Step4b: Zarządzanie pracami (opcjonalny)
6. Step4c: Chorobowe (3 opcje)
7. Step5: Rok emerytury
8. Step6: Podsumowanie + wyniki
```

**Nowa logika totalSteps**:
```typescript
const totalSteps = useMemo(() => {
  let steps = 6; // Bazowe kroki
  if (data.includeJobHistory) steps += 1; // Step4b
  // Step4c jest zawsze
  return steps;
}, [data.includeJobHistory]);
```

---

### 4. Integracja z API

Gdy wszystkie dane będą zebrane, wysłanie do backendu:

```typescript
POST /calculations
{
  calculationDate: "2025-10-05",
  calculationTime: "12:30:00",
  expectedPension: "5000.00",
  age: 30,
  sex: "male",
  salary: "8000.00",
  isSickLeaveIncluded: true,
  totalAccumulatedFunds: "0.00",
  yearWorkStart: 2015,
  yearDesiredRetirement: 2057,
  jobs: [
    {
      startDate: "2015-01-01",
      endDate: "2018-12-31",
      baseSalary: 5000
    },
    {
      startDate: "2019-01-01",
      endDate: null,
      baseSalary: 8000
    }
  ],
  leaves: [
    {
      startDate: "2020-03-15",
      endDate: "2020-03-22"
    }
  ]
}
```

---

### 5. Dodatkowe usprawnienia

**A. Walidacje**
- Data rozpoczęcia pracy nie może być wcześniejsza niż 15 lat (wiek minimalny)
- Data emerytury nie może być wcześniejsza niż 60 lat
- Prace nie mogą się nakładać czasowo
- Chorobowe nie może przekraczać czasu zatrudnienia

**B. Wizualizacje**
- Timeline chart: linia czasu kariery
- Salary progression chart: wykres wzrostu zarobków
- Pension forecast chart: prognoza emerytury w latach

**C. UX improvements**
- Autosave do localStorage (draft mode)
- "Zapisz i kontynuuj później" - link do resumowania
- Eksport danych do JSON
- Import danych z PUE/eZUS (przyszłość)

**D. Accessibility**
- Date pickers z keyboard navigation
- Screen reader announcements dla dodanych prac
- Focus management w modalach

---

## 📋 Kolejność implementacji

### Faza 1: Historia zatrudnienia (Priorytet 1)
1. Rozszerzyć `SimulatorContext` o `jobs: Job[]`
2. Stworzyć komponenty JobForm, JobCard, JobList
3. Dodać Step4a (wybór) i Step4b (zarządzanie)
4. Dodać walidacje dat
5. Zaktualizować Step6 (podsumowanie) o listę prac

### Faza 2: Chorobowe (Priorytet 2)
1. Rozszerzyć Context o `sickLeaveData`
2. Stworzyć Step4c z 3 opcjami
3. Dodać SickLeaveForm dla opcji custom
4. Zaktualizować logikę totalSteps
5. Zaktualizować podsumowanie

### Faza 3: Integracja API (Priorytet 3)
1. Połączyć formularz z UserService.submitCalculation()
2. Obsługa loading states
3. Error handling
4. Wyświetlanie prawdziwych wyników z API

### Faza 4: Dodatkowe features (Nice to have)
1. Timeline chart
2. Autosave
3. Export/Import
4. Advanced visualizations

---

## 🔧 Wymagane zmiany w istniejącym kodzie

### SimulatorContext.tsx
```typescript
export interface SimulatorData {
  age?: number;
  sex?: "male" | "female";
  salary?: string;
  yearWorkStart?: number;
  yearDesiredRetirement?: number;
  expectedPension?: string;
  
  // ➕ NOWE
  includeJobHistory?: boolean;
  jobs?: Job[];
  sickLeaveData?: SickLeaveData;
  totalAccumulatedFunds?: string;
}
```

### StepNavigation.tsx
```typescript
const steps = useMemo(() => {
  const baseSteps = [
    { id: 1, label: "Płeć" },
    { id: 2, label: "Wiek" },
    { id: 3, label: "Wynagrodzenie" },
    { id: 4, label: "Początek kariery" },
  ];
  
  let currentId = 5;
  
  if (data.includeJobHistory) {
    baseSteps.push({ id: currentId++, label: "Historia prac" });
  }
  
  baseSteps.push({ id: currentId++, label: "Chorobowe" });
  baseSteps.push({ id: currentId++, label: "Rok emerytury" });
  baseSteps.push({ id: currentId++, label: "Podsumowanie" });
  
  return baseSteps;
}, [data.includeJobHistory]);
```

---

## ⚠️ Uwagi techniczne

1. **Date handling**: Użyć `date-fns` dla parsowania i walidacji dat
2. **Form validation**: Zod schema dla Jobs i Leaves
3. **State persistence**: Zapisywać draft do localStorage co 30s
4. **Performance**: Dla >20 prac użyć virtualizacji listy
5. **Mobile**: Job cards w formie accordion na mobile

---

## 📊 Metryki sukcesu

- [ ] 95% użytkowników kończy wizard bez porzucenia
- [ ] Średni czas wypełnienia: 90-180 sekund
- [ ] 0 błędów walidacji dla poprawnych danych
- [ ] Loading time < 1s dla każdego kroku
- [ ] WCAG 2.2 AA compliance

---

## 🎯 Timeline

- **Week 1**: Historia zatrudnienia (podstawowa wersja)
- **Week 2**: Chorobowe + walidacje
- **Week 3**: Integracja API + testy
- **Week 4**: Polish + dodatkowe features

---

*Ostatnia aktualizacja: 5 października 2025*

