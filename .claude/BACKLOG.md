# Backlog — GymTrack

> Las tareas completas se **eliminan**, no se marcan. Si está acá, está pendiente.
> Prioridades: `P1` crítico/bloqueante · `P2` normal · `P3` mejora/nice-to-have

---

## En progreso

<!-- ninguna -->

---

## Sin sprint asignado

- `P2` **Rediseño visual de cards en historial** — La pantalla `/historial` tiene demasiados colores que compiten entre sí y dificultan leer la info importante. Reducir el ruido visual: los colores de acento (push/pull/legs) solo deben usarse en el indicador de tipo de sesión, no en todo el card. Reemplazar el indicador `x/10` de intensidad por el mismo sistema de emojis usado en el formulario de registro (emoji grande como indicador principal, número pequeño debajo).

- `P2` **Modularización de páginas** — Varias páginas son monolíticas y reimplementan lógica/UI inline que debería vivir en componentes. Candidatos claros: `historial/[id]/page.tsx` (card de ejercicio con sets), `historial/page.tsx` (card de log), `rutinas/[id]/page.tsx` si existe (card de sesión). Extraer a componentes en `components/historial/`, `components/rutinas/`, etc. Las páginas deben quedar como orquestadoras de datos, no como definidoras de UI.
