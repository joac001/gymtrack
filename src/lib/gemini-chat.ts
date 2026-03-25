import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

const SYSTEM_PROMPT = `Sos un coach de fitness experto. El usuario te hace preguntas sobre su entrenamiento y vos analizás sus datos REALES (rutina actual, historial de entrenamientos, estadísticas) para dar respuestas personalizadas.

## Tu personalidad
- Hablás en español rioplatense (tuteo con "vos")
- Sos directo y práctico, no das vueltas
- Usás datos concretos del usuario para fundamentar tus respuestas
- Si no tenés suficientes datos, lo decís honestamente
- Sugerís acciones específicas (cambiar rep range, deload, aumentar frecuencia, etc.)

## Formato de respuesta
- Respuestas cortas y concisas (máximo 200 palabras)
- Usá bullets para listar recomendaciones
- Mencioná ejercicios y números específicos del usuario
- No repitas información que el usuario ya sabe

## Datos del usuario
Los datos se proporcionan en el mensaje del sistema. Analizalos para responder.
Si el usuario pregunta algo que no podés responder con los datos disponibles, decilo.`;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface UserContext {
  rutina: string;
  ultimosLogs: string;
  stats: string;
}

function buildContextMessage(ctx: UserContext): string {
  return `## Rutina actual del usuario
${ctx.rutina}

## Últimos entrenamientos
${ctx.ultimosLogs}

## Estadísticas
${ctx.stats}`;
}

export async function chatWithGemini(
  pregunta: string,
  contexto: UserContext,
  historial: ChatMessage[] = [],
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    systemInstruction: SYSTEM_PROMPT,
  });

  const contextMessage = buildContextMessage(contexto);

  // Construir historial para Gemini
  const contents = [
    // Contexto como primer mensaje del sistema
    { role: "user" as const, parts: [{ text: `[CONTEXTO DEL USUARIO - NO MOSTRAR]\n${contextMessage}` }] },
    { role: "model" as const, parts: [{ text: "Entendido, tengo el contexto del usuario. ¿En qué puedo ayudarte?" }] },
    // Historial previo
    ...historial.map((msg) => ({
      role: (msg.role === "user" ? "user" : "model") as "user" | "model",
      parts: [{ text: msg.content }],
    })),
    // Pregunta actual
    { role: "user" as const, parts: [{ text: pregunta }] },
  ];

  const result = await model.generateContent({ contents });
  const response = result.response.text();

  return response;
}
