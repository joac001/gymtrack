# Roadmap — GymTrack

> Ideas de producto aprobadas para el futuro. No tienen sprint asignado.
> Para tareas activas, ver `BACKLOG.md`.

---

## Visión de Producto

**Propuesta de valor:** El único tracker de gym que aprende de tu historial y te dice qué cambiar, no solo qué hiciste.

**Diferencial frente a Strong / Hevy / FitBod:** esos apps registran. GymTrack analiza y recomienda con los datos reales del usuario.

---

## Modelo de Negocio — Freemium

### Tier Gratuito — Free

- 1 rutina activa
- Log de entrenamientos (historial últimos 3 meses)
- Estadísticas básicas: progreso de peso por ejercicio, racha de consistencia
- Import de Excel/CSV con template predefinido de GymTrack (formato fijo)
- Sin exportación de datos

### Tier Pago — Pro

**Precio:** $7 USD/mes · $55 USD/año (ahorro ~35%)

**Features sin IA:**

- Rutinas ilimitadas
- Historial ilimitado
- Export de datos (PDF, Excel, CSV)
- Gráficos avanzados: comparar períodos, volumen por grupo muscular, PRs históricos
- Plantillas de rutinas compartibles entre usuarios

**Features con IA:**

1. **Chat con tus estadísticas** — preguntas en lenguaje natural: "¿En qué ejercicio estoy estancado?", "¿Estoy descansando bien las piernas?", "¿Cuándo fue mi mejor semana de volumen?"
2. **Análisis de mesetas** — detección automática de estancamiento por ejercicio, con recomendaciones concretas (deload, cambio de rep range, variante del ejercicio)
3. **Optimización de rutina** — revisión de la rutina actual con sugerencias basadas en el progreso real: balance muscular, frecuencia, volumen semanal
4. **Generación de rutina desde cero** — el usuario describe objetivo, días disponibles, equipamiento y nivel; la IA genera una rutina estructurada lista para usar

### Tier Pago — Trainer

**Precio:** $20 USD/mes · $160 USD/año (~33% ahorro)

**Para quién:** Entrenadores personales que gestionan múltiples alumnos. Incluye todo lo del tier Pro aplicado al propio trainer y a cada uno de sus alumnos.

**Límite inicial:** hasta 20 alumnos activos (expansión a definir).

**Panel de alumnos:**

- Dashboard con lista de todos los alumnos: última sesión registrada, racha actual, adherencia semanal
- Invitación por email o link único generado por el trainer
- El alumno recibe una notificación y acepta o rechaza la conexión
- Cualquier tier de alumno (Free o Pro) puede vincularse a un trainer

**Gestión de rutinas de alumnos:**

- El trainer puede crear y editar rutinas *para* un alumno (mismo CRUD que el alumno tendría en Pro)
- Clonar una rutina propia para asignarla a otro alumno, con ajustes opcionales
- Biblioteca privada del trainer: plantillas reutilizables entre alumnos

**Estadísticas de alumnos:**

- Ver todas las estadísticas premium de cualquier alumno: progreso de peso, volumen por sesión, PRs históricos, balance muscular
- Resumen de actividad reciente de todos los alumnos desde el panel principal

**IA aplicada a alumnos:**

- Chat IA contextuado a un alumno específico: "¿Está progresando Juan en sentadilla?", "¿Qué ejercicio tiene más plateau este mes?"
- Análisis de mesetas y recomendaciones por alumno
- Sugerencias de ajuste de rutina basadas en los logs reales del alumno

**Notificaciones (futuro):**

- Alerta cuando un alumno supera un PR
- Alerta cuando un alumno lleva N días sin entrenar

**Privacidad y control:**

- El alumno da consentimiento explícito al aceptar la invitación del trainer
- El alumno puede desvincularse en cualquier momento desde su configuración
- El trainer tiene acceso de lectura sobre el historial del alumno y acceso de escritura sobre sus rutinas

---

## Features Aprobadas — Sin Sprint Asignado

- **Notas de recuperación**: al registrar un entrenamiento, el usuario puede indicar cómo llegó (sueño, dolor muscular previo) para correlacionar con el rendimiento
- **PR automático**: el sistema detecta cuando el usuario supera su mejor marca histórica en un ejercicio y lo celebra visualmente
- **Calendario de entrenamientos**: visualización mensual de qué días se entrenó y qué sesión se hizo

---

## IA — Roadmap Extendido

- **Coach IA conversacional**: asistente con memoria del historial completo del usuario, para conversaciones de seguimiento
- **Detección de sobreentrenamiento**: alerta proactiva si el rendimiento cae sistemáticamente
- **Plan de periodización**: generar macrociclos (bloque de volumen → fuerza → pico) basados en objetivos y fechas
