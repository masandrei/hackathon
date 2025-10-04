# 06. Funkcje produktu (MVP → Plus)

## MVP (Minimum Viable Product)

### Core Features

#### 1. CRUD Wpisów
- ✅ **Tworzenie**: Wizard 2-3 kroki (tytuł → treść → tagi)
- ✅ **Odczyt**: Lista/siatka z preview, szczegóły wpisu
- ✅ **Edycja**: Inline editing + modal
- ✅ **Usuwanie**: Soft delete → archiwizacja

#### 2. CRUD Tagów
- ✅ **Tworzenie**: Dialog z color picker
- ✅ **Edycja**: Zmiana nazwy/koloru
- ✅ **Usuwanie**: Z potwierdzeniem (usuń/odepnij z wpisów)
- ✅ **Zarządzanie**: Dedykowany widok `/tags`

#### 3. Wersjonowanie
- ✅ **Auto-save**: Zapis co 30s + przy zamknięciu
- ✅ **Historia**: Timeline wersji
- ✅ **Restore**: Przywróć starą wersję
- ✅ **Diff**: Porównywarka zmian (side-by-side + inline)

#### 4. Wyszukiwanie Full-Text
- ✅ **Search bar**: Instant search w tytule i treści
- ✅ **Mini index**: Lunr.js / Fuse.js w FE
- ✅ **Highlighting**: Podświetlenie fraz w wynikach
- ✅ **Fuzzy search**: Tolerancja na literówki

#### 5. Filtrowanie i Sortowanie
- ✅ **Filtry**:
  - Po tagach (multi-select)
  - Po zakresie dat (date picker)
  - Przypięte / Zarchiwizowane
- ✅ **Sorty**:
  - Data utworzenia (najnowsze/najstarsze)
  - Data edycji (ostatnio edytowane)
  - Alfabetycznie (A-Z / Z-A)

#### 6. Pin / Archive
- ✅ **Pin**: Przypnij ważne wpisy na górę
- ✅ **Archive**: Ukryj nieaktualne wpisy (bez usuwania)
- ✅ **Batch operations**: Zaznacz wiele → przypnij/archiwizuj

#### 7. Timeline + Diff Viewer
- ✅ **Timeline**: Oś czasu zmian wpisu
- ✅ **Side-by-side diff**: Dwie kolumny (stara | nowa)
- ✅ **Inline diff**: Unified view z highlight
- ✅ **Metadata diff**: Zmiany w tagach, tytule

#### 8. Import / Export
- ✅ **JSON**:
  - Export: Pełny snapshot (entries + tags)
  - Import: Merge lub Replace
- ✅ **CSV**:
  - Export: id, title, tags, createdAt, updatedAt
  - Import: Bulk import (walidacja)
- ✅ **PDF**:
  - Export: Karty wpisów, tagowany PDF/UA
  - Max 2 MB
  - Zawiera: tytuł, tagi, treść, timestamp

#### 9. PWA Offline
- ✅ **Installable**: Manifest + ikony
- ✅ **Offline shell**: Cache HTML/CSS/JS
- ✅ **Service Worker**: Workbox
- ✅ **Cache strategy**: NetworkFirst → CacheFirst
- ✅ **Background sync**: Kolejka operacji offline

#### 10. UI States
- ✅ **Skeletons**: Loading placeholders
- ✅ **Toasts**: Success/Error/Warning/Info
- ✅ **Empty states**: Ilustracje + CTA
- ✅ **Error states**: Czytelne komunikaty + akcje

#### 11. Accessibility (WCAG 2.2 AA)
- ✅ **Klawiatura**: Pełna obsługa (Tab, Enter, Esc, arrows)
- ✅ **aria-live**: Komunikaty dla SR
- ✅ **Kontrasty**: ≥ 4.5:1
- ✅ **Alt texts**: Wszystkie obrazy
- ✅ **Focus trap**: W modalach
- ✅ **Skip links**: "Skip to main content"

---

## Plus (Rozszerzenia)

### 1. Quick Capture (Cmd/Ctrl+K)
```
Globalne skróty → Modal → Szybkie dodanie wpisu
- Autocomplete tagów
- Presety (szablony)
- Zapisz i kontynuuj / Zapisz i zamknij
```

**Implementation:**
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openQuickCapture();
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

### 2. Batch Edycja Tagów
```
Zaznacz wiele wpisów → "Batch edit"
- Dodaj tag do wszystkich
- Usuń tag ze wszystkich
- Zamień tag (A → B)
```

**UI Flow:**
1. Multi-select w liście (checkboxy)
2. Action bar na dole: "3 selected" [Batch edit ▾]
3. Dropdown: Add tags / Remove tags / Replace tag
4. Tag picker → Apply → Toast confirmation

### 3. Szablony Wpisów (Templates)
```
Presety treści dla powtarzających się typów notatek
- Meeting notes (data, uczestnicy, notatki, action items)
- Research notes (źródło, pytanie, notatki, wnioski)
- Daily log (data, wydarzenia, refleksje)
```

**Data Model:**
```typescript
type Template = {
  id: string;
  name: string;
  content: string;    // Markdown z placeholders {{date}}, {{title}}
  tags: string[];     // Default tags
  createdAt: string;
};
```

### 4. Analytics (Local Sink)

#### Eventy do trackowania:
- `entry_created` - Nowy wpis
- `entry_edited` - Edycja wpisu
- `entry_viewed` - Wyświetlenie wpisu
- `search_used` - Użycie wyszukiwarki
- `filter_applied` - Zastosowanie filtra
- `export_pdf` - Eksport do PDF
- `export_json` - Eksport do JSON
- `export_csv` - Eksport do CSV
- `import_json` - Import z JSON
- `import_csv` - Import z CSV
- `pwa_installed` - Instalacja PWA

**Schema:**
```typescript
type AnalyticsEvent = {
  id?: number;        // Auto-increment
  type: EventType;
  timestamp: string;  // ISO 8601
  metadata?: Record<string, any>;
};

// IndexedDB
this.version(1).stores({
  analyticsEvents: '++id, timestamp, type',
});
```

**Export Analytics:**
```typescript
export async function exportAnalyticsCSV(): Promise<string> {
  const events = await db.analyticsEvents.toArray();
  
  const headers = ['id', 'type', 'timestamp', 'metadata'];
  const rows = events.map(e => [
    e.id,
    e.type,
    e.timestamp,
    JSON.stringify(e.metadata || {}),
  ]);
  
  return [headers, ...rows].map(r => r.join(',')).join('\n');
}
```

### 5. I18n (Internationalization)

#### Obsługiwane języki:
- 🇵🇱 Polski (domyślny)
- 🇬🇧 English (przygotowane)

**Next-intl setup:**
```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
});
```

**Translations:**
```json
// messages/pl.json
{
  "common": {
    "add": "Dodaj",
    "edit": "Edytuj",
    "delete": "Usuń",
    "save": "Zapisz",
    "cancel": "Anuluj"
  },
  "entries": {
    "title": "Wpisy",
    "create": "Dodaj wpis",
    "emptyState": "Nie masz jeszcze żadnych wpisów"
  }
}
```

**Format daty/liczb:**
```typescript
const dateFormatter = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const numberFormatter = new Intl.NumberFormat(locale);
```

---

## Roadmap (Przyszłość)

### Phase 3 (Nice to Have)
- 🔮 **AI suggestions**: Tag recommendations based on content
- 🔮 **Link between entries**: Wiki-style links [[Entry Title]]
- 🔮 **Rich text editor**: WYSIWYG + Markdown
- 🔮 **Collaborative editing**: Conflict resolution (CRDTs)
- 🔮 **E2E encryption**: Client-side encryption
- 🔮 **Cloud sync**: Optional backend sync (Supabase/Firebase)

### Phase 4 (Experimental)
- 🧪 **Voice notes**: Web Speech API
- 🧪 **OCR**: Tesseract.js dla skanów
- 🧪 **Mind maps**: Visual connections
- 🧪 **Markdown extensions**: Mermaid diagrams, Math (KaTeX)

