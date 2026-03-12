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
1. **Import inteligente de Excel/CSV** — el usuario sube cualquier archivo en su formato propio; la IA lo interpreta, propone el mapeo y el usuario confirma antes de importar
2. **Chat con tus estadísticas** — preguntas en lenguaje natural: "¿En qué ejercicio estoy estancado?", "¿Estoy descansando bien las piernas?", "¿Cuándo fue mi mejor semana de volumen?"
3. **Análisis de mesetas** — detección automática de estancamiento por ejercicio, con recomendaciones concretas (deload, cambio de rep range, variante del ejercicio)
4. **Optimización de rutina** — revisión de la rutina actual con sugerencias basadas en el progreso real: balance muscular, frecuencia, volumen semanal
5. **Generación de rutina desde cero** — el usuario describe objetivo, días disponibles, equipamiento y nivel; la IA genera una rutina estructurada lista para usar

---

## Features Aprobadas — Sin Sprint Asignado

- **Notas de recuperación**: al registrar un entrenamiento, el usuario puede indicar cómo llegó (sueño, dolor muscular previo) para correlacionar con el rendimiento
- **PR automático**: el sistema detecta cuando el usuario supera su mejor marca histórica en un ejercicio y lo celebra visualmente
- **Calendario de entrenamientos**: visualización mensual de qué días se entrenó y qué sesión se hizo

---

## IA — Roadmap Extendido

- **Coach IA conversacional**: asistente con memoria del historial completo del usuario, para conversaciones de seguimiento
- **Predicción de 1RM**: estima el máximo teórico por ejercicio a partir de los datos de entrenamiento
- **Detección de sobreentrenamiento**: alerta proactiva si el rendimiento cae sistemáticamente
- **Plan de periodización**: generar macrociclos (bloque de volumen → fuerza → pico) basados en objetivos y fechas

---

## En Evaluación

- **Fotos de progreso**: subir fotos con fecha, comparación lado a lado — requiere storage de imágenes (Cloudinary o S3), añade complejidad y costo

---

## Descartado

- Body metrics tracking (peso corporal, medidas físicas)
- Features sociales / comunidad (compartir rutinas, comparar con amigos, challenges)
