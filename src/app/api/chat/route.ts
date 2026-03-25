import { NextRequest, NextResponse } from "next/server";
import { requirePro } from "@/lib/plan";
import { connectDB } from "@/lib/mongodb";
import Routine from "@/models/Routine";
import WorkoutLog from "@/models/WorkoutLog";
import { chatWithGemini, ChatMessage } from "@/lib/gemini-chat";
import { formatPeso } from "@/lib/unidades";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  const { userId, authorized } = await requirePro();
  if (!authorized) {
    return NextResponse.json(
      { error: "Esta función requiere el plan Pro" },
      { status: 403 },
    );
  }

  const body = await req.json();
  const pregunta = body.pregunta?.trim();
  const historial: ChatMessage[] = body.historial ?? [];

  if (!pregunta || typeof pregunta !== "string") {
    return NextResponse.json(
      { error: "Pregunta requerida" },
      { status: 400 },
    );
  }

  if (pregunta.length > 500) {
    return NextResponse.json(
      { error: "La pregunta no puede superar los 500 caracteres" },
      { status: 400 },
    );
  }

  await connectDB();

  // Obtener unidad de peso del usuario
  const user = await User.findById(userId).select("unidadPeso").lean();
  const unidad = (user as { unidadPeso?: string } | null)?.unidadPeso === "lbs" ? "lbs" : "kg";

  // Rutina activa
  const rutina = await Routine.findOne({ userId, activa: true }).lean();
  let rutinaText = "No tiene rutina activa.";
  if (rutina) {
    rutinaText = `Rutina: ${rutina.nombre}\n`;
    for (const sesion of rutina.sesiones) {
      rutinaText += `\n### ${sesion.nombre} (${sesion.dia})\n`;
      const ejerciciosOrdenados = [...sesion.ejercicios].sort(
        (a, b) => a.orden - b.orden,
      );
      for (const ej of ejerciciosOrdenados) {
        const repsStr = ej.reps
          ? ej.reps.hasta
            ? `${ej.reps.desde}-${ej.reps.hasta} reps`
            : `${ej.reps.desde} reps`
          : ej.duracion ?? "";
        rutinaText += `- ${ej.nombre}: ${ej.series ?? ""}x${repsStr}${ej.notas ? ` (${ej.notas})` : ""}\n`;
      }
    }
  }

  // Últimos 20 logs
  const logs = await WorkoutLog.find({ userId })
    .sort({ fecha: -1 })
    .limit(20)
    .lean();

  let logsText = "Sin entrenamientos registrados.";
  if (logs.length > 0) {
    logsText = logs
      .map((log) => {
        const fecha = new Date(log.fecha).toLocaleDateString("es-AR", {
          day: "numeric",
          month: "short",
        });
        const ejercicios = log.ejercicios
          .map((ej) => {
            const mejorSet = ej.sets.reduce(
              (best, s) => (s.peso > best.peso ? s : best),
              ej.sets[0],
            );
            return `  - ${ej.nombre}: ${ej.sets.length} series, mejor ${formatPeso(mejorSet.peso, unidad)} x ${mejorSet.reps}`;
          })
          .join("\n");
        return `${fecha} — ${log.sesionNombre} (RPE ${log.intensidad}/10)\n${ejercicios}`;
      })
      .join("\n\n");
  }

  // Stats básicas
  const totalLogs = await WorkoutLog.countDocuments({ userId });
  const primerLog = await WorkoutLog.findOne({ userId })
    .sort({ fecha: 1 })
    .select("fecha")
    .lean();

  let statsText = `Total entrenamientos: ${totalLogs}`;
  if (primerLog) {
    const desde = new Date(primerLog.fecha).toLocaleDateString("es-AR", {
      month: "long",
      year: "numeric",
    });
    statsText += `\nEntrenando desde: ${desde}`;
  }

  try {
    const respuesta = await chatWithGemini(
      pregunta,
      { rutina: rutinaText, ultimosLogs: logsText, stats: statsText },
      historial,
    );

    return NextResponse.json({ respuesta });
  } catch (error) {
    console.error("Error en chat IA:", error);
    return NextResponse.json(
      { error: "Error al procesar tu consulta" },
      { status: 500 },
    );
  }
}
