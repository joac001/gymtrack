# Lib — Utilities & Helpers

> **Contexto cargado cuando trabajas con helpers, utilidades, y funciones compartidas.**

---

## Estructura

```
src/lib/
├─ mongodb.ts              ← Conexión a MongoDB
├─ unidades.ts             ← Conversión kg/lbs
├─ excel-parser.ts         ← Parseo de Excel
├─ gemini-import.ts        ← Chat Gemini para import
├─ gemini-musculos.ts      ← Clasificación muscular con Gemini
├─ [otros].ts
└─ CLAUDE.md (este)
```

---

## Utilidades Clave

### `unidades.ts` — Conversión de Peso

```typescript
// Convertir kg a unidad del usuario, redondeado a 1 decimal
export function convertirPeso(kg: number, unidad: 'kg' | 'lbs'): number {
  if (unidad === 'kg') return kg
  return Math.round((kg * 2.20462) * 10) / 10
}

// Devolver string formateado
export function formatPeso(kg: number, unidad: 'kg' | 'lbs'): string {
  const valor = convertirPeso(kg, unidad)
  return `${valor} ${unidad}`
}

// Ejemplo
formatPeso(82.5, 'kg')  // "82.5 kg"
formatPeso(82.5, 'lbs') // "181.9 lbs"
```

**Usados en:** LogCard, EjercicioCard, EntrenarForm, PesoChart, VolumenChart, HistorialList

---

### `excel-parser.ts` — Parseo de Excel

```typescript
import { read, utils } from 'exceljs'

export async function parseExcel(buffer: ArrayBuffer) {
  const workbook = new Workbook()
  await workbook.xlsx.load(buffer)

  const sheets: { [name: string]: string[][] } = {}
  workbook.worksheets.forEach(ws => {
    sheets[ws.name] = ws.getSheetValues().slice(1) // skip header
  })

  return sheets
}

export function sheetsToText(sheets: Record<string, string[][]>): string {
  // Convertir tablas a formato tabulado (para Gemini)
  return Object.entries(sheets)
    .map(([name, rows]) => `${name}:\n${rows.map(r => r.join('\t')).join('\n')}`)
    .join('\n\n')
}
```

**Usado en:** `/api/import/chat`, `src/components/importar/UploadStep`

---

### `gemini-import.ts` — Chat Gemini para Import

```typescript
export async function callGeminiImport(
  excelText: string,
  historial: RondaHistorial[]
): Promise<{ status: 'needs_more_info' | 'ready', preguntas?: ..., rutinas?: ... }> {
  // Llamar a Gemini con contexto de historial
  // Retornar preguntas o resultado listo
}

export interface RutinaImport {
  nombre: string
  sesiones: SesionImport[]
}

export interface LogImport {
  sesionNombre: string
  fecha?: string
  fechaIndice?: number
  ejercicios: EjercicioLogImport[]
  intensidad?: number
  notas?: string
}
```

**Usado en:** `/api/import/chat`, `src/app/(app)/importar/page.tsx`

---

### `gemini-musculos.ts` — Clasificación Muscular

```typescript
export function normalizarNombre(nombre: string): string {
  // "Bench Press" → "benchpress"
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/\s+/g, '')
}

export async function clasificarEjercicios(nombres: string[]) {
  // Consultar caché (EjercicioMusculos)
  // Si faltan, llamar a Gemini
  // Persistir nuevos en caché
  // Retornar mapa completo
}
```

**Retorna:**
```typescript
{
  "benchpress": [
    { nombre: "Pecho", porcentaje: 70 },
    { nombre: "Hombros", porcentaje: 20 },
    { nombre: "Tríceps", porcentaje: 10 }
  ]
}
```

**Usado en:** `/api/ejercicios/musculos`, cálculo de gráfico Radar

---

### `mongodb.ts` — Conexión a MongoDB

```typescript
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI)
  }

  cached.conn = await cached.promise
  return cached.conn
}
```

**Patrón:** Cachear conexión para evitar re-conectar en cada request (Edge Runtime)

---

## Convenciones

### Funciones Puras

```typescript
// ✅ BIEN: sin side effects
export function calcularVolumen(reps: number, peso: number, series: number): number {
  return reps * peso * series
}

// ❌ EVITAR: con side effects
export function calcularVolumen(reps: number, peso: number, series: number) {
  const resultado = reps * peso * series
  console.log('Volumen:', resultado)  // Logging está OK en algunos casos
  updateDatabase(resultado)  // NO: side effect
  return resultado
}
```

### Nombres Descriptivos

```typescript
// ✅ BIEN
export function calcularProgresoPeso(logs: WorkoutLog[], ejercicioId: string)
export function normalizarNombreEjercicio(nombre: string)

// ❌ EVITAR
export function calc(logs, id)
export function norm(nombre)
```

### Typing

```typescript
// ✅ BIEN
export function procesar(datos: WorkoutLog[]): { volumen: number, intensidad: number } {
  return { volumen: 0, intensidad: 0 }
}

// ❌ EVITAR
export function procesar(datos) {
  return { volumen: 0, intensidad: 0 }  // Sin tipos
}
```

---

## Testing de Helpers

```typescript
// unidades.test.ts
import { convertirPeso, formatPeso } from './unidades'

test('convertir kg a lbs', () => {
  expect(convertirPeso(82.5, 'lbs')).toBeCloseTo(181.9, 0)
})

test('formatear peso', () => {
  expect(formatPeso(82.5, 'kg')).toBe('82.5 kg')
  expect(formatPeso(82.5, 'lbs')).toBe('181.9 lbs')
})
```

---

## Performance

### Cachear Resultados Costosos

```typescript
const cache = new Map()

export async function clasificarEjercicios(nombres: string[]) {
  const key = JSON.stringify(nombres.sort())
  if (cache.has(key)) {
    return cache.get(key)
  }

  const resultado = await llamarGemini(nombres)
  cache.set(key, resultado)
  return resultado
}
```

### Evitar N+1 Queries

```typescript
// ❌ EVITAR
for (const logId of logIds) {
  const log = await WorkoutLog.findById(logId)  // N queries
}

// ✅ BIEN
const logs = await WorkoutLog.find({ _id: { $in: logIds } })  // 1 query
```

---

## Resumen

1. **Funciones puras** sin side effects
2. **Nombres descriptivos** (no abreviaturas)
3. **TypeScript obligatorio** en tipos de entrada/salida
4. **Cachear** resultados costosos
5. **Evitar N+1** queries en MongoDB
6. **Testing** para helpers críticos

