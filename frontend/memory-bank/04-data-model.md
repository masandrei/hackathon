# 04. Model danych i walidacje

## TypeScript Types

### Tag

```typescript
type Tag = {
  id: string;           // UUID
  name: string;         // max 50 znaków
  color: string;        // hex z palety design tokens
  createdAt: string;    // ISO 8601
};
```

### MemoryEntry

```typescript
type MemoryId = string; // UUID

type MemoryEntry = {
  id: MemoryId;
  title: string;                    // max 200 znaków
  content: string;                  // Markdown/Plain text
  tags: string[];                   // Array of Tag.id
  attachments?: Attachment[];       // Opcjonalne załączniki
  createdAt: string;                // ISO 8601
  updatedAt: string;                // ISO 8601
  versions: Version[];              // Historia zmian
  pin?: boolean;                    // Przypięty na górze listy
  archived?: boolean;               // Zarchiwizowany
};
```

### Attachment

```typescript
type Attachment = {
  id: string;           // UUID
  name: string;         // Oryginalna nazwa pliku
  mime: string;         // MIME type
  size: number;         // Rozmiar w bajtach
  dataUrl: string;      // Base64 data URL (dla małych plików)
};
```

### Version (Historia)

```typescript
type Version = {
  versionId: string;    // UUID
  timestamp: string;    // ISO 8601
  title: string;        // Tytuł w tej wersji
  content: string;      // Treść w tej wersji
  tags: string[];       // Tagi w tej wersji
  diffNote?: string;    // Opcjonalna notatka o zmianach
};
```

## Walidacje (Zod)

### Tag Schema

```typescript
import { z } from 'zod';

export const TagSchema = z.object({
  id: z.string().uuid(),
  name: z.string()
    .min(1, 'Nazwa tagu nie może być pusta')
    .max(50, 'Nazwa tagu może mieć max 50 znaków')
    .trim(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Nieprawidłowy format koloru'),
  createdAt: z.string().datetime(),
});
```

### Attachment Schema

```typescript
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
] as const;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const AttachmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  mime: z.enum(ALLOWED_MIME_TYPES, {
    errorMap: () => ({ message: 'Niedozwolony typ pliku' })
  }),
  size: z.number()
    .int()
    .positive()
    .max(MAX_FILE_SIZE, 'Plik nie może być większy niż 10MB'),
  dataUrl: z.string().startsWith('data:'),
});
```

### MemoryEntry Schema

```typescript
export const MemoryEntrySchema = z.object({
  id: z.string().uuid(),
  title: z.string()
    .min(1, 'Tytuł nie może być pusty')
    .max(200, 'Tytuł może mieć max 200 znaków')
    .trim(),
  content: z.string()
    .min(1, 'Treść nie może być pusta')
    .max(50000, 'Treść może mieć max 50000 znaków'),
  tags: z.array(z.string().uuid()),
  attachments: z.array(AttachmentSchema).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  versions: z.array(VersionSchema),
  pin: z.boolean().optional(),
  archived: z.boolean().optional(),
});
```

### Version Schema

```typescript
export const VersionSchema = z.object({
  versionId: z.string().uuid(),
  timestamp: z.string().datetime(),
  title: z.string().max(200),
  content: z.string().max(50000),
  tags: z.array(z.string().uuid()),
  diffNote: z.string().max(500).optional(),
});
```

## Normalizacja danych

### Przed zapisem

```typescript
function normalizeMemoryEntry(entry: Partial<MemoryEntry>): Partial<MemoryEntry> {
  return {
    ...entry,
    title: entry.title?.trim(),
    content: entry.content?.trim(),
    // Usuń puste tagi
    tags: entry.tags?.filter(tag => tag && tag.trim()),
  };
}
```

### Puste treści

```typescript
function validateNotEmpty(content: string): boolean {
  const trimmed = content.trim();
  // Blokuj same białe znaki lub same znaki formatowania Markdown
  const withoutMarkdown = trimmed.replace(/[#*_~`\[\]]/g, '');
  return withoutMarkdown.trim().length > 0;
}
```

## Bezpieczeństwo

### Sanityzacja Markdown (DOMPurify)

```typescript
import DOMPurify from 'dompurify';

function sanitizeMarkdown(markdown: string): string {
  // Konwertuj Markdown → HTML
  const html = markdownToHtml(markdown);
  
  // Sanityzuj HTML
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'blockquote', 'hr',
    ],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
  });
  
  return clean;
}
```

### Content Security Policy

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Tailwind JIT
      "style-src 'self' 'unsafe-inline'",                // Tailwind inline
      "img-src 'self' data: blob:",                      // Data URLs dla attachments
      "font-src 'self'",
      "connect-src 'self'",
      "worker-src 'self' blob:",                         // Service Worker
    ].join('; '),
  },
];
```

### Blokowanie podejrzanych MIME

```typescript
const DANGEROUS_MIME_TYPES = [
  'application/javascript',
  'application/x-javascript',
  'text/javascript',
  'application/x-sh',
  'application/x-executable',
];

function isSafeMimeType(mime: string): boolean {
  return !DANGEROUS_MIME_TYPES.includes(mime.toLowerCase());
}
```

## Helpers / Utils

### Generowanie ID

```typescript
import { v4 as uuidv4 } from 'uuid';

export function generateId(): string {
  return uuidv4();
}
```

### Formatowanie dat

```typescript
export function formatDate(isoString: string, locale: string = 'pl-PL'): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeTime(isoString: string, locale: string = 'pl-PL'): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Dziś';
  if (diffDays === 1) return 'Wczoraj';
  if (diffDays < 7) return `${diffDays} dni temu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tyg. temu`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} mies. temu`;
  return `${Math.floor(diffDays / 365)} lat temu`;
}
```

### File Size formatowanie

```typescript
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}
```

