# GymTrack

Aplicación web multi-usuario para gestionar rutinas de gimnasio. Permite ver y editar la rutina, registrar lo que se hace cada día de entrenamiento y ver estadísticas de progreso.

Para cada ejercicio se incluye un link a búsqueda de imágenes (Google Images) con el nombre del ejercicio, para que el usuario pueda consultar la técnica correcta.

---

## 🎯 Resumen Ejecutivo

**Modelo de negocio:** Freemium híbrido (B2C indie trainers + B2B gimnasios)
- **Tier Free:** $0 — 1 rutina, 3 meses historial, 5 gráficos básicos
- **Tier Pro:** $7/mes — rutinas ilimitadas, chat IA, historial ilimitado
- **Tier Trainer:** $20/mes — gestión de múltiples alumnos
- **Tier Business:** $400-1.2k/mes — para gimnasios

**Roadmap:** 7 etapas atemporales (ver `ROADMAP.md`)

**MVP (Etapa 0):** Free + Pro (ver `FIRST_5_STEPS.md` para tareas concretas)

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Estilos**: Tailwind CSS v4
- **Base de datos**: MongoDB Atlas + Mongoose
- **Auth**: NextAuth.js v5 (Google OAuth)
- **Deploy**: Vercel
- **Librerías especializadas**:
  - Gráficos: `@nivo/*`
  - Drag & drop: `@dnd-kit/*`
  - IA: `@google/generative-ai` (Gemini 2.5 Flash Lite)
  - Excel: `exceljs`
  - Pagos: Talo.com.ar

---

## 📁 Estructura de Contexto

**Este archivo es el contexto general.** Otros CLAUDE.md distribuidos cargan contexto específico:

- **[`.claude/CLAUDE.md`](./) (este)** — Visión, tech stack, convenciones generales
- **[`src/models/CLAUDE.md`](../src/models/CLAUDE.md)** — Esquemas MongoDB (User, Routine, WorkoutLog, EjercicioMusculos)
- **[`src/components/CLAUDE.md`](../src/components/CLAUDE.md)** — Design system, componentes reutilizables
- **[`src/lib/CLAUDE.md`](../src/lib/CLAUDE.md)** — Utilidades, helpers, funciones compartidas
- **[`src/app/api/CLAUDE.md`](../src/app/api/CLAUDE.md)** — API routes, endpoints, autenticación

**Carga contexto específico solo cuando lo necesites:**
```
Si trabajas en:
├─ Models → carga `src/models/CLAUDE.md`
├─ Componentes → carga `src/components/CLAUDE.md`
├─ Helpers/utils → carga `src/lib/CLAUDE.md`
├─ API routes → carga `src/app/api/CLAUDE.md`
└─ General → este archivo
```

---

## 👥 Usuarios & Features

**Multi-usuario:** Cada usuario tiene su propia rutina y registros de entrenamiento.

**Features principales:**
1. CRUD de rutinas (sesiones, ejercicios)
2. Log de entrenamientos (peso, reps, series, intensidad 1-10)
3. Historial con búsqueda
4. Estadísticas de progreso (gráficos)
5. Chat IA (Gemini) sobre tus datos
6. Import Excel/CSV con Gemini
7. Configuración usuario (kg/lbs)
8. Drag & drop para reordenar

---

## 🎨 Design System

**Resumen:** Dark theme, variables CSS, mobile-first

Ver detalles completos en `src/components/CLAUDE.md`

---

## 📋 Gestión de Tareas

- **`ROADMAP.md`** — 7 etapas atemporales (qué features por etapa)
- **`BACKLOG.md`** — Tareas concretas (checkboxes por etapa)
- **`FIRST_5_STEPS.md`** — Pasos detallados para comenzar (Etapa 0)
- **`WORKFLOW.md`** — Git, commits, security

**Workflow:**
1. Leer backlog antes de implementar
2. Crear branch `feature/etapa-X`
3. Commits atómicos
4. Push → merge a main → siguiente etapa

Ver `WORKFLOW.md` para detalles.

---

## 🔐 Convenciones de Desarrollo

- **NUNCA deploy:** El usuario pushea a `main`, Vercel auto-deploya
- **Mobile first:** Diseñar para móvil primero
- **Español:** UI y comentarios en español
- **Server Components:** Default, `use client` solo si necesario
- **Datos sensibles:** NUNCA pushear `.env`, API keys, credenciales
- **Git:** Ver `WORKFLOW.md`

---

## 📚 Lectura Recomendada

**Antes de empezar:**
1. `ROADMAP.md` — Visión del producto (7 etapas, qué entra en cada una)
2. `FIRST_5_STEPS.md` — Pasos concretos para MVP (Etapa 0)
3. `WORKFLOW.md` — Cómo hacer commits, push, y gestionar branches
4. `BACKLOG.md` — Tareas a ejecutar (para tracking)

**Después, según necesites:**
- Editando componentes → `src/components/CLAUDE.md`
- Editando models → `src/models/CLAUDE.md`
- Creando helpers → `src/lib/CLAUDE.md`
- Creando APIs → `src/app/api/CLAUDE.md`

---

## 🔗 Resumen de Archivos `.claude/`

| Archivo | Propósito |
|---------|-----------|
| `CLAUDE.md` (este) | Contexto general, visión, tech stack |
| `ROADMAP.md` | 7 etapas del producto (qué features cada una) |
| `BACKLOG.md` | Tareas concretas con checkboxes (por etapa) |
| `FIRST_5_STEPS.md` | Pasos detallados para MVP (Etapa 0) |
| `WORKFLOW.md` | Git workflow, commits, security |

| Archivo | Propósito |
|---------|-----------|
| `src/models/CLAUDE.md` | Esquemas MongoDB, tipos |
| `src/components/CLAUDE.md` | Design system, componentes |
| `src/lib/CLAUDE.md` | Helpers, utilidades, funciones |
| `src/app/api/CLAUDE.md` | API routes, endpoints |

