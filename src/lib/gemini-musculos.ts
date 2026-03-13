import { GoogleGenerativeAI } from "@google/generative-ai";
import type { IMuscContrib } from "@/models/EjercicioMusculos";

const MUSCULOS_VALIDOS = [
  "Pecho",
  "Espalda",
  "Hombros",
  "Bíceps",
  "Tríceps",
  "Cuádriceps",
  "Isquiotibiales",
  "Glúteos",
  "Abdominales",
  "Pantorrillas",
];

export function normalizarNombre(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "")
    .replace(/\s+/g, "")
    .trim();
}

const SYSTEM_PROMPT = `Sos un experto en biomecánica y entrenamiento de fuerza.
Tu tarea es clasificar ejercicios según los grupos musculares que trabajan y el porcentaje de contribución de cada uno.

Reglas:
1. Solo podés usar estos nombres de músculos exactamente como aparecen: ${MUSCULOS_VALIDOS.join(", ")}
2. Los porcentajes de cada ejercicio deben sumar exactamente 100
3. Solo incluir músculos con contribución ≥ 5%
4. Devolver ÚNICAMENTE un JSON válido, sin texto adicional, sin markdown, sin explicaciones
5. Si no reconocés un ejercicio, asignalo al músculo más probable con 100%

Formato de respuesta:
{
  "nombreNorm1": [{ "nombre": "Músculo", "porcentaje": 60 }, ...],
  "nombreNorm2": [...]
}

donde nombreNorm es el nombre del ejercicio en minúsculas, sin acentos y sin espacios extra.`;

export async function clasificarEjercicios(
  nombres: string[]
): Promise<Map<string, IMuscContrib[]>> {
  if (nombres.length === 0) return new Map();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: { temperature: 0.1 },
    systemInstruction: SYSTEM_PROMPT,
  });

  const nombresNorm = nombres.map((n) => normalizarNombre(n));
  const prompt = `Clasificá estos ejercicios:\n${nombresNorm.join("\n")}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Limpiar posible markdown
  const json = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
  const parsed = JSON.parse(json) as Record<string, IMuscContrib[]>;

  const mapa = new Map<string, IMuscContrib[]>();
  for (const [key, musculos] of Object.entries(parsed)) {
    // Validar que los músculos sean válidos
    const validos = musculos.filter((m) => MUSCULOS_VALIDOS.includes(m.nombre));
    if (validos.length > 0) {
      mapa.set(key, validos);
    }
  }
  return mapa;
}
