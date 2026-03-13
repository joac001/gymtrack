# GymTrack

Aplicación web multi-usuario para gestionar rutinas de gimnasio. Permite ver y editar la rutina, registrar lo que se hace cada día de entrenamiento y ver estadísticas de progreso.

Para cada ejercicio se incluye un link a búsqueda de imágenes (Google Images) con el nombre del ejercicio, para que el usuario pueda consultar la técnica correcta.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Estilos**: Tailwind CSS v4
- **Base de datos**: MongoDB Atlas (plan M0 gratuito) + Mongoose
- **Auth**: NextAuth.js v5 beta con MongoDB Adapter (Google OAuth)
- **Deploy**: Vercel
- **Drag & drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Gráficos**: `@nivo/line`, `@nivo/bar`, `@nivo/calendar`, `@nivo/radar`
- **Íconos**: `lucide-react`
- **IA (import + musculos)**: `@google/generative-ai` (Gemini 2.5 Flash Lite)
- **Excel (import)**: `exceljs`

## Usuarios

Multi-usuario. Cada usuario tiene su propia rutina y sus propios registros de entrenamiento. El auth se maneja con NextAuth.js.

## Rutina

Las rutinas son **editables**: cada usuario crea y gestiona sus propias rutinas desde cero (CRUD de sesiones y ejercicios). No hay rutina por defecto para nuevos usuarios. La estructura de una rutina puede ser cualquier split.

## Features

1. **Ver rutina**: Cards por sesión con ejercicios, series×reps y notas técnicas
2. **Log de entrenamiento**: Al registrar un entrenamiento, por cada ejercicio se carga:
   - Peso usado (kg)
   - Reps realizadas
   - Series completadas
   - Al finalizar el entrenamiento: **intensidad del 1 al 10** (esfuerzo percibido)
3. **Estadísticas de progreso** (ver sección Sprint 4 más abajo):
   - Progreso de peso por ejercicio (gráfico temporal)
   - Racha y consistencia (semanas seguidas, heatmap por año)
   - Volumen total por sesión (peso × reps × series), últimas 5 semanas
   - Balance de volumen por sesión (Push/Pull/Legs)
   - 1RM estimado por ejercicio (fórmula Epley), últimas 10 semanas
   - Detección de plateau (ejercicios sin progreso en últimas 4 sesiones)
   - Distribución muscular (radar polar, clasificación vía Gemini con caché)
4. **Rutinas editables**: CRUD de sesiones y ejercicios
5. **Links a imágenes**: En el formulario de entrenamiento cada ejercicio tiene un link a búsqueda de Google Images para consultar la técnica
6. **Importar desde Excel**: el usuario sube un `.xlsx` con su rutina/historial preexistente. Gemini interpreta el contenido en una conversación de hasta 3 rondas de preguntas, luego muestra un resumen para confirmar antes de guardar. Crea las rutinas e importa los logs históricos.

## Design System

### Tema y colores

- **Tema**: Dark
- **Background**: `#0e0e0f`
- **Surface**: `#161617`
- **Border**: `#252527`
- **Text**: `#e8e8e8` / Muted: `#6b6b72`
- **Push (naranja-rojo)**: `#f4634a` / accent bg: `rgba(244,99,74,0.08)`
- **Pull (azul)**: `#3b82f6` / accent bg: `rgba(59,130,246,0.08)`
- **Legs (verde)**: `#22c55e` / accent bg: `rgba(34,197,94,0.08)`
- **Success**: `#22c55e` / bg: `rgba(34,197,94,0.08)`
- **Warning**: `#f59e0b` / bg: `rgba(245,158,11,0.08)`
- **Danger**: `#ef4444` / bg: `rgba(239,68,68,0.08)`
- **Radius**: `--radius-sm: 6px` / `--radius-md: 10px` / `--radius-lg: 16px`

### Tipografía

- **Display / títulos**: Bebas Neue — usado en logo, títulos de sesión, badges de día
- **Cuerpo**: DM Sans (weights: 300, 400, 500, 600)

## Modelos de datos (MongoDB)

> El detalle completo de cada modelo está en `src/models/CLAUDE.md`.

**Routine** — múltiples por usuario, una `activa` a la vez. Sesiones embebidas con día de semana asignado. Ejercicios con `reps: { desde, hasta? }` (hasta opcional; si no está, es número fijo). Cada ejercicio tiene campo opcional `musculos: [{ nombre, porcentaje }]` para override manual de clasificación muscular.

**WorkoutLog** — un documento por entrenamiento. Peso y reps por serie individual. Campos de sesión y nombre de ejercicio copiados (desnormalizados) para mantener el historial aunque la rutina cambie. Intensidad 1-10 al finalizar.

**EjercicioMusculos** — caché global (compartida entre todos los usuarios) de clasificaciones musculares por ejercicio. `nombreNorm` como clave única (normalizado: lowercase, sin tildes, sin espacios). Generado por Gemini 2.5 Flash Lite vía `POST /api/ejercicios/musculos`.

## Gestión de tareas — Backlog

El archivo `.claude/BACKLOG.md` es la fuente de verdad de todas las tareas pendientes.

**Flujo de trabajo:**

1. Antes de implementar cualquier funcionalidad, leer el backlog y tomar la tarea correspondiente
2. Mover la tarea a la sección `## En progreso` al comenzar
3. Al terminar, **eliminar la tarea del backlog** (las tareas completas no se marcan, se borran)

**Al planificar un sprint o feature:**

- Siempre crear una sección nueva en el backlog con todas las tareas antes de empezar a codear
- Nunca empezar a implementar algo sin que esté registrado en el backlog primero

**Estructura del backlog** — ver `.claude/BACKLOG.md` para el formato de referencia.

---

## Feature: Configuración de usuario

Ruta: `/configuracion`. Permite al usuario elegir su **unidad de peso preferida**: kg o lbs.

**Regla clave:** los pesos se almacenan **siempre en kg** en MongoDB. La conversión a lbs ocurre solo en la capa de presentación.

**Archivos clave:**

- `src/app/(app)/configuracion/page.tsx` — Server Component, lee `unidadPeso` del modelo `User` y pasa el valor al selector
- `src/app/api/user/settings/route.ts` — GET (obtener `unidadPeso` actual) + PATCH (actualizarlo; valida que sea "kg" o "lbs")
- `src/components/configuracion/UnidadPesoSelector.tsx` — Client Component con dos botones (kg / lbs), feedback visual "Guardando..." / "Guardado ✓" vía `useTransition`
- `src/lib/unidades.ts` — utilidades de conversión usadas en toda la app:
  - `convertirPeso(kg, unidad): number` — convierte kg a la unidad, redondeado a 1 decimal
  - `formatPeso(kg, unidad): string` — devuelve string listo para mostrar, ej: `"82.5 kg"` / `"181.9 lbs"`

**Integración:** `convertirPeso` / `formatPeso` se usan en todos los componentes que muestran pesos: `LogCard`, `EjercicioCard`, `EntrenarForm`, `PesoChart`, `VolumenChart`, `HistorialList`, página de detalle de historial.

---

## Feature: Importar desde Excel (IA)

Ruta: `/importar`. Flujo en 4 pasos:

1. **Upload** (`UploadStep`) — el usuario sube un `.xlsx`
2. **Preguntas** (`PreguntasStep`) — Gemini puede devolver hasta 3 rondas de preguntas si le falta contexto (fechas, unidades, etc.)
3. **Review** (`ReviewStep`) — muestra el resumen de rutinas y logs detectados + ajustes menores (ej: intensidad por defecto). El usuario confirma.
4. **Éxito** — se crean las rutinas y logs en MongoDB.

**Archivos clave:**

- `src/lib/excel-parser.ts` — parsea `.xlsx` a texto tabulado por sheet (vía `exceljs`)
- `src/lib/gemini-import.ts` — system prompt, tipos compartidos (`RutinaImport`, `LogImport`, etc.), función `callGeminiImport`
- `src/app/api/import/chat/route.ts` — recibe archivo o `excelBase64` + historial, llama a Gemini, devuelve preguntas o resultado
- `src/app/api/import/confirm/route.ts` — recibe rutinas + logs confirmados, los persiste en MongoDB
- `src/components/importar/` — `UploadStep`, `PreguntasStep`, `ReviewStep`

**Modelo Gemini:** `gemini-2.5-flash-lite` (baja temperatura para JSON estructurado)

**Reglas de negocio:**

- Límite de 3 rondas de conversación
- El texto del Excel se pasa como `excelBase64` en rondas 2 y 3 (no se re-sube el archivo)
- Rutinas importadas se crean con `activa: false`
- Logs sin fecha usan `fechaIndice` para calcular fechas aproximadas desde una fecha base

---

## Estructura de componentes

Todos los componentes reutilizables de UI viven en `components/ui/` (Button, Input, Skeleton, etc.). Las páginas los importan desde ahí y nunca duplican implementaciones. Cada feature tiene sus propios componentes específicos en `components/[feature]/`.

```
components/
  ui/           ← librería interna reutilizable
  [feature]/    ← componentes específicos de cada feature
app/
  [páginas y layouts]
```

Toda pantalla se modulariza en componentes. No hay páginas monolíticas.

## Convenciones de desarrollo

- **NUNCA hacer deploy.** El deploy lo hace el usuario manualmente al hacer push a `main` (Vercel CI). Claude no debe ejecutar ningún comando de deploy bajo ninguna circunstancia.
- **Mobile first SIEMPRE.** Toda pantalla, componente y layout se diseña primero para móvil. Desktop es una adaptación posterior, nunca el punto de partida.
- Español para UI y comentarios
- App Router de Next.js (carpeta `app/`)
- Server Components por defecto, Client Components solo cuando sea necesario
- API routes en `app/api/`
- Variables de entorno: `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GEMINI_API_KEY`
- En Next.js 16 el middleware se llama `proxy.ts` (no `middleware.ts`) y debe exportarse como `export const proxy = ...`

---

## Feature: Estadísticas avanzadas (Sprint 4)

Ruta: `/estadisticas`. Server Component que calcula todos los datos y los pasa a `StatsPageClient`.

**Sección "Free":**
- `VolumenChart` — barras, últimas 5 semanas, labels S1–S5, tooltip muestra semana ISO real
- `PesoChart` — línea por ejercicio, últimas N sesiones con ~5 ticks en X, eje Y cada 2 unidades
- `IntensidadChart` — línea RPE por entrenamiento, eje Y "10/10", ~5 ticks en X
- `FrecuenciaChart` — barras horizontales de sesiones entrenadas
- `ConsistenciaChart` — heatmap por año (`@nivo/calendar`), solo muestra año actual, "Ver más" para anteriores. Usa `primerLunesDelAnio(year)` para evitar que nivo renderice semanas del año anterior.

**Sección "Análisis avanzado":**
- `BalanceChart` — barras horizontales de volumen acumulado por sesión, coloreadas por `sesionColor`
- `UnRMChart` — línea de 1RM estimado por ejercicio (fórmula Epley: `peso × (1 + reps/30)`), últimas 10 semanas S1–S10
- `PlateauList` — listado de ejercicios estancados (sin progreso en últimas 4 sesiones, ≥2 semanas)
- `MusculoRadarChart` — radar polar de volumen por grupo muscular (`@nivo/radar`), con ranking top-5 abajo

**Clasificación muscular:**
- `src/lib/gemini-musculos.ts` — `normalizarNombre(nombre)` (lowercase + sin tildes + sin espacios) y `clasificarEjercicios(nombres[])` que llama a Gemini
- `POST /api/ejercicios/musculos` — recibe lista de nombres, consulta caché en `EjercicioMusculos`, llama a Gemini solo para los que no están en caché, persiste y devuelve el mapa completo
- La rutina del usuario puede tener `ejercicio.musculos[]` para override del clasificador global
- Gemini devuelve JSON `{ "ejercicioNorm": [{ nombre, porcentaje }] }` usando exactamente estos 10 nombres: Pecho, Espalda, Hombros, Bíceps, Tríceps, Cuádriceps, Isquiotibiales, Glúteos, Abdominales, Pantorrillas

---

## Loading states

**Siempre usar skeletons animados**, nunca spinners simples.

- El skeleton va **por componente**, no por página entera. Cada componente que carga datos de forma asíncrona tiene su propio skeleton, envuelto en un `<Suspense>` individual. Esto permite rendering progresivo: el usuario ve cada sección en cuanto sus datos están listos, sin esperar al resto.
- El skeleton imita la forma del contenido real (mismo layout, mismas proporciones).
- Animación de pulso sobre bloques con color `var(--surface)` / `var(--border)`.
- Componente base reutilizable en `components/ui/Skeleton.tsx`.

```tsx
// Patrón correcto
<Suspense fallback={<EjerciciosSkeleton />}>
  <EjerciciosCard routineId={id} />
</Suspense>

// ❌ Evitar: un solo loading.tsx que bloquea toda la página
```
