# 07. Wydajność i budżety

## Performance Budgets

### JavaScript Bundle
- **MVP**: ≤ 200 kB (gzipped)
- **Stretch goal**: ≤ 150 kB (gzipped)

**Breakdown:**
```
Next.js runtime:     ~80 kB
React + ReactDOM:    ~45 kB
Zustand:             ~3 kB
Dexie:               ~25 kB
UI Components:       ~30 kB
Application code:    ~17 kB
----------------------------
Total:               ~200 kB
```

### CSS Bundle
- **Target**: ≤ 50 kB (gzipped)
- **Stretch goal**: ≤ 30 kB (gzipped)

**Strategy:**
- Tailwind JIT (tylko używane klasy)
- Purgowanie nieużywanych styli
- Critical CSS inline

### Images
- **Icons**: SVG (inline lub sprite)
- **Illustrations**: SVG, max 20 kB każda
- **User attachments**: Lazy load, progressive JPEG/WebP

---

## Core Web Vitals

### LCP (Largest Contentful Paint)
**Target**: ≤ 2.5s (3G Fast)

**Optimization:**
- Server-side rendering (Next.js SSR/SSG)
- Preload critical fonts (Inter)
- Critical CSS inline
- Image optimization (next/image)
- Resource hints (preconnect, prefetch)

### FID / INP (First Input Delay / Interaction to Next Paint)
**Target**: ≤ 100ms / ≤ 200ms

**Optimization:**
- Defer non-critical JavaScript
- Code splitting (dynamic imports)
- Web Workers dla ciężkich obliczeń (search index)
- useDeferredValue dla wyszukiwania
- Debouncing user input

### CLS (Cumulative Layout Shift)
**Target**: < 0.1

**Optimization:**
- Rezerwacja miejsca dla dynamicznych treści
- Definicja width/height dla obrazów
- Unikanie dynamicznego wstawiania treści nad fold
- Font display: swap (ale z fallbackiem)

### TTI (Time to Interactive)
**Target**: ≤ 3.5s

**Optimization:**
- Progressive enhancement
- Hydration w Next.js
- Lazy loading komponentów
- Preloadowanie krytycznych zasobów

---

## Kryteria akceptacji wydajności

### 1. Pierwszy zapis od zera
**Target**: ≤ 60s

**Flow:**
1. Użytkownik wchodzi na stronę (0s)
2. Strona się ładuje (≤2.5s LCP)
3. Klik "Dodaj wpis" (0.1s)
4. Wypełnienie formularza (zakładamy 50s)
5. Klik "Zapisz" (0.1s)
6. Zapis do IndexedDB (≤0.2s)
7. Toast confirmation (0.1s)

**Total**: ~53s (buffer: 7s)

### 2. Undo po zapisie
**Target**: ≤ 1s

**Implementation:**
```typescript
const undoStack = useRef<Array<{ action: string; data: any }>>([]);

async function saveEntry(entry: MemoryEntry) {
  // Zapisz poprzedni stan na stos
  const oldEntry = await db.entries.get(entry.id);
  undoStack.current.push({ action: 'update', data: oldEntry });
  
  // Zapisz nowy stan
  await db.entries.put(entry);
  
  // Toast z akcją Undo
  toast.success('Zapisano', {
    action: {
      label: 'Cofnij',
      onClick: async () => {
        const operation = undoStack.current.pop();
        if (operation) {
          await db.entries.put(operation.data);
          toast.success('Cofnięto');
        }
      },
    },
  });
}
```

### 3. Wyszukiwanie 1000 wpisów
**Target**: Pierwsza odpowiedź ≤ 50ms (po zbudowaniu indeksu)

**Strategy:**
1. **Build index on load**: Web Worker w tle
2. **Incremental indexing**: Update index on CRUD
3. **Fuzzy search**: Fuse.js (lightweight, 10kB)
4. **Debouncing**: 150ms delay po ostatnim keypress

**Implementation:**
```typescript
// search-worker.ts
import Fuse from 'fuse.js';

let fuse: Fuse<MemoryEntry>;

self.onmessage = (e) => {
  const { type, payload } = e.data;
  
  if (type === 'BUILD_INDEX') {
    fuse = new Fuse(payload.entries, {
      keys: ['title', 'content'],
      threshold: 0.3,
      minMatchCharLength: 2,
    });
    self.postMessage({ type: 'INDEX_READY' });
  }
  
  if (type === 'SEARCH') {
    const start = performance.now();
    const results = fuse.search(payload.query, { limit: 50 });
    const duration = performance.now() - start;
    
    self.postMessage({ 
      type: 'RESULTS', 
      payload: { results, duration } 
    });
  }
};
```

**React Hook:**
```typescript
const [searchResults, setSearchResults] = useState<MemoryEntry[]>([]);
const workerRef = useRef<Worker>();
const deferredQuery = useDeferredValue(searchQuery);

useEffect(() => {
  workerRef.current = new Worker('/search-worker.js');
  
  workerRef.current.onmessage = (e) => {
    if (e.data.type === 'RESULTS') {
      setSearchResults(e.data.payload.results);
    }
  };
  
  return () => workerRef.current?.terminate();
}, []);

useEffect(() => {
  if (deferredQuery) {
    workerRef.current?.postMessage({
      type: 'SEARCH',
      payload: { query: deferredQuery },
    });
  }
}, [deferredQuery]);
```

---

## Virtualizacja list (1000+ wpisów)

**Library**: @tanstack/react-virtual

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function EntryList({ entries }: { entries: MemoryEntry[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: entries.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Wysokość karty wpisu
    overscan: 5, // Renderuj 5 elementów poza viewport
  });
  
  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const entry = entries[virtualItem.index];
          
          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <EntryCard entry={entry} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

## PWA Performance

### Offline Requirements
✅ **Lista wpisów**: Działa offline (cache IndexedDB)
✅ **Podgląd wpisu**: Działa offline
✅ **Tworzenie wpisu**: Działa offline (sync queue)
✅ **Eksport**: Działa offline (JSON/CSV/PDF)

### Cache Strategy

```typescript
// workbox-config.js
module.exports = {
  globDirectory: 'out/',
  globPatterns: ['**/*.{html,js,css,png,svg,jpg,json}'],
  swDest: 'out/sw.js',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 rok
        },
      },
    },
  ],
};
```

---

## Bundle Analysis

### Skrypt w package.json

```json
{
  "scripts": {
    "analyze": "ANALYZE=true next build"
  }
}
```

### next.config.js

```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... config
});
```

### Monitoring w CI

```bash
npm run analyze
# Generuje: .next/analyze/client.html, server.html

# Sprawdź budżety
if [ $(stat -f%z .next/static/chunks/*.js | awk '{sum+=$1} END {print sum}') -gt 204800 ]; then
  echo "❌ Bundle przekroczył 200kB!"
  exit 1
fi
```

---

## Performance Monitoring (Local)

```typescript
// utils/performance.ts
export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const duration = performance.now() - start;
  
  console.log(`[Perf] ${name}: ${duration.toFixed(2)}ms`);
  
  // Zapisz do analytics
  db.analyticsEvents.add({
    type: 'performance_metric',
    timestamp: new Date().toISOString(),
    metadata: { name, duration },
  });
}

// Użycie
measurePerformance('Search 1000 entries', () => {
  const results = searchEntries('test');
});
```

