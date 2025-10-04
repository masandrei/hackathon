# 02. Routing i nawigacja

## Struktura Routes (Next.js App Router)

### Główne widoki

| Route | Opis | Komponenty |
|-------|------|------------|
| `/` | Start: hero + "Dodaj pamięć" | Hero, CTA, Quick stats |
| `/bank` | Lista/siatka wpisów | Filters, Sort, Quick-search, Card-grid |
| `/entry/new` | Kreator wpisu | Wizard (2-3 kroki) |
| `/entry/{id}` | Szczegóły wpisu | Detail view, Version timeline, Diff viewer |
| `/tags` | Zarządzanie tagami | Tag list, Color picker, CRUD |
| `/compare` | Porównanie wpisów | Multi-select, Diff view (metadata + content) |
| `/import-export` | Import/Export | JSON/CSV/PDF handlers, File pickers |
| `/settings` | Preferencje | Theme, Shortcuts, Local copy, Experiments |
| `/help` | Pomoc/FAQ | Keyboard shortcuts, Offline guide, FAQ |

## Nielsen's Heuristics w UI

Wbudowane zasady użyteczności:

### 1. Widoczność stanu systemu
- **Toasty** - potwierdzenia akcji
- **aria-live** regions - komunikaty dla screen readerów
- **Paski postępu** - długie operacje (eksport, import)
- **Loading states** - skeletons, spinners

### 2. Zapobieganie błędom
- **Walidacje inline** - natychmiastowy feedback
- **Undo/Redo** - cofnij przypadkowe zmiany
- **Potwierdzenia** - dla destrukcyjnych akcji
- **Auto-save** - zapis w trakcie pisania

### 3. Rozpoznawanie > zapamiętywanie
- **Podpowiedzi** - tooltips, placeholders
- **Presety** - szablony wpisów
- **Recent items** - ostatnio używane tagi
- **Smart suggestions** - kontekstowe podpowiedzi

### 4. Estetyka i minimalizm
- **Tylko istotne pola** - nie przeciążaj formularzy
- **Progressive disclosure** - pokaż więcej na żądanie
- **Clear hierarchy** - wizualna hierarchia informacji
- **Breathing room** - 8pt spacing system

## Nawigacja klawiaturowa

### Globalne skróty
- `Cmd/Ctrl + K` - Quick capture (dodaj pamięć)
- `Cmd/Ctrl + /` - Keyboard shortcuts help
- `Cmd/Ctrl + B` - Przejdź do /bank
- `Esc` - Zamknij modal/drawer
- `Tab` / `Shift+Tab` - Nawigacja fokusem

### W widoku listy (/bank)
- `↑` / `↓` - Nawigacja po wpisach
- `Enter` - Otwórz wybrany wpis
- `Space` - Zaznacz/odznacz (multi-select)
- `/` - Focus na search bar

### W edytorze
- `Cmd/Ctrl + S` - Zapisz
- `Cmd/Ctrl + Z` - Undo
- `Cmd/Ctrl + Shift + Z` - Redo
- `Cmd/Ctrl + Enter` - Zapisz i zamknij

## Skip Links

Dla użytkowników klawiatury:
- "Skip to main content"
- "Skip to navigation"
- "Skip to search"

## Breadcrumbs

Dla orientacji w strukturze:
```
Home > Bank > Wpis #123
Home > Settings > Preferencje
```

## Dead Ends - UNIKAJ!

❌ **NIE:**
- Puste ekrany bez CTA
- Komunikaty błędów bez rozwiązania
- Modalne bez opcji wyjścia
- Długie procesy bez anulowania

✅ **TAK:**
- Empty states z "Dodaj pierwszy wpis"
- Błędy z "Spróbuj ponownie" / "Wróć"
- Focus trap + Esc w modalach
- Cancel button w długich procesach

