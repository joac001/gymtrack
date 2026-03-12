## Sin sprint asignado

### Feature: Volumen por músculo (gráfico polar/radar en estadísticas)

**Objetivo:** mostrar en `/estadisticas` un radar chart con el volumen real acumulado por grupo muscular, distribuyendo el volumen de cada ejercicio entre los músculos que trabaja según su porcentaje de contribución (ej: press banca → Pecho 60%, Tríceps 25%, Hombros 15%).

**Modelo de datos — cambios requeridos:**

- `P2` **Extender schema de ejercicio en `Routine`** — agregar campo opcional:

  ```ts
  musculos?: { nombre: string; porcentaje: number }[]
  ```

  Suma de porcentajes = 100. Nombres estandarizados: `"Pecho"`, `"Espalda"`, `"Hombros"`, `"Bíceps"`, `"Tríceps"`, `"Cuádriceps"`, `"Isquiotibiales"`, `"Glúteos"`, `"Abdominales"`, `"Pantorrillas"`.

- `P2` **Crear modelo `EjercicioMusculos`** — cache global por nombre de ejercicio normalizado:
  ```ts
  EjercicioMusculos {
    nombreNorm: String   // lowercase, sin acentos, trim — índice único
    musculos: [{ nombre: String, porcentaje: Number }]
    creadoEn: Date
  }
  ```
  Permite que la clasificación de Gemini se comparta entre usuarios y no se repita para el mismo ejercicio.

**Clasificación con Gemini — `src/lib/gemini-musculos.ts`:**

- `P2` **Función `clasificarEjercicios(nombres: string[])`** — recibe un batch de nombres de ejercicios no cacheados, los envía a Gemini en un solo prompt, devuelve `Map<nombreNorm, MuscContrib[]>`. Prompt estructurado para devolver JSON estricto. Modelo: `gemini-2.5-flash-lite`.
- El nombre se normaliza antes de buscar/guardar: `toLowerCase().normalize("NFD").replace(/\p{Mn}/gu, "").trim()`.

**API — `src/app/api/ejercicios/musculos/route.ts`:**

- `P2` **`POST`** — recibe `{ nombres: string[] }`, busca en `EjercicioMusculos` cuáles ya están cacheados, llama a Gemini solo por los faltantes, persiste los nuevos, devuelve el mapa completo `{ [nombreNorm]: MuscContrib[] }`.

**Integración en estadísticas — `src/app/(app)/estadisticas/page.tsx`:**

- `P2` **Calcular volumen por músculo** — al procesar los logs:
  1. Recolectar todos los nombres de ejercicio únicos del historial.
  2. Buscar en `EjercicioMusculos` cache cuáles ya están clasificados.
  3. Para los faltantes, llamar a Gemini vía `clasificarEjercicios()` y persistir.
  4. También buscar `musculos[]` en los documentos `Routine` del usuario como override manual (fuente primaria si existe).
  5. Por cada set de cada ejercicio: `volumenSet = reps × peso`. Distribuir: `volumenMusculo += volumenSet × (porcentaje / 100)`.
  6. Pasar `{ musculo: string; volumen: number }[]` al nuevo componente de gráfico.

**Gráfico — `src/components/estadisticas/MusculoRadarChart.tsx`:**

- `P2` **Instalar `@nivo/radar`** y crear el componente radar chart.
- Eje por músculo, valor = volumen acumulado total (en la unidad preferida del usuario).
- Integrar en `StatsPageClient` como nueva sección "Distribución muscular".
- Mostrar solo si hay al menos 3 músculos con volumen > 0.
- Skeleton mientras carga (mismo patrón que otros charts).

**Notas de implementación:**

- La clasificación de Gemini es lazy: solo se dispara cuando el usuario visita `/estadisticas` y hay ejercicios sin clasificar. Las visitas siguientes son instantáneas (todo cacheado en `EjercicioMusculos`).
- Si Gemini falla para un ejercicio, omitirlo silenciosamente (no bloquear la página).
- El campo `musculos[]` en `Routine` puede editarse manualmente desde la UI de rutinas en el futuro (mejora posterior, no parte de este sprint).
