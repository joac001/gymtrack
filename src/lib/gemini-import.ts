import { GoogleGenerativeAI } from "@google/generative-ai";

// ── Tipos compartidos ────────────────────────────────────────────────────────

export interface PreguntaImport {
  id: string;
  pregunta: string;
  tipo: "date" | "boolean" | "select" | "number" | "text";
  opciones?: string[];
  valorSugerido?: string | number | boolean | null;
}

export interface RespuestaRonda {
  preguntaId: string;
  respuesta: string;
}

export interface EjercicioImport {
  nombre: string;
  tipoMedida: "reps" | "tiempo";
  series?: number;
  reps?: { desde: number; hasta?: number };
  duracion?: string;
  notas?: string;
}

export interface SesionImport {
  nombre: string;
  dia: "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo" | null;
  color: string;
  ejercicios: EjercicioImport[];
}

export interface RutinaImport {
  nombre: string;
  sesiones: SesionImport[];
}

export interface SetImport {
  reps: number;
  peso: number;
}

export interface EjercicioLogImport {
  nombre: string;
  sets: SetImport[];
}

export interface LogImport {
  sesionNombre: string;
  fecha: string | null;       // ISO date si existe
  fechaIndice?: number;       // índice ordinal si no hay fecha
  intensidad: number | null;
  notas?: string;
  ejercicios: EjercicioLogImport[];
}

export interface AjusteMenor {
  id: string;
  descripcion: string;
  tipo: "number" | "boolean" | "date";
  valorDefault: number | boolean | string;
}

// ── Respuesta de Gemini ──────────────────────────────────────────────────────

export type GeminiImportResponse =
  | { status: "needs_more_info"; preguntas: PreguntaImport[] }
  | { status: "ready"; rutinas: RutinaImport[]; logs: LogImport[]; ajustes: AjusteMenor[] };

// ── Historial de conversación ─────────────────────────────────────────────────

export interface RondaHistorial {
  preguntas: PreguntaImport[];
  respuestas: RespuestaRonda[];
}

// ── Prompt del sistema ────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Sos un asistente experto en interpretar planillas Excel de gimnasio.
Tu tarea es analizar el contenido del Excel y mapearlo al schema de la app GymTrack.

## Schema de GymTrack

### Routine
{
  nombre: string,
  sesiones: [{
    nombre: string,              // ej: "Push", "Pull", "Legs A"
    dia: "lunes"|"martes"|"miercoles"|"jueves"|"viernes"|"sabado"|"domingo"|null,
    color: string,               // hex, asigná uno razonable según el tipo de sesión
    ejercicios: [{
      nombre: string,
      tipoMedida: "reps"|"tiempo",
      series?: number,
      reps?: { desde: number, hasta?: number },  // ej: {desde:8,hasta:10} o {desde:10}
      duracion?: string,
      notas?: string
    }]
  }]
}

### WorkoutLog
{
  sesionNombre: string,
  fecha: string|null,         // ISO date "YYYY-MM-DD" o null si no hay fecha
  fechaIndice?: number,       // 1,2,3... si no hay fecha (orden cronológico)
  intensidad: number|null,    // 1-10, null si no está registrada
  notas?: string,
  ejercicios: [{
    nombre: string,
    sets: [{ reps: number, peso: number }]
  }]
}

## Colores sugeridos por tipo de sesión
- Push / Empuje / Pecho: #f97316
- Pull / Jale / Espalda / Tirón: #3b82f6
- Legs / Piernas: #22c55e
- Full body / Cuerpo completo: #8b5cf6
- Upper / Superior: #f59e0b
- Lower / Inferior: #10b981
- Otros: #6b7280

## Reglas de extracción
1. Normalizá nombres de ejercicios: si "Press banca", "Bench press", "P.Banca" aparecen juntos, usá el nombre más descriptivo en español.
2. Si hay pesos en lbs (magnitud >100 para ejercicios comunes), asumí lbs.
3. Si hay decimales con coma ("82,5"), conver tilos a punto.
4. "BW", "propio", "bodyweight" → peso = 0.
5. Fórmulas de sets: "4x10" = 4 series de 10 reps; "3-4x8-12" = 3-4 series de 8-12 reps.
6. Si no hay fechas, usar fechaIndice (1, 2, 3...) en orden cronológico.
7. Si los datos de historial no hacen referencia a una rutina, crear una rutina "Rutina importada" con las sesiones detectadas.
8. Descartá cardio (running, caminadora, cycling, etc.) y medidas corporales.
9. Descartá filas claramente de prueba o sin sentido.
10. Si detectás datos de múltiples personas, importá solo los primeros que aparezcan y mencionalo en las preguntas.

## Formato de respuesta (JSON puro, sin markdown)

### Si necesitás más información:
{
  "status": "needs_more_info",
  "preguntas": [
    {
      "id": "sin_fechas",
      "pregunta": "Los registros no tienen fechas. ¿Cuándo fue el primer entrenamiento?",
      "tipo": "date",
      "opciones": null,
      "valorSugerido": null
    }
  ]
}

### Si ya podés producir el resultado final:
{
  "status": "ready",
  "rutinas": [...],
  "logs": [...],
  "ajustes": [
    {
      "id": "intensidad_default",
      "descripcion": "Ningún log tiene intensidad registrada. Valor por defecto:",
      "tipo": "number",
      "valorDefault": 7
    }
  ]
}

IMPORTANTE: Respondé SOLO con el JSON. Sin texto adicional, sin bloques de código.`;

// ── Función principal ─────────────────────────────────────────────────────────

export async function callGeminiImport(
  excelText: string,
  historial: RondaHistorial[],
): Promise<GeminiImportResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY no configurada");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  // Construir el prompt con el excel + historial de respuestas anteriores
  let userMessage = `Analizá este archivo Excel:\n\n${excelText}`;

  if (historial.length > 0) {
    userMessage += "\n\n## Respuestas del usuario a preguntas anteriores:\n";
    for (const ronda of historial) {
      for (const resp of ronda.respuestas) {
        const pregunta = ronda.preguntas.find((p) => p.id === resp.preguntaId);
        if (pregunta) {
          userMessage += `- ${pregunta.pregunta}\n  Respuesta: ${resp.respuesta}\n`;
        }
      }
    }
  }

  const result = await model.generateContent({
    systemInstruction: SYSTEM_PROMPT,
    contents: [{ role: "user", parts: [{ text: userMessage }] }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1, // baja temperatura para respuestas estructuradas y consistentes
    },
  });

  const text = result.response.text().trim();

  try {
    const parsed = JSON.parse(text) as GeminiImportResponse;
    return parsed;
  } catch {
    throw new Error(`Gemini devolvió JSON inválido: ${text.slice(0, 200)}`);
  }
}
