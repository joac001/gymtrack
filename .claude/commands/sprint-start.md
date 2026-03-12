Lee el archivo `.claude/BACKLOG.md` y determiná el sprint a trabajar:
- Si `## En progreso` tiene una tarea activa, ese es el sprint en curso. Retomá desde esa tarea.
- Si `## En progreso` está vacío, tomá el primer sprint que tenga tareas pendientes.

Antes de arrancar, mostrá:
- Nombre y objetivo del sprint
- Lista de tareas ordenadas: P1 → P2 → P3

Luego implementá el sprint completo, tarea por tarea, en ese orden:

Para cada tarea:
1. Editá `.claude/BACKLOG.md`: mové la tarea a `## En progreso`, anotando el sprint entre paréntesis al final (ej: `_(Sprint 1)_`)
2. Implementá la funcionalidad completamente
3. Editá `.claude/BACKLOG.md`: eliminá la tarea de `## En progreso` y también de la lista del sprint
4. Continuá con la siguiente tarea

Reglas:
- Solo una tarea en "En progreso" a la vez
- Si una tarea está bloqueada o tiene un error que no podés resolver, reportalo y esperá instrucciones del usuario antes de continuar
- Al terminar todas las tareas del sprint, indicar que el sprint está completo
