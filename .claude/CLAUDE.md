# GymTrack

Aplicación web multi-usuario para gestionar rutinas de gimnasio. Permite ver y editar la rutina, registrar lo que se hace cada día de entrenamiento y ver estadísticas de progreso.

Para cada ejercicio se incluye un link a búsqueda de imágenes (Google Images) con el nombre del ejercicio, para que el usuario pueda consultar la técnica correcta.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Estilos**: Tailwind CSS
- **Base de datos**: MongoDB Atlas (plan M0 gratuito)
- **Auth**: NextAuth.js con MongoDB Adapter (email + password)
- **Deploy**: Vercel

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
3. **Estadísticas de progreso**:
   - Progreso de peso por ejercicio (gráfico temporal)
   - Racha y consistencia (semanas seguidas, días por mes)
   - Volumen total por sesión (peso × reps × series)
4. **Rutinas editables**: CRUD de sesiones y ejercicios
5. **Links a imágenes**: Cada ejercicio linkea a búsqueda de Google Images

## Design System

### Tema y colores

- **Tema**: Dark
- **Background**: `#0e0e0f`
- **Surface**: `#161617`
- **Border**: `#252527`
- **Text**: `#e8e8e8` / Muted: `#6b6b72`
- **Push (naranja)**: `#f97316` / accent bg: `rgba(249,115,22,0.08)`
- **Pull (azul)**: `#3b82f6` / accent bg: `rgba(59,130,246,0.08)`
- **Legs (verde)**: `#22c55e` / accent bg: `rgba(34,197,94,0.08)`

### Tipografía

- **Display / títulos**: Bebas Neue — usado en logo, títulos de sesión, badges de día
- **Cuerpo**: DM Sans (weights: 300, 400, 500, 600)

## Modelos de datos (MongoDB)

> El detalle completo de cada modelo está en `src/models/CLAUDE.md`.

**Routine** — múltiples por usuario, una `activa` a la vez. Sesiones embebidas con día de semana asignado. Ejercicios con `reps: { desde, hasta? }` (hasta opcional; si no está, es número fijo).

**WorkoutLog** — un documento por entrenamiento. Peso y reps por serie individual. Campos de sesión y nombre de ejercicio copiados (desnormalizados) para mantener el historial aunque la rutina cambie. Intensidad 1-10 al finalizar.

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

## Estructura de componentes

Todos los componentes reutilizables de UI viven en `components/ui/` (Button, Input, Modal, Card, Badge, etc.). Las páginas los importan desde ahí y nunca duplican implementaciones. Cada feature tiene sus propios componentes específicos en `components/[feature]/`.

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
- Variables de entorno: `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`

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
