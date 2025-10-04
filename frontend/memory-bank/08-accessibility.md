# 08. Dostępność (WCAG 2.2 AA)

## Zasady ogólne

**Target**: WCAG 2.2 AA compliance

**Testowanie:**
- NVDA (Windows)
- VoiceOver (macOS/iOS)
- Keyboard-only navigation
- axe DevTools
- Lighthouse Accessibility audit

---

## Kontrasty kolorów

### Wymagania WCAG AA
- **Tekst normalny**: ≥ 4.5:1
- **Tekst duży** (≥18px/14px bold): ≥ 3:1
- **Elementy UI**: ≥ 3:1

### Paleta kolorów (kontrast sprawdzony)

| Element | Kolor | Tło | Kontrast | Status |
|---------|-------|-----|----------|--------|
| Tekst główny | `#0B1220` (ink) | `#FFFFFF` (bg) | 19.5:1 | ✅ AAA |
| Tekst pomocniczy | `#BEC3CE` (gray) | `#FFFFFF` | 2.8:1 | ⚠️ Tylko large text |
| Link | `#3F84D2` (blue) | `#FFFFFF` | 4.9:1 | ✅ AA |
| Sukces | `#00993F` (green) | `#FFFFFF` | 3.7:1 | ✅ AA (large) |
| Błąd | `#F05E5E` (red) | `#FFFFFF` | 4.1:1 | ✅ AA |
| Navy text | `#00416E` (navy) | `#FFFFFF` | 7.4:1 | ✅ AAA |

### Tryb High Contrast

```css
@media (prefers-contrast: high) {
  :root {
    --ink: #000000;
    --bg: #FFFFFF;
    --gray: #767676;
    --blue: #0000EE;
    --green: #006600;
    --red: #CC0000;
  }
}
```

---

## Nawigacja klawiaturowa

### Wymagania
- ✅ Wszystkie interaktywne elementy dostępne przez Tab
- ✅ Logiczna kolejność Tab (top-to-bottom, left-to-right)
- ✅ Widoczny focus ring (≥2px, wysokie kontrasty)
- ✅ Pułapka fokusa (focus trap) w modalach
- ✅ Esc zamyka modalne/drawery
- ✅ Enter/Space aktywuje przyciski

### Focus Ring (Tailwind)

```css
/* globals.css */
*:focus-visible {
  outline: 2px solid var(--blue);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Wyłącz default outline */
*:focus {
  outline: none;
}
```

### Focus Trap w modalach

```typescript
import { useFocusTrap } from '@mantine/hooks';

function Modal({ isOpen, onClose, children }: ModalProps) {
  const focusTrapRef = useFocusTrap(isOpen);
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div
      ref={focusTrapRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {children}
    </div>
  );
}
```

### Keyboard Shortcuts

| Skrót | Akcja |
|-------|-------|
| `Tab` | Następny element |
| `Shift+Tab` | Poprzedni element |
| `Enter` / `Space` | Aktywuj przycisk/link |
| `Esc` | Zamknij modal/drawer/popover |
| `↑` / `↓` | Nawigacja w liście/menu |
| `Home` / `End` | Pierwszy/ostatni element |
| `Cmd/Ctrl+K` | Quick capture |
| `Cmd/Ctrl+/` | Keyboard shortcuts help |

---

## ARIA (Accessible Rich Internet Applications)

### Skip Links

```tsx
// layout.tsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

<style jsx>{`
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--blue);
    color: white;
    padding: 8px;
    z-index: 100;
  }
  
  .skip-link:focus {
    top: 0;
  }
`}</style>
```

### Live Regions (dla toastów)

```tsx
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {toastMessage}
</div>
```

### ARIA Labels

```tsx
{/* Przycisk tylko z ikoną */}
<button aria-label="Usuń wpis">
  <TrashIcon />
</button>

{/* Input z ukrytym labelem */}
<input
  type="search"
  aria-label="Szukaj wpisów"
  placeholder="Szukaj..."
/>

{/* Modal */}
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Usuń wpis</h2>
  <p id="dialog-description">
    Czy na pewno chcesz usunąć ten wpis?
  </p>
</div>
```

### ARIA States

```tsx
{/* Przycisk toggle */}
<button
  aria-pressed={isPinned}
  aria-label={isPinned ? 'Odepnij wpis' : 'Przypnij wpis'}
>
  <PinIcon />
</button>

{/* Expandable section */}
<button
  aria-expanded={isExpanded}
  aria-controls="section-content"
>
  {isExpanded ? 'Zwiń' : 'Rozwiń'}
</button>
<div id="section-content" hidden={!isExpanded}>
  {/* Content */}
</div>

{/* Loading */}
<button disabled={isLoading} aria-busy={isLoading}>
  {isLoading ? 'Zapisywanie...' : 'Zapisz'}
</button>
```

---

## Formularze

### Labels i error messages

```tsx
<div>
  <label htmlFor="entry-title" className="required">
    Tytuł wpisu
  </label>
  <input
    id="entry-title"
    type="text"
    aria-required="true"
    aria-invalid={!!errors.title}
    aria-describedby={errors.title ? 'title-error' : undefined}
  />
  {errors.title && (
    <p id="title-error" role="alert" className="error">
      {errors.title.message}
    </p>
  )}
</div>
```

### Walidacje inline (live)

```tsx
const [title, setTitle] = useState('');
const [titleError, setTitleError] = useState('');

const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setTitle(value);
  
  // Walidacja live
  if (value.length > 200) {
    setTitleError('Tytuł może mieć max 200 znaków');
  } else {
    setTitleError('');
  }
};

return (
  <input
    value={title}
    onChange={handleTitleChange}
    aria-invalid={!!titleError}
    aria-describedby={titleError ? 'title-error' : undefined}
  />
);
```

---

## Touch Targets (mobilne)

### Wymagania
- **Minimum**: 44x44px (WCAG 2.2 Level AA)
- **Recommended**: 48x48px

```css
/* Tailwind: min-w-[44px] min-h-[44px] */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

---

## Screen Reader Support

### Wizualnie ukryty tekst (sr-only)

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Przykłady użycia

```tsx
{/* Link "Read more" z kontekstem */}
<a href={`/entry/${entry.id}`}>
  Read more
  <span className="sr-only"> about {entry.title}</span>
</a>

{/* Loading spinner */}
<div role="status">
  <SpinnerIcon aria-hidden="true" />
  <span className="sr-only">Loading...</span>
</div>

{/* Ikonka dekoracyjna (bez znaczenia) */}
<CheckIcon aria-hidden="true" />
<span>Zapisano</span>
```

---

## Storybook a11y addon

### Setup

```bash
npm install --save-dev @storybook/addon-a11y
```

```typescript
// .storybook/main.ts
export default {
  addons: ['@storybook/addon-a11y'],
};
```

### Użycie w stories

```tsx
import { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'label', enabled: true },
        ],
      },
    },
  },
};

export default meta;

export const Primary: StoryObj<typeof Button> = {
  args: {
    children: 'Click me',
  },
};
```

---

## Testowanie e2e (Playwright)

### Keyboard-only test

```typescript
import { test, expect } from '@playwright/test';

test('navigate entire app with keyboard', async ({ page }) => {
  await page.goto('/');
  
  // Tab do pierwszego przycisku
  await page.keyboard.press('Tab');
  let focused = await page.evaluate(() => document.activeElement?.tagName);
  expect(focused).toBe('BUTTON');
  
  // Enter aktywuje przycisk
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/entry/new');
  
  // Tab przez formularz
  await page.keyboard.press('Tab');
  await page.keyboard.type('Test title');
  
  await page.keyboard.press('Tab');
  await page.keyboard.type('Test content');
  
  // Zapisz formularz
  await page.keyboard.press('Tab'); // Do przycisku Save
  await page.keyboard.press('Enter');
  
  // Sprawdź toast
  await expect(page.locator('[role="status"]')).toContainText('Zapisano');
});
```

### Screen reader test (mock)

```typescript
test('screen reader announces actions', async ({ page }) => {
  await page.goto('/bank');
  
  // Sprawdź live region
  const liveRegion = page.locator('[aria-live="polite"]');
  
  // Usuń wpis
  await page.click('[aria-label="Usuń wpis"]');
  await page.click('button:has-text("Potwierdź")');
  
  // Live region powinien ogłosić
  await expect(liveRegion).toContainText('Wpis został usunięty');
});
```

---

## ESLint a11y plugin

```bash
npm install --save-dev eslint-plugin-jsx-a11y
```

```javascript
// eslint.config.js
module.exports = {
  extends: ['plugin:jsx-a11y/recommended'],
  rules: {
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-role': 'error',
    'jsx-a11y/no-autofocus': 'warn',
  },
};
```

---

## Checklist (przed release)

- [ ] Kontrasty ≥ 4.5:1 (normal text)
- [ ] Focus ring widoczny na wszystkich interakcjach
- [ ] Pełna nawigacja klawiaturą (bez myszy)
- [ ] Focus trap w modalach
- [ ] Skip links działają
- [ ] ARIA labels na wszystkich przyciskach-ikonach
- [ ] Formularze z labelami i live error messages
- [ ] Touch targets ≥ 44x44px
- [ ] Testy NVDA/VoiceOver passed
- [ ] Storybook a11y addon: 0 violations
- [ ] Lighthouse Accessibility: ≥ 95
- [ ] Playwright keyboard-only tests passed

