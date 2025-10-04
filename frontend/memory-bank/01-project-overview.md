# 01. Cel projektu i stack technologiczny

## Cel

Zbuduj kompletną aplikację **Memory-Bank** (zapisy, wyszukiwanie, tagowanie, porównywanie, timeline, eksport) w **czystym front-endzie**. 

**Bez backendu**: dane trzymaj lokalnie (IndexedDB + Cache Storage), z opcją import/eksport (JSON/CSV/PDF).

## Priorytety

1. **UX szybkości** - ≤60s do pierwszej notatki
2. **Klarowność informacji**
3. **Dostępność (a11y)**
4. **Wydajność**

## Stack technologiczny

### Core
- **Next.js 14** / React 18
- **TypeScript**
- **Tailwind CSS**

### UI Components
- **Radix UI** - primitives
- **shadcn/ui** - component library

### State & Data
- **Zustand** - stan aplikacyjny
- **TanStack Query** - cache & sync w obrębie FE
- **Dexie** - IndexedDB wrapper

### Persistence (NO BACKEND!)
- **IndexedDB** (Dexie) - główna trwałość
- **File System Access API** - opcjonalnie, backup
- **LocalStorage** - ustawienia użytkownika

### Service Worker & PWA
- **Workbox** - service worker, offline support
- **Cache Storage** - cache statyków

### Dev Tools
- **MSW** (Mock Service Worker) - mocki
- **Vitest** - testy jednostkowe
- **Playwright** - testy e2e
- **Storybook** - component development

## Stylistyka

**"Quiet-UI, institutional minimalism + human touch"**

Inspiracja: ZUS-adjacent kolory (instytucjonalne, ale przystępne)

## Animacje

- **Awwwards-grade**: subtelne, profesjonalne
- **Timing**: 120–180ms
- **Easing**: `cubic-bezier(.2,.8,.2,1)`
- **Carefully crafted micro-copy**
- **Zero "dead ends"** w UX

## Dostępność

**WCAG 2.2 AA** compliance:
- Fokus klawiatury
- Kontrasty
- Klawiatura 100%
- aria-live regions
- Skip links
- Focus trap w modalach

## Kluczowe ograniczenia

⚠️ **BRAK BACKENDU** - wszystko musi działać lokalnie
⚠️ **Offline-first** - aplikacja musi działać bez internetu
⚠️ **PWA** - installable, cache, service worker

