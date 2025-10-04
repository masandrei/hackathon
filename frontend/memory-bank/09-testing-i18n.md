# 09. Testy, jakość i internacjonalizacja

## Testy jednostkowe (Vitest + Testing Library)

### Setup

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

### Konfiguracja

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
});
```

### Przykładowe testy komponentów

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick handler', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledOnce();
  });
  
  it('is disabled when loading', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Testy utils/helpers

```typescript
import { describe, it, expect } from 'vitest';
import { formatRelativeTime, formatFileSize } from '@/utils/format';

describe('formatRelativeTime', () => {
  it('returns "Dziś" for today', () => {
    const today = new Date().toISOString();
    expect(formatRelativeTime(today)).toBe('Dziś');
  });
  
  it('returns "2 dni temu" for 2 days ago', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(twoDaysAgo)).toBe('2 dni temu');
  });
});

describe('formatFileSize', () => {
  it('formats bytes correctly', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(1048576)).toBe('1.0 MB');
  });
});
```

---

## Testy e2e (Playwright)

### Setup

```bash
npm install --save-dev @playwright/test
npx playwright install
```

### Przykładowe testy

```typescript
// e2e/entry-crud.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Entry CRUD', () => {
  test('create new entry', async ({ page }) => {
    await page.goto('/');
    
    // Klik "Dodaj wpis"
    await page.click('text=Dodaj wpis');
    await expect(page).toHaveURL('/entry/new');
    
    // Wypełnij formularz
    await page.fill('[name="title"]', 'Test Entry');
    await page.fill('[name="content"]', 'Test content');
    
    // Zapisz
    await page.click('button:has-text("Zapisz")');
    
    // Sprawdź toast
    await expect(page.locator('[role="status"]')).toContainText('Zapisano');
    
    // Sprawdź czy wpis jest na liście
    await page.goto('/bank');
    await expect(page.locator('text=Test Entry')).toBeVisible();
  });
  
  test('edit existing entry', async ({ page }) => {
    // ... test
  });
  
  test('delete entry', async ({ page }) => {
    // ... test
  });
});
```

### Test offline

```typescript
test('works offline', async ({ page, context }) => {
  await page.goto('/bank');
  
  // Poczekaj na załadowanie
  await page.waitForSelector('[data-testid="entry-list"]');
  
  // Przełącz na offline
  await context.setOffline(true);
  
  // Powinno nadal działać
  await page.click('text=Dodaj wpis');
  await page.fill('[name="title"]', 'Offline Entry');
  await page.click('button:has-text("Zapisz")');
  
  // Sprawdź czy zapisało się lokalnie
  await expect(page.locator('text=Offline Entry')).toBeVisible();
});
```

---

## Storybook

### Setup

```bash
npx storybook@latest init
npm install --save-dev @storybook/addon-a11y
```

### Story dla Button

```typescript
// Button.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'destructive'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading...',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

// Empty state
export const EmptyState: Story = {
  render: () => (
    <div>
      <h2>No entries yet</h2>
      <Button>Create your first entry</Button>
    </div>
  ),
};
```

---

## CI (Local) - package.json scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "msw": "msw init public/ --save",
    "analyze": "ANALYZE=true next build",
    "ci": "npm run lint && npm run type-check && npm run test && npm run build"
  }
}
```

---

## Konwencje kodu

### Conventional Commits

```
feat: add quick capture feature (Cmd+K)
fix: resolve IndexedDB transaction error
docs: update README with installation steps
style: format code with Prettier
refactor: extract search logic to Web Worker
test: add e2e tests for offline mode
chore: update dependencies
```

### ESLint + Prettier

```bash
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-jsx-a11y
```

```javascript
// eslint.config.mjs
export default {
  extends: [
    'next/core-web-vitals',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  rules: {
    'no-console': 'warn',
    'prefer-const': 'error',
    'jsx-a11y/alt-text': 'error',
  },
};
```

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

---

## Internacjonalizacja (I18n)

### next-intl setup

```bash
npm install next-intl
```

```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
```

### Messages

```json
// messages/pl.json
{
  "common": {
    "add": "Dodaj",
    "edit": "Edytuj",
    "delete": "Usuń",
    "save": "Zapisz",
    "cancel": "Anuluj",
    "search": "Szukaj",
    "filter": "Filtruj",
    "sort": "Sortuj"
  },
  "entries": {
    "title": "Wpisy",
    "create": "Dodaj wpis",
    "edit": "Edytuj wpis",
    "delete": "Usuń wpis",
    "emptyState": "Nie masz jeszcze żadnych wpisów",
    "emptyStateAction": "Stwórz pierwszy wpis"
  },
  "tags": {
    "title": "Tagi",
    "create": "Dodaj tag",
    "manage": "Zarządzaj tagami"
  }
}
```

```json
// messages/en.json
{
  "common": {
    "add": "Add",
    "edit": "Edit",
    "delete": "Delete",
    "save": "Save",
    "cancel": "Cancel",
    "search": "Search",
    "filter": "Filter",
    "sort": "Sort"
  },
  "entries": {
    "title": "Entries",
    "create": "Add entry",
    "edit": "Edit entry",
    "delete": "Delete entry",
    "emptyState": "You don't have any entries yet",
    "emptyStateAction": "Create your first entry"
  }
}
```

### Użycie w komponencie

```typescript
import { useTranslations } from 'next-intl';

export default function EntryList() {
  const t = useTranslations('entries');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <button>{t('create')}</button>
      
      {entries.length === 0 && (
        <div>
          <p>{t('emptyState')}</p>
          <button>{t('emptyStateAction')}</button>
        </div>
      )}
    </div>
  );
}
```

### Intl API dla dat i liczb

```typescript
// Formatowanie daty
const dateFormatter = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

console.log(dateFormatter.format(new Date()));
// PL: "4 października 2025, 15:30"
// EN: "October 4, 2025, 3:30 PM"

// Formatowanie liczb
const numberFormatter = new Intl.NumberFormat(locale);
console.log(numberFormatter.format(1234567));
// PL: "1 234 567"
// EN: "1,234,567"

// Relative time
const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
console.log(rtf.format(-2, 'day'));
// PL: "przedwczoraj"
// EN: "2 days ago"
```

---

## Eksport PDF (PDF/UA - Tagged PDF)

### react-pdf setup

```bash
npm install @react-pdf/renderer
```

### Tagowany PDF

```typescript
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40 },
  title: { fontSize: 24, marginBottom: 20 },
  entryCard: { marginBottom: 20, padding: 16, border: '1px solid #ccc' },
  entryTitle: { fontSize: 16, fontWeight: 'bold' },
  entryDate: { fontSize: 12, color: '#666' },
  entryContent: { fontSize: 14, marginTop: 8 },
});

const MemoryPDF = ({ entries }: { entries: MemoryEntry[] }) => (
  <Document title="Memory Bank Export" author="Memory Bank" subject="Exported Entries">
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Memory Bank Export</Text>
      {entries.map((entry) => (
        <View key={entry.id} style={styles.entryCard}>
          <Text style={styles.entryTitle}>{entry.title}</Text>
          <Text style={styles.entryDate}>
            {new Date(entry.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.entryContent}>{entry.content}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

export async function exportToPDF(entries: MemoryEntry[]): Promise<Blob> {
  const blob = await pdf(<MemoryPDF entries={entries} />).toBlob();
  return blob;
}
```

### Pobieranie PDF

```typescript
async function downloadPDF() {
  const entries = await db.entries.toArray();
  const blob = await exportToPDF(entries);
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `memory-bank-${Date.now()}.pdf`;
  a.click();
  
  URL.revokeObjectURL(url);
}
```

### Kryteria PDF
- ✅ Tagowany PDF/UA (dostępny dla SR)
- ✅ Max 2 MB
- ✅ Zawiera: tytuł, tagi, treść, timestamp
- ✅ Metadata: title, author, subject

