# Components — Design System & UI Library

> **Contexto cargado cuando trabajas con componentes, UI, y diseño.**

---

## Design System

### Tema

- **Tema:** Dark
- **Background:** `#0e0e0f` (var: `--background`)
- **Surface:** `#161617` (var: `--surface`)
- **Border:** `#252527` (var: `--border`)
- **Text:** `#e8e8e8` (var: `--text`)
- **Text Muted:** `#6b6b72` (var: `--text-muted`)

### Colores Acento (por Sesión)

- **Push (Pecho/Hombro):** `#f4634a` (rojo-naranja)
  - Accent BG: `rgba(244, 99, 74, 0.08)`
- **Pull (Espalda/Brazos):** `#3b82f6` (azul)
  - Accent BG: `rgba(59, 130, 246, 0.08)`
- **Legs:** `#22c55e` (verde)
  - Accent BG: `rgba(34, 197, 94, 0.08)`

### Colores de Estado

- **Success:** `#22c55e` (verde)
  - BG: `rgba(34, 197, 94, 0.08)`
- **Warning:** `#f59e0b` (naranja)
  - BG: `rgba(245, 158, 11, 0.08)`
- **Danger:** `#ef4444` (rojo)
  - BG: `rgba(239, 68, 68, 0.08)`

### Border Radius

- **--radius-sm:** 6px
- **--radius-md:** 10px
- **--radius-lg:** 16px

### Tipografía

- **Display/Títulos:** Bebas Neue
  - Usado en: logo, títulos de sesión, badges de día
  - Font-weight: 400 (default de la fuente)
- **Cuerpo:** DM Sans
  - Weights: 300 (light), 400 (regular), 500 (medium), 600 (semibold)

---

## Estructura de Componentes

```
components/
├─ ui/                    ← Librería interna reutilizable
│  ├─ Button.tsx
│  ├─ Input.tsx
│  ├─ Skeleton.tsx
│  └─ ...otros básicos
├─ layout/               ← Layouts (Header, AppShell, etc.)
│  ├─ Header.tsx
│  ├─ AppShell.tsx
│  └─ Navigation.tsx
├─ [feature]/            ← Componentes específicos por feature
│  ├─ configuracion/
│  ├─ importar/
│  ├─ chat/
│  └─ estadisticas/
└─ CLAUDE.md (este)
```

---

## Convenciones

### Estructura de Componentes

**Client Component (cuando necesario):**
```tsx
'use client'
import { useState, useTransition } from 'react'

export default function Component() {
  const [state, setState] = useState(...)
  const [isPending, startTransition] = useTransition()

  return (...)
}
```

**Server Component (por defecto):**
```tsx
import { auth } from '@/auth'
import Model from '@/models/...'

export default async function Page() {
  const session = await auth()
  const data = await Model.find(...)

  return (...)
}
```

### Styling

**Usar variables CSS en lugar de clases Tailwind:**
```tsx
// ✅ BIEN
<div style={{ background: 'var(--surface)', color: 'var(--text)' }}>

// ❌ EVITAR
<div className="bg-gray-900 text-white">  // hardcodeado
```

**Mobile-first SIEMPRE:**
```tsx
// ✅ BIEN: definis mobile, luego desktop
<div className="text-sm md:text-base">

// ❌ EVITAR: empezar por desktop
<div className="text-base md:text-sm">
```

### Props TypeScript

```tsx
interface Props {
  title: string
  color?: 'push' | 'pull' | 'legs'
  onSubmit: (data: any) => void
  children?: React.ReactNode
}

export default function Component({ title, color = 'push', onSubmit, children }: Props) {
  // ...
}
```

---

## Componentes Reutilizables (components/ui/)

### Button

```tsx
<Button
  variant="primary"  // 'primary' | 'secondary' | 'ghost'
  size="md"         // 'sm' | 'md' | 'lg'
  disabled={false}
  onClick={handleClick}
>
  Enviar
</Button>
```

### Input

```tsx
<Input
  type="text"
  placeholder="Tu nombre"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  disabled={false}
/>
```

### Skeleton

```tsx
<Skeleton width={200} height={24} />

// Animado con pulso sobre --surface / --border
// Imita forma del contenido real
```

---

## Loading States (Importante)

**NUNCA usar spinners simples. Siempre skeletons animados.**

```tsx
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<EjerciciosSkeleton />}>
      <EjerciciosCard routineId={id} />
    </Suspense>
  )
}

function EjerciciosSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton height={60} />
      <Skeleton height={60} />
      <Skeleton height={60} />
    </div>
  )
}
```

**Patrón correcto:**
- Skeleton por componente (no página entera)
- Cada componente con Suspense individual
- Rendering progresivo (usuario ve contenido en cuanto listo)

---

## Español en UI

**Todos los textos visibles al usuario en español.**

```tsx
// ✅ BIEN
<button>Guardar rutina</button>
<label>Peso (kg)</label>

// ❌ EVITAR
<button>Save routine</button>
<label>Weight (kg)</label>
```

---

## Colores por Sesión/Categoría

**Mapping automático en helpers:**

```typescript
// En src/lib/sesion-utils.ts (ejemplo)
export function sesionColor(tipo: 'push' | 'pull' | 'legs'): string {
  switch (tipo) {
    case 'push': return '#f4634a'
    case 'pull': return '#3b82f6'
    case 'legs': return '#22c55e'
  }
}
```

**Usar en componentes:**
```tsx
<div style={{ color: sesionColor(type), background: `${sesionColor(type)}15` }}>
  {nombre}
</div>
```

---

## Accesibilidad

- **Botones:** `<button type="button">` o `<Link>`
- **Labels:** Siempre con `<label htmlFor="inputId">`
- **Contrast:** Verificar que text / background cumpla WCAG AA
- **Keyboard navigation:** Funcionar sin mouse

---

## Performance

- **Code splitting:** Lazy load componentes pesados
- **Image optimization:** Usar `<Image />` de Next.js
- **Memoization:** `React.memo()` si props no cambian
- **Evitar re-renders innecesarios:** `useCallback`, `useMemo`

---

## Testing de Componentes

**Estructura típica:**
```tsx
// component.test.tsx
import { render, screen } from '@testing-library/react'
import Component from './Component'

test('renders button', () => {
  render(<Component />)
  expect(screen.getByText('Enviar')).toBeInTheDocument()
})
```

---

## Resumen

1. **UI en variables CSS** (no hardcoded)
2. **Mobile first** SIEMPRE
3. **Server Components** por defecto
4. **Skeletons** para loading (no spinners)
5. **Español** en UI
6. **Componentes chicos y reutilizables** (no monolitos)
7. **TypeScript** para props

