# 10. Przykładowe dane (fixtures)

## Plik fixtures.json

```json
{
  "version": 1,
  "tags": [
    {
      "id": "t1",
      "name": "Idea",
      "color": "#3F84D2",
      "createdAt": "2025-09-15T10:00:00.000Z"
    },
    {
      "id": "t2",
      "name": "Badania",
      "color": "#00993F",
      "createdAt": "2025-09-20T12:00:00.000Z"
    },
    {
      "id": "t3",
      "name": "Projekt",
      "color": "#00416E",
      "createdAt": "2025-09-25T14:00:00.000Z"
    },
    {
      "id": "t4",
      "name": "Notatka",
      "color": "#FFB34F",
      "createdAt": "2025-09-30T16:00:00.000Z"
    },
    {
      "id": "t5",
      "name": "Archiwum",
      "color": "#BEC3CE",
      "createdAt": "2025-10-01T08:00:00.000Z"
    }
  ],
  "entries": [
    {
      "id": "m1",
      "title": "Hipoteza dot. indeksacji emerytur",
      "content": "Notatka o CPI i realnej wartości emerytur w Polsce. Analiza danych z lat 1995-2080.\n\n## Kluczowe wnioski\n\n- Inflacja średniorocznie: 3.2%\n- Wzrost płac: 4.5%\n- Realny wzrost wartości emerytur: 1.3%",
      "tags": ["t2"],
      "createdAt": "2025-10-01T10:00:00.000Z",
      "updatedAt": "2025-10-01T10:00:00.000Z",
      "versions": [],
      "pin": true,
      "archived": false
    },
    {
      "id": "m2",
      "title": "Pomysł na Memory Bank",
      "content": "Frontend-only aplikacja do zarządzania notatkami z pełnym offline supportem.\n\n**Stack:**\n- Next.js + TypeScript\n- IndexedDB (Dexie)\n- PWA + Service Worker\n\n**Features:**\n- CRUD wpisów i tagów\n- Full-text search\n- Wersjonowanie\n- Import/Export (JSON/CSV/PDF)",
      "tags": ["t1", "t3"],
      "createdAt": "2025-10-02T14:30:00.000Z",
      "updatedAt": "2025-10-03T09:15:00.000Z",
      "versions": [
        {
          "versionId": "v1",
          "timestamp": "2025-10-02T14:30:00.000Z",
          "title": "Pomysł na aplikację do notatek",
          "content": "Frontend-only aplikacja do notatek.",
          "tags": ["t1"],
          "diffNote": "Początkowa wersja"
        }
      ],
      "pin": false,
      "archived": false
    },
    {
      "id": "m3",
      "title": "Meeting notes - 3.10.2025",
      "content": "## Uczestnicy\n- Jan Kowalski\n- Anna Nowak\n- Piotr Wiśniewski\n\n## Agenda\n1. Przegląd projektu\n2. Ustalenia techniczne\n3. Timeline\n\n## Notatki\n- Deadline: 15.10.2025\n- Stack zatwierdzony\n- Next steps: implementacja MVP",
      "tags": ["t4"],
      "createdAt": "2025-10-03T11:00:00.000Z",
      "updatedAt": "2025-10-03T11:00:00.000Z",
      "versions": [],
      "pin": false,
      "archived": false
    },
    {
      "id": "m4",
      "title": "Design System - kolory",
      "content": "Paleta kolorów ZUS-adjacent:\n\n- Green: #00993F\n- Navy: #00416E\n- Amber: #FFB34F\n- Gray: #BEC3CE\n- Blue: #3F84D2\n- Red: #F05E5E\n- Ink: #0B1220\n- BG: #FFFFFF",
      "tags": ["t3"],
      "createdAt": "2025-10-03T15:45:00.000Z",
      "updatedAt": "2025-10-03T15:45:00.000Z",
      "versions": [],
      "pin": false,
      "archived": false
    },
    {
      "id": "m5",
      "title": "Stara notatka z 2024",
      "content": "Jakieś stare notatki, które już nie są aktualne.\n\nMożna je zarchiwizować.",
      "tags": ["t5"],
      "createdAt": "2024-12-15T10:00:00.000Z",
      "updatedAt": "2024-12-15T10:00:00.000Z",
      "versions": [],
      "pin": false,
      "archived": true
    }
  ]
}
```

## Funkcja seed (wypełnienie bazy danych)

```typescript
// utils/seed.ts
import { db } from '@/lib/db';
import fixturesData from './fixtures.json';

export async function seedDatabase(): Promise<void> {
  try {
    // Sprawdź czy baza już ma dane
    const existingEntries = await db.entries.count();
    if (existingEntries > 0) {
      console.log('Database already seeded');
      return;
    }
    
    // Dodaj tagi
    await db.tags.bulkAdd(fixturesData.tags);
    console.log(`✅ Added ${fixturesData.tags.length} tags`);
    
    // Dodaj wpisy
    await db.entries.bulkAdd(fixturesData.entries);
    console.log(`✅ Added ${fixturesData.entries.length} entries`);
    
    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}
```

## Użycie w aplikacji

```typescript
// app/layout.tsx
'use client';

import { useEffect } from 'react';
import { seedDatabase } from '@/utils/seed';

export default function RootLayout({ children }) {
  useEffect(() => {
    // Seed tylko w development
    if (process.env.NODE_ENV === 'development') {
      seedDatabase().catch(console.error);
    }
  }, []);
  
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
```

## Reset bazy danych (dev only)

```typescript
// utils/reset-db.ts
import { db } from '@/lib/db';

export async function resetDatabase(): Promise<void> {
  await db.entries.clear();
  await db.tags.clear();
  await db.meta.clear();
  await db.analyticsEvents.clear();
  
  console.log('✅ Database reset');
}

// Dodaj do window w dev mode
if (process.env.NODE_ENV === 'development') {
  (window as any).resetDB = resetDatabase;
  (window as any).seedDB = seedDatabase;
}

// Użycie w konsoli przeglądarki:
// window.resetDB()
// window.seedDB()
```

## Przykładowe szablony (templates)

```json
{
  "templates": [
    {
      "id": "tpl1",
      "name": "Meeting Notes",
      "content": "## Uczestnicy\n- \n\n## Agenda\n1. \n\n## Notatki\n- \n\n## Action items\n- [ ] ",
      "tags": ["t4"],
      "createdAt": "2025-10-01T00:00:00.000Z"
    },
    {
      "id": "tpl2",
      "name": "Research Notes",
      "content": "## Źródło\n\n## Pytanie badawcze\n\n## Notatki\n\n## Wnioski\n",
      "tags": ["t2"],
      "createdAt": "2025-10-01T00:00:00.000Z"
    },
    {
      "id": "tpl3",
      "name": "Daily Log",
      "content": "# {{date}}\n\n## Co się wydarzyło\n\n## Refleksje\n\n## Na jutro\n- [ ] ",
      "tags": ["t4"],
      "createdAt": "2025-10-01T00:00:00.000Z"
    }
  ]
}
```

