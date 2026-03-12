# Modelos de datos — GymTrack

Este archivo es la fuente de verdad del modelado de datos de la aplicación.
Antes de modificar cualquier schema, actualizá este documento.

---

## Decisiones de diseño generales

- **userId** se almacena como `String` en todos los modelos propios. Es el string del ObjectId que NextAuth guarda en el JWT (`session.user.id`). No usamos `ObjectId` con `ref` porque el modelo `User` lo gestiona el adapter de NextAuth, no Mongoose.
- **Estructura embebida**: sesiones y ejercicios viven dentro del documento `Routine`, no en colecciones separadas. Se consultan siempre juntos y nunca de forma independiente.
- **Desnormalización en logs**: al registrar un entrenamiento se copian `sesionNombre`, `sesionTipo` y `ejercicios[].nombre`. Si el usuario edita la rutina después, el historial refleja lo que realmente hizo.

---

## Routine

Representa una rutina de entrenamiento. Un usuario puede tener varias, pero solo una `activa` a la vez.

```
Routine {
  _id: ObjectId
  userId: String                    ← session.user.id del usuario dueño
  nombre: String                    ← ej: "PPL - Volumen"
  activa: Boolean                   ← solo una true por usuario; el resto false

  sesiones: [
    {
      _id: ObjectId (auto)
      nombre: String                ← ej: "Push A", "Upper", "Cardio" (texto libre)
      color: String                 ← hex, ej: "#f97316" (asignado de paleta, editable)
      dia: enum                     ← 'lunes' | 'martes' | 'miercoles' | 'jueves'
                                       'viernes' | 'sabado' | 'domingo'
      orden: Number                 ← para ordenar sesiones del mismo día entre sí

      ejercicios: [
        {
          _id: ObjectId (auto)
          nombre: String            ← ej: "Press Banca"
          series: Number            ← ej: 4
          reps: {
            desde: Number           ← requerido; ej: 10 (fijo) u 8 (inicio de rango)
            hasta?: Number          ← opcional; si existe, es el tope del rango
          }
          // Ejemplos de display:
          // { desde: 10 }          → "10 reps"
          // { desde: 8, hasta: 10} → "8-10 reps"

          notas?: String            ← ej: "Bajar lento, 3 seg excéntrica"
          orden: Number
        }
      ]
    }
  ]

  creadoEn: Date
  actualizadoEn: Date
}
```

**Índices:**
- `{ userId: 1 }` — listar rutinas del usuario
- `{ userId: 1, activa: 1 }` — obtener rutina activa

**Regla de negocio:** al activar una rutina, todas las demás del mismo usuario deben quedar `activa: false`. Esto se maneja en la API, no en el schema.

---

## WorkoutLog

Representa un entrenamiento realizado. Cada vez que el usuario completa una sesión, se crea un documento.

```
WorkoutLog {
  _id: ObjectId
  userId: String
  rutinaId: ObjectId                ← referencia a la Routine usada
  sesionId: ObjectId                ← _id de la sesión dentro de la rutina
  sesionNombre: String              ← copia del nombre al momento del log
  sesionColor: String               ← copia del color hex (para colores en historial)
  fecha: Date                       ← fecha del entrenamiento

  ejercicios: [
    {
      ejercicioId?: ObjectId        ← undefined/null si es ejercicio extra
      nombre: String                ← copia del nombre al momento del log
      esExtra: Boolean              ← true si el usuario lo agregó durante el entrenamiento

      sets: [
        {
          reps: Number              ← reps realizadas en esa serie
          peso: Number              ← kg usados en esa serie
        }
      ]
    }
  ]

  intensidad: Number                ← 1 a 10 (esfuerzo percibido al finalizar)
  notas?: String                    ← comentario general opcional
  creadoEn: Date
}
```

**Índices:**
- `{ userId: 1, fecha: -1 }` — historial ordenado por fecha
- `{ userId: 1, rutinaId: 1, fecha: -1 }` — stats por rutina
- `{ userId: 1, "ejercicios.ejercicioId": 1, fecha: -1 }` — progreso por ejercicio

**Cálculo de volumen** (para estadísticas):
```
volumenEjercicio = sum(sets.map(s => s.reps * s.peso))
volumenSesion    = sum(ejercicios.map(e => volumenEjercicio(e)))
```
