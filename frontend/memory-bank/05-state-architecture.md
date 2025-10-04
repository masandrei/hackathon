# 05. Architektura stanu i trwałości

## Zustand Store (Stan aplikacyjny)

### useMemoryStore

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MemoryStore {
  // Data
  entries: MemoryEntry[];
  tags: Tag[];
  
  // UI State
  searchQuery: string;
  filters: {
    tags: string[];
    dateRange: { from: string; to: string } | null;
    archived: boolean;
    pinned: boolean;
  };
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  sortOrder: 'asc' | 'desc';
  
  // Selection
  selectedEntryIds: string[];
  
  // UI Flags
  isLoading: boolean;
  isSyncing: boolean;
  
  // Actions
  setEntries: (entries: MemoryEntry[]) => void;
  addEntry: (entry: MemoryEntry) => void;
  updateEntry: (id: string, updates: Partial<MemoryEntry>) => void;
  deleteEntry: (id: string) => void;
  
  setTags: (tags: Tag[]) => void;
  addTag: (tag: Tag) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<MemoryStore['filters']>) => void;
  setSorting: (sortBy: MemoryStore['sortBy'], sortOrder: MemoryStore['sortOrder']) => void;
  
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
  selectAll: () => void;
}

export const useMemoryStore = create<MemoryStore>()(
  persist(
    (set, get) => ({
      // Initial state
      entries: [],
      tags: [],
      searchQuery: '',
      filters: {
        tags: [],
        dateRange: null,
        archived: false,
        pinned: false,
      },
      sortBy: 'updatedAt',
      sortOrder: 'desc',
      selectedEntryIds: [],
      isLoading: false,
      isSyncing: false,
      
      // Actions implementation...
      setEntries: (entries) => set({ entries }),
      addEntry: (entry) => set((state) => ({ 
        entries: [...state.entries, entry] 
      })),
      // ... pozostałe actions
    }),
    {
      name: 'memory-store',
      partialize: (state) => ({
        // Persist tylko preferencje UI, nie dane
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    }
  )
);
```

## IndexedDB (Dexie) - Trwałość główna

### Schema & Configuration

```typescript
import Dexie, { Table } from 'dexie';

export class MemoryBankDB extends Dexie {
  entries!: Table<MemoryEntry, string>;
  tags!: Table<Tag, string>;
  meta!: Table<{ key: string; value: any }, string>;
  analyticsEvents!: Table<AnalyticsEvent, number>;
  
  constructor() {
    super('memory-bank-db');
    
    this.version(1).stores({
      entries: 'id, createdAt, updatedAt, *tags, pin, archived',
      tags: 'id, name, createdAt',
      meta: 'key',
      analyticsEvents: '++id, timestamp, type',
    });
  }
}

export const db = new MemoryBankDB();
```

### CRUD Operations

```typescript
// Create
export async function createEntry(entry: MemoryEntry): Promise<string> {
  const id = await db.entries.add(entry);
  return id;
}

// Read
export async function getEntry(id: string): Promise<MemoryEntry | undefined> {
  return await db.entries.get(id);
}

export async function getAllEntries(): Promise<MemoryEntry[]> {
  return await db.entries.toArray();
}

// Update
export async function updateEntry(
  id: string, 
  updates: Partial<MemoryEntry>
): Promise<void> {
  await db.entries.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

// Delete
export async function deleteEntry(id: string): Promise<void> {
  await db.entries.delete(id);
}

// Queries
export async function searchEntries(query: string): Promise<MemoryEntry[]> {
  const lowerQuery = query.toLowerCase();
  return await db.entries
    .filter(entry => 
      entry.title.toLowerCase().includes(lowerQuery) ||
      entry.content.toLowerCase().includes(lowerQuery)
    )
    .toArray();
}

export async function getEntriesByTag(tagId: string): Promise<MemoryEntry[]> {
  return await db.entries
    .where('tags')
    .equals(tagId)
    .toArray();
}
```

### Migracje (Schema Versioning)

```typescript
// Przyszłe wersje
this.version(2).stores({
  entries: 'id, createdAt, updatedAt, *tags, pin, archived, *attachments',
  // Dodano indeks na attachments
}).upgrade(async (trans) => {
  // Migracja danych z v1 → v2
  await trans.table('entries').toCollection().modify(entry => {
    if (!entry.attachments) {
      entry.attachments = [];
    }
  });
});
```

## LocalStorage (Preferencje użytkownika)

```typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  locale: 'pl' | 'en';
  shortcuts: Record<string, string>;
  experiments: {
    enableWebWorkerSearch: boolean;
    enableAutoBackup: boolean;
  };
}

const PREFS_KEY = 'memory-bank-prefs';

export function loadPreferences(): UserPreferences {
  const stored = localStorage.getItem(PREFS_KEY);
  return stored ? JSON.parse(stored) : getDefaultPreferences();
}

export function savePreferences(prefs: UserPreferences): void {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

function getDefaultPreferences(): UserPreferences {
  return {
    theme: 'system',
    locale: 'pl',
    shortcuts: {},
    experiments: {
      enableWebWorkerSearch: true,
      enableAutoBackup: false,
    },
  };
}
```

## Service Worker (Workbox) - Offline Support

### Service Worker Config

```typescript
// next.config.js + workbox plugin
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'memory-bank-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dni
        },
      },
    },
  ],
});
```

### Sync Queue (Offline Operations)

```typescript
// Background sync dla operacji offline
import { Queue } from 'workbox-background-sync';

const queue = new Queue('memory-bank-sync-queue', {
  maxRetentionTime: 7 * 24 * 60, // 7 dni w minutach
});

// Dodaj operację do kolejki
export async function queueOperation(operation: {
  type: 'create' | 'update' | 'delete';
  table: 'entries' | 'tags';
  data: any;
}): Promise<void> {
  await queue.pushRequest({
    request: new Request('/api/sync', {
      method: 'POST',
      body: JSON.stringify(operation),
    }),
  });
}
```

## Import / Export

### JSON Export/Import

```typescript
export async function exportToJSON(): Promise<string> {
  const entries = await db.entries.toArray();
  const tags = await db.tags.toArray();
  
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    entries,
    tags,
  };
  
  return JSON.stringify(data, null, 2);
}

export async function importFromJSON(jsonString: string): Promise<void> {
  const data = JSON.parse(jsonString);
  
  // Walidacja
  if (data.version !== 1) {
    throw new Error('Nieobsługiwana wersja danych');
  }
  
  // Import
  await db.transaction('rw', db.entries, db.tags, async () => {
    await db.tags.bulkAdd(data.tags);
    await db.entries.bulkAdd(data.entries);
  });
}
```

### CSV Export

```typescript
export async function exportToCSV(): Promise<string> {
  const entries = await db.entries.toArray();
  
  const headers = ['id', 'title', 'tags', 'createdAt', 'updatedAt'];
  const rows = entries.map(entry => [
    entry.id,
    entry.title,
    entry.tags.join(';'),
    entry.createdAt,
    entry.updatedAt,
  ]);
  
  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');
}
```

### PDF Export (react-pdf)

```typescript
import { Document, Page, Text, View, pdf } from '@react-pdf/renderer';

const MemoryPDF = ({ entries, tags }: { entries: MemoryEntry[]; tags: Tag[] }) => (
  <Document title="Memory Bank Export">
    <Page size="A4" style={{ padding: 40 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Memory Bank Export
      </Text>
      {entries.map(entry => (
        <View key={entry.id} style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            {entry.title}
          </Text>
          <Text style={{ fontSize: 12, color: '#666' }}>
            {formatDate(entry.createdAt)}
          </Text>
          <Text style={{ fontSize: 14, marginTop: 8 }}>
            {entry.content}
          </Text>
        </View>
      ))}
    </Page>
  </Document>
);

export async function exportToPDF(entries: MemoryEntry[]): Promise<Blob> {
  const tags = await db.tags.toArray();
  const blob = await pdf(<MemoryPDF entries={entries} tags={tags} />).toBlob();
  return blob;
}
```

## File System Access API (Auto-backup)

```typescript
export async function saveBackupToFile(): Promise<void> {
  if (!('showSaveFilePicker' in window)) {
    throw new Error('File System Access API nie jest dostępne');
  }
  
  const json = await exportToJSON();
  const blob = new Blob([json], { type: 'application/json' });
  
  // @ts-ignore (File System Access API)
  const handle = await window.showSaveFilePicker({
    suggestedName: `memory-bank-backup-${Date.now()}.json`,
    types: [{
      description: 'JSON Files',
      accept: { 'application/json': ['.json'] },
    }],
  });
  
  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();
}
```

## TanStack Query (Opcjonalnie - dla cache)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useEntries() {
  return useQuery({
    queryKey: ['entries'],
    queryFn: () => db.entries.toArray(),
  });
}

export function useCreateEntry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (entry: MemoryEntry) => db.entries.add(entry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
    },
  });
}
```

