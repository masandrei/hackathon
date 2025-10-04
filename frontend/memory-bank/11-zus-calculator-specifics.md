# 11. Specyfika Kalkulatora Emerytur ZUS

Ten dokument opisuje szczegóły specyficzne dla projektu Kalkulatora Emerytur ZUS.

---

## 🎯 Cel biznesowy

**Edukacyjne narzędzie** do symulacji przyszłej emerytury, pozwalające użytkownikom:
1. Wprowadzić oczekiwaną kwotę emerytury
2. Podać dane o zatrudnieniu i dochodach
3. Uzyskać symulację przyszłej emerytury (nominalna, urealniona, stopa zastąpienia)
4. Pobrać wyniki jako PDF

---

## 📊 Flow użytkownika (Main User Journey)

### 1. Landing Page (`/`)
```
User lands → Sees hero
↓
Enters expected pension (np. 5 000 PLN)
↓
Clicks "Przejdź do symulacji"
↓
Redirected to /wizard or /dashboard
```

### 2. Wizard (Multi-step Form) - TODO
```
Step 1: Dane osobowe
- Wiek
- Płeć
- Obecna pensja

Step 2: Historia zatrudnienia
- Daty rozpoczęcia/zakończenia pracy
- Pensje w poszczególnych okresach
- Urlopy/zwolnienia

Step 3: Środki zgromadzone
- Aktualne oszczędności emerytalne
- Rok rozpoczęcia pracy
- Planowany rok emerytury

Step 4: Review & Submit
↓
API Call → Kalkulacja
↓
Results Page
```

### 3. Results Page - TODO
```
Wyniki symulacji:
- Emerytura nominalna (kwota bez inflacji)
- Emerytura urealniona (uwzględniająca inflację)
- Stopa zastąpienia (% ostatniej pensji)
- Wykres wzrostu w czasie
- Download PDF button
```

---

## 🔢 Model danych (z API)

### CalculationRequest (Input)
```typescript
{
  calculationDate: "2025-10-04",           // Data kalkulacji
  calculationTime: "14:30:00",             // Czas (UTC)
  expectedPension: "5000.00",              // ← Z UI inputa
  age: 35,                                 // Wiek użytkownika
  sex: "male" | "female",                  // Płeć
  salary: "8000.00",                       // Obecna pensja
  isSickLeaveIncluded: true,               // Czy uwzględnić L4
  totalAccumulatedFunds: "50000.00",       // Zgromadzone środki
  yearWorkStart: 2010,                     // Rok rozpoczęcia pracy
  yearDesiredRetirement: 2050,             // Planowany rok emerytury
  postalCode: "00-001",                    // Kod pocztowy (opcjonalny)
  jobs: [                                  // Historia zatrudnienia
    {
      startDate: "2010-01-01",
      endDate: "2015-12-31",
      baseSalary: 4000
    },
    {
      startDate: "2016-01-01",
      endDate: null,                       // Aktualna praca
      baseSalary: 8000
    }
  ],
  leaves: [                                // Urlopy/L4
    {
      startDate: "2020-03-01",
      endDate: "2020-06-01",
      type: "sick_leave"
    }
  ]
}
```

### CalculationResponse (Output)
```typescript
{
  pension: "6500.00"  // Obliczona emerytura
  // Więcej danych w CalculationDetail (GET /calculations/{id})
}
```

### CalculationDetail (Full Results)
```typescript
// Dostępne przez GET /calculations/{id}
{
  id: "uuid",
  pension: "6500.00",
  pensionNominal: "6500.00",       // Wartość nominalna
  pensionReal: "4200.00",          // Wartość urealniona (inflacja)
  replacementRate: "81.25%",       // Stopa zastąpienia
  calculations: [...],              // Szczegóły obliczeń
  chartData: [...],                 // Dane do wykresu
  createdAt: "2025-10-04T14:30:00Z"
}
```

---

## 🎨 Komponenty UI (zaimplementowane)

### Header
```tsx
<Header />
Props: brak
Features:
- Logo z pliku `public/assets/ZUS_logo.png` + #RAND0M6 (JetBrains Mono)
- Linki: Start, Dashboard, Dane & Metody, Pomoc/FAQ
- CTA: Zarejestruj / Zaloguj (4 px radius, pionowy separator)
- Sticky top, backdrop-blur, wysokość 64 px
```

### PensionInput (hero)
```tsx
<Input
  value={expectedPension}
  onChange={handleInputChange}
  className="h-14 sm:h-16 max-w-sm rounded-2xl pr-28"
  placeholder="np. 5 000"
/>
Features:
- Formatowanie cyfr (spacje co 3)
- Badge `PLN / MIESIĄC` (kolor #BEC3CE, bez obramowania) + krótki separator
- Hover/focus: border i ring #ffb34f z płynnym przejściem
- Tekst pomocniczy wyrównany do prawej względem inputu
```

### CTA Button
```tsx
<Button size="lg" className="h-14 w-full sm:w-auto sm:min-w-[240px] rounded-[18px] bg-[#ffb34f]">
  Przejdź do symulacji
  <ArrowSvg />
</Button>
Features:
- Jedyny przycisk z promieniem 18 px
- Tekst Inter 16 px, semi-bold, ikona dziedziczy kolor
- Border 1 px #0000001A
```

### Info Cards („Czy wiesz, że…”) 
```tsx
<div className="relative flex min-w-[280px] max-w-[320px] rounded-[28px] border border-[#fef0bb] bg-[#fff8d4] px-7 py-8">
  <span className="absolute inset-y-6 left-6 w-1 rounded-full bg-[#ffb34f]" />
  <img src="/assets/Bulb_image.png" className="size-11 mix-blend-darken" />
  <div>
    <p className="text-[17px] font-semibold text-[#00416e]">Czy wiesz, że...</p>
    <p className="text-sm leading-6 text-[#00324f]">…</p>
  </div>
</div>
```
Features:
- Dwie karty przesunięte względem siebie (druga o ~10 px w górę)
- Blend mode „darken” na ikonie żarówki
- Pasek akcentowy + miękki cień `0 30px 60px -36px rgba(15,45,78,0.32)`

### ChartPlaceholder
```tsx
<ChartPlaceholder />
Features:
- Gradientowe słupki (navy→blue→green) z zaokrąglonym topem i wewnętrznym cieniem
- Etykiety 200% / 300% jako badge na białym tle
- Linia trendu generowana z punktów (SVG, 6 markerów)
- Tło: radial gradient, rounded 36 px, cień `0 45px 90px -40px rgba(9,31,56,0.4)`
- Oś Y: 8 poziomów, uppercase, tracking 0.12em
```

### OwlMascot
```tsx
<OwlMascot />
Features:
- Grafika `Owl_image.png` bez dodatkowego badge
- Mogą na nią nachodzić karty (pozycjonowanie w prawym dolnym rogu sekcji)
```

### Cookie Banner
```tsx
<div className="fixed bottom-0 h-[82px] bg-[#002911]">
  <p className="flex-1 text-white/90 text-balance" />
  <div className="flex gap-3">
    <Button className="h-10 rounded-[4px] bg-[#1f3829]">Ustawienia</Button>
    <Button className="h-10 rounded-[4px] bg-[#1f3829]">Akceptuję</Button>
    <button className="underline">Polityka cookies</button>
  </div>
</div>
Features:
- Tekst i akcje w jednej linii, brak overflow
- Promień 4 px dla wszystkich przycisków poza CTA w hero
```

---

## 📐 Wymiary (Pixel-Perfect z Figma)

| Element | Width | Height | Border Radius | Font Size |
|---------|-------|--------|---------------|-----------|
| **Canvas** | 1728px | 1117px | - | - |
| **Header** | 100% | 107px | - | - |
| **Logo ZUS** | ~100px | ~48px | - | - |
| **#RAND0M6** | 192px | 36px | - | 30px |
| **Nav links** | auto | 27px | - | 20px |
| **Auth btn 1** | 217px | 42px | 4px | 17px |
| **Auth btn 2** | 200px | 42px | 4px | 17px |
| **Separator** | 15px | 1px | - | - |
| **H1** | 599px | 200px | - | 72px |
| **Subtitle** | 647px | 126px | - | 30px |
| **Label** | auto | 31px | - | 23px |
| **Input** | 520px | 79px | 24px | 26px |
| **Input helper** | 101px | 52px | - | 19px |
| **Info text** | auto | 30px | - | 22px |
| **CTA button** | 312px | 65px | 22px | 24px |
| **Arrow icon** | 25px | 16px | - | stroke: 3px |
| **Disclaimer** | 448px | 27px | - | 20px |
| **Info card** | 350px | 149px | 24px | - |
| **Card title** | auto | 25px | - | 18px |
| **Card text** | 212px | 76px | - | 15px |
| **Cookie banner** | 100% | 82px | - | - |
| **Cookie text** | 791px | 52px | - | 19px |
| **Cookie buttons** | 140/135px | 45px | 0 | 20px |

---

## 🎨 Kolory (Complete Palette)

### Z Figma XML
```css
/* Primary colors */
--zus-green: #00993F;      /* Logo, primary CTA accent */
--zus-navy: #00416E;       /* Headers, info cards text */
--zus-amber: #ffb34f;      /* CTA buttons, highlights */

/* Navigation */
--nav-green: #006e2d;      /* Active nav links */

/* Text colors */
--text-black: #000000;     /* Main headings */
--text-muted: #626262;     /* Subtitles */
--text-gray: #afafaf;      /* Info text */
--text-placeholder: #dadcde; /* Input placeholder */
--text-disclaimer: #9CA3AF; /* Small text */

/* Borders */
--border-gray: #BEC3CE;    /* Input borders */
--border-separator: #d8d8d8; /* Line separator */

/* Backgrounds */
--bg-white: #FFFFFF;       /* Main background */
--bg-card-yellow: #FFFBEB; /* Info cards */
--bg-card-border: #FEF3C7; /* Info cards border */
--bg-cookie: #002911;      /* Cookie banner dark green */
--bg-cookie-btn: #1f3829;  /* Cookie buttons */

/* Chart colors */
--chart-navy: #00416E;     /* 2005, 2020 bars */
--chart-blue: #3F84D2;     /* 2024, 2025 bars */
--chart-green: #00993F;    /* 2025, 2045 bars + trend line */
```

---

## 🔤 Fonty (Kompletna konfiguracja)

### Inter (Primary Font)
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet" />
```
**Użycie**: Cała aplikacja (zamiennik Avenir)
**Wagi**: 400 (normal), 500 (medium), 700 (bold), 800 (black)
**Rozmiar**: ~60KB gzipped

### JetBrains Mono (Monospace)
```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
```
**Użycie**: #RAND0M6 w headerze
**Wagi**: 400, 500, 700
**Rozmiar**: ~45KB gzipped

### Fallback Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
```

---

## 🧪 Testy (DO ZROBIENIA)

### Unit Tests (Vitest)
```typescript
// components/*.test.tsx
describe('PensionInput', () => {
  it('formats currency with spaces');
  it('validates max length');
  it('shows error for invalid input');
});
```

### E2E Tests (Playwright)
```typescript
// e2e/calculator.spec.ts
test('user can submit calculation', async ({ page }) => {
  await page.goto('/');
  await page.fill('[name="expectedPension"]', '5000');
  await page.click('text=Przejdź do symulacji');
  await expect(page).toHaveURL('/wizard');
});
```

### Accessibility Tests
```typescript
// With @axe-core/playwright
test('page has no a11y violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

---

## 📱 Responsywność

### Breakpoints (Tailwind)
```
sm:  640px   - Small mobile
md:  768px   - Tablet portrait
lg:  1024px  - Tablet landscape / small desktop
xl:  1280px  - Desktop
2xl: 1536px  - Large desktop
```

### Layout Adjustments
```css
/* Desktop (≥1024px) */
.hero-grid { grid-template-columns: 1fr 1.1fr; }
.input { width: 520px; }
.info-card { width: 350px; }

/* Tablet (768-1023px) */
.hero-grid { grid-template-columns: 1fr; }
.input { width: 100%; max-width: 520px; }
.chart { order: 2; }
.info-cards { order: 3; }

/* Mobile (<768px) */
.hero-grid { grid-template-columns: 1fr; }
.input { width: 100%; }
.info-card { width: 100%; max-width: 350px; }
.cta-button { width: 100%; }
```

---

## 🔐 Bezpieczeństwo (Frontend)

### Input Sanitization
```typescript
// Currency input
const sanitizeCurrency = (value: string) => {
  return value.replace(/[^\d\s]/g, '').trim();
};

// Max values
const MAX_PENSION = 999999; // 999,999 PLN
const MIN_PENSION = 0;
```

### XSS Protection
```typescript
// Wszystkie user inputs są escapowane przez React
// Dodatkowo: Content-Security-Policy w headers
```

### CORS
```typescript
// next.config.ts
headers: [
  {
    key: 'Access-Control-Allow-Origin',
    value: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  }
]
```

---

## 🌍 I18n (Przyszłość)

Obecnie: **Tylko polski**
Przyszłość: Dodać angielski dla międzynarodowych użytkowników

```typescript
// messages/pl.json
{
  "hero": {
    "title": "Jakiej emerytury oczekujesz?",
    "subtitle": "Sprawdź swoją przyszłą emeryturę w 60 sekund...",
    "inputLabel": "Oczekiwana miesięczna emerytura",
    "inputPlaceholder": "np. 5 000",
    "ctaButton": "Przejdź do symulacji",
    "avgPension": "Średnia emerytura w 2025 roku: {amount} PLN"
  }
}

// messages/en.json
{
  "hero": {
    "title": "What pension do you expect?",
    "subtitle": "Check your future pension in 60 seconds...",
    "inputLabel": "Expected monthly pension",
    "inputPlaceholder": "e.g. 5 000",
    "ctaButton": "Go to simulation",
    "avgPension": "Average pension in 2025: {amount} PLN"
  }
}
```

---

## 📈 Analytics (Przyszłość)

### Events do trackowania
```typescript
type AnalyticsEvent = 
  | 'page_view'
  | 'input_changed'          // User wpisuje kwotę
  | 'cta_clicked'            // "Przejdź do symulacji"
  | 'calculation_submitted'  // Wysłanie formularza
  | 'pdf_downloaded'         // Pobranie PDF
  | 'info_card_clicked'      // Klik w "Czy wiesz, że..."
  | 'tooltip_opened'         // Hover na info icon
  | 'cookie_accepted';       // Akceptacja cookies
```

### Implementation
```typescript
// lib/analytics.ts
export function trackEvent(event: AnalyticsEvent, metadata?: any) {
  // Google Analytics, Mixpanel, lub własne rozwiązanie
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, metadata);
  }
}

// Usage
<Button onClick={() => {
  trackEvent('cta_clicked', { expectedPension });
  router.push('/wizard');
}}>
  Przejdź do symulacji
</Button>
```

---

## 🎭 User Personas

### Persona 1: "Młody Profesjonalista" (25-35 lat)
- Chce zaplanować przyszłość
- Interesuje się optymalizacją składek
- Tech-savvy, używa mobile
- **Needs**: Prosty kalkulator, szybkie wyniki

### Persona 2: "Pracownik przed emeryturą" (55-65 lat)
- Planuje konkretny rok emerytury
- Potrzebuje dokładnych wyliczeń
- Mniej tech-savvy
- **Needs**: Czytelne wyniki, możliwość druku (PDF)

### Persona 3: "Doradca finansowy"
- Korzysta dla klientów
- Potrzebuje wielu symulacji
- Porównuje scenariusze
- **Needs**: Dashboard z historią, bulk operations

---

## 🔄 State Management

### Obecnie (useState)
```typescript
// page.tsx
const [expectedPension, setExpectedPension] = useState("5000");
```

### Przyszłość (Zustand - opcjonalnie)
```typescript
// store/calculatorStore.ts
interface CalculatorStore {
  formData: CalculationRequest;
  setField: (field: keyof CalculationRequest, value: any) => void;
  submitCalculation: () => Promise<CalculationResponse>;
  results?: CalculationDetail;
  isLoading: boolean;
  error?: string;
}

export const useCalculatorStore = create<CalculatorStore>((set) => ({
  formData: {
    expectedPension: "",
    age: 0,
    // ...
  },
  setField: (field, value) => set((state) => ({
    formData: { ...state.formData, [field]: value }
  })),
  // ...
}));
```

---

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
# → Exported static files in .next/
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.zus-calculator.example.com
NEXT_PUBLIC_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

### Hosting (sugerowane)
- **Vercel** - zero-config deployment
- **Netlify** - CI/CD integration
- **AWS Amplify** - enterprise-grade

---

## 📋 Checklist (Release Readiness)

### Frontend
- [x] Design pixel-perfect z Figma
- [x] Responsywny (mobile/tablet/desktop)
- [x] WCAG 2.2 AA compliance
- [x] Fonty z CDN (Google Fonts)
- [ ] API integration
- [ ] Form validation (Zod)
- [ ] Error handling
- [ ] Loading states
- [ ] Success states

### Quality
- [ ] Unit tests (Vitest)
- [ ] E2E tests (Playwright)
- [ ] Accessibility audit (axe)
- [ ] Performance audit (Lighthouse)
- [ ] Bundle size check (<200kB)
- [ ] Cross-browser testing

### Content
- [ ] Wszystkie teksty sprawdzone
- [ ] Obrazy zoptymalizowane
- [ ] SEO metadata
- [ ] OG images (social sharing)
- [ ] Favicon

### Legal & Compliance
- [ ] RODO compliance
- [ ] Cookie policy
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Disclaimers (educational purpose)

---

## 💡 Tips & Best Practices

### Currency Formatting
```typescript
// Użyj Intl.NumberFormat
const formatPLN = (value: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 0,
  }).format(value);
};

// Output: "5 000 PLN"
```

### Date Handling
```typescript
// Użyj date-fns
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';

const formattedDate = format(parseISO(date), 'dd MMMM yyyy', { locale: pl });
// Output: "4 października 2025"
```

### Error Messages (PL)
```typescript
const errorMessages = {
  required: 'To pole jest wymagane',
  minValue: 'Wartość musi być większa niż {min}',
  maxValue: 'Wartość nie może przekraczać {max}',
  invalidFormat: 'Nieprawidłowy format',
  apiError: 'Wystąpił błąd. Spróbuj ponownie za chwilę.',
};
```

---

**Dokument zaktualizowany**: 4 października 2025  
**Autor**: AI Assistant + Gracjan Ziemiański  
**Projekt**: Hackathon ZUS #RAND0M6

