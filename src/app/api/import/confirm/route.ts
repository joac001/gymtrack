import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Routine from "@/models/Routine";
import WorkoutLog from "@/models/WorkoutLog";
import type { RutinaImport, LogImport, AjusteMenor } from "@/lib/gemini-import";

interface ConfirmPayload {
  rutinas: RutinaImport[];
  logs: LogImport[];
  ajustes: AjusteMenor[];
  fechaBase?: string;           // "YYYY-MM-DD" — si los logs no tienen fecha
  intensidadDefault?: number;   // si logs no tienen intensidad
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Gate: import solo para Pro
  const plan = session.user.plan === "pro" ? "pro" : "free";
  if (plan !== "pro") {
    return NextResponse.json(
      { error: "La importación desde Excel requiere el plan Pro" },
      { status: 403 },
    );
  }

  const userId = session.user.id;
  const body: ConfirmPayload = await req.json();

  const { rutinas, logs, fechaBase, intensidadDefault = 7 } = body;

  await connectDB();

  // ── Crear rutinas ──────────────────────────────────────────────────────────

  // Mapa: nombre de sesión → { rutinaId, sesionId }
  const sesionMap = new Map<string, { rutinaId: string; sesionId: string; color: string }>();

  const rutinasDocs = [];

  for (const rutina of rutinas) {
    const nuevaRutina = await Routine.create({
      userId,
      nombre: rutina.nombre,
      activa: false,
      sesiones: rutina.sesiones.map((s, idx) => ({
        nombre: s.nombre,
        color: s.color,
        dia: s.dia ?? "lunes",
        orden: idx,
        ejercicios: s.ejercicios.map((e, eIdx) => ({
          nombre: e.nombre,
          tipoMedida: e.tipoMedida,
          series: e.series,
          reps: e.reps,
          duracion: e.duracion,
          notas: e.notas,
          orden: eIdx,
        })),
      })),
    });

    rutinasDocs.push(nuevaRutina);

    // Construir mapa sesionNombre → IDs
    for (const sesion of nuevaRutina.sesiones) {
      sesionMap.set(sesion.nombre.toLowerCase().trim(), {
        rutinaId: nuevaRutina._id.toString(),
        sesionId: sesion._id.toString(),
        color: sesion.color,
      });
    }
  }

  // ── Calcular fechas para logs sin fecha ───────────────────────────────────

  function calcularFecha(log: LogImport): Date {
    if (log.fecha) return new Date(log.fecha);

    // Usar fechaIndice para calcular desde la fecha base
    if (fechaBase && log.fechaIndice != null) {
      const base = new Date(fechaBase);
      // Asumir ~2-3 días entre sesiones: usamos 3 días por sesión como aproximación
      const diasOffset = (log.fechaIndice - 1) * 3;
      base.setDate(base.getDate() + diasOffset);
      return base;
    }

    // Fallback: calcular hacia atrás desde hoy
    const hoy = new Date();
    const diasOffset = ((log.fechaIndice ?? 1) - 1) * 3;
    hoy.setDate(hoy.getDate() - diasOffset);
    return hoy;
  }

  // ── Crear logs ─────────────────────────────────────────────────────────────

  const logsCreados = [];

  for (const log of logs) {
    const nombreSesionKey = log.sesionNombre.toLowerCase().trim();
    const sesionInfo = sesionMap.get(nombreSesionKey)
      ?? [...sesionMap.entries()].find(([k]) => k.includes(nombreSesionKey.split(" ")[0]))?.[1];

    if (!sesionInfo) continue; // Si no se puede mapear la sesión, omitir el log

    const rutinaDoc = rutinasDocs.find((r) => r._id.toString() === sesionInfo.rutinaId);
    const sesionDoc = rutinaDoc?.sesiones.find(
      (s: { _id: { toString(): string }; nombre: string }) =>
        s._id.toString() === sesionInfo.sesionId,
    );

    const ejerciciosConIds = log.ejercicios
      .filter((e) => e.sets.length > 0)
      .map((e) => {
        const ejercicioEnRutina = sesionDoc?.ejercicios?.find(
          (ej: { nombre: string }) =>
            ej.nombre.toLowerCase().includes(e.nombre.toLowerCase().split(" ")[0]),
        );
        return {
          ejercicioId: ejercicioEnRutina?._id,
          nombre: e.nombre,
          esExtra: !ejercicioEnRutina,
          sets: e.sets.map((s) => ({ reps: Number(s.reps) || 0, peso: Number(s.peso) || 0 })),
        };
      });

    if (ejerciciosConIds.length === 0) continue;

    const nuevoLog = await WorkoutLog.create({
      userId,
      rutinaId: sesionInfo.rutinaId,
      sesionId: sesionInfo.sesionId,
      sesionNombre: log.sesionNombre,
      sesionColor: sesionInfo.color,
      fecha: calcularFecha(log),
      ejercicios: ejerciciosConIds,
      intensidad: log.intensidad ?? intensidadDefault,
      notas: log.notas,
    });

    logsCreados.push(nuevoLog._id.toString());
  }

  return NextResponse.json({
    ok: true,
    rutinasCreadas: rutinasDocs.length,
    logsCreados: logsCreados.length,
    rutinaIds: rutinasDocs.map((r) => r._id.toString()),
  });
}
