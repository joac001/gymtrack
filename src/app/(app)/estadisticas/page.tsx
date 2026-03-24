import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import WorkoutLog from "@/models/WorkoutLog";
import User from "@/models/User";
import EjercicioMusculos from "@/models/EjercicioMusculos";
import Routine from "@/models/Routine";
import StatsPageClient from "@/components/estadisticas/StatsPageClient";
import type { EjercicioData } from "@/components/estadisticas/PesoChart";
import type { SesionFrecuencia } from "@/components/estadisticas/FrecuenciaChart";
import type { BalanceSesion, PlateauData, MusculoData } from "@/components/estadisticas/StatsPageClient";
import { convertirPeso } from "@/lib/unidades";
import { clasificarEjercicios, normalizarNombre } from "@/lib/gemini-musculos";

// ── Helpers ─────────────────────────────────────────────────────────────────

function getISOWeek(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum =
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7,
    );
  return `${d.getFullYear()}-${String(weekNum).padStart(2, "0")}`;
}

function isoWeekLabel(semana: string): string {
  // "2025-03" → "S03 '25"
  const [year, week] = semana.split("-");
  return `S${week} '${year.slice(2)}`;
}

function formatFechaCorta(date: Date): string {
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

function calcRacha(semanasUnicas: string[]): number {
  if (semanasUnicas.length === 0) return 0;
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }),
  );
  const semanaActual = getISOWeek(now);
  const semanaAnterior = getISOWeek(new Date(now.getTime() - 7 * 86400000));
  const sorted = [...semanasUnicas].sort((a, b) => b.localeCompare(a));
  const masReciente = sorted[0];
  if (masReciente !== semanaActual && masReciente !== semanaAnterior) return 0;

  let racha = 0;
  let expectedYear = parseInt(masReciente.split("-")[0]);
  let expectedWeek = parseInt(masReciente.split("-")[1]);

  for (const s of sorted) {
    const [y, w] = s.split("-").map(Number);
    if (y === expectedYear && w === expectedWeek) {
      racha++;
      expectedWeek--;
      if (expectedWeek === 0) {
        expectedYear--;
        expectedWeek = 52;
      }
    } else {
      break;
    }
  }
  return racha;
}

function calcRachaMaxima(semanasUnicas: string[]): number {
  if (semanasUnicas.length === 0) return 0;
  const sorted = [...semanasUnicas].sort((a, b) => a.localeCompare(b));
  let maxRacha = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const [y1, w1] = sorted[i - 1].split("-").map(Number);
    const [y2, w2] = sorted[i].split("-").map(Number);
    const esConsecutiva = (y2 === y1 && w2 === w1 + 1) || (y2 === y1 + 1 && w1 >= 52 && w2 === 1);
    if (esConsecutiva) {
      current++;
      maxRacha = Math.max(maxRacha, current);
    } else {
      current = 1;
    }
  }
  return maxRacha;
}

// ── Page ────────────────────────────────────────────────────────────────────

export default async function EstadisticasPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await connectDB();

  const userId = session.user.id;
  const [logs, userDoc] = await Promise.all([
    WorkoutLog.find({ userId }).sort({ fecha: 1 }).lean(),
    User.findById(userId).lean(),
  ]);
  const unidadPeso = ((userDoc as { unidadPeso?: string } | null)?.unidadPeso ?? "kg") as "kg" | "lbs";

  if (logs.length === 0) {
    return (
      <main className="flex flex-col gap-6 p-4">
        <h1
          className="text-[2rem] m-0 tracking-wider"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--text)" }}
        >
          Estadísticas
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Todavía no tenés entrenamientos registrados. Empezá a entrenar para ver tus estadísticas.
        </p>
      </main>
    );
  }

  // ── Racha ────────────────────────────────────────────────────────────────
  const todasLasSemanas = logs.map((l) => getISOWeek(new Date(l.fecha)));
  const semanasUnicas = [...new Set(todasLasSemanas)];
  const rachaActual = calcRacha(semanasUnicas);
  const rachaMaxima = calcRachaMaxima(semanasUnicas);
  const totalEntrenamientos = logs.length;
  const totalSemanas = semanasUnicas.length;

  // ── Consistencia (heatmap) ────────────────────────────────────────────────
  const diasSet = new Set(
    logs.map((l) => {
      const d = new Date(l.fecha);
      return d.toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }); // "YYYY-MM-DD"
    }),
  );
  const consistencia = [...diasSet].map((day) => ({ day, value: 1 }));

  const hoy = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }),
  );
  const primerLog = new Date(logs[0].fecha);
  const consistenciaDesde = primerLog.toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
  const consistenciaHasta = hoy.toLocaleDateString("en-CA");

  // ── Volumen semanal (últimas 12 semanas) ──────────────────────────────────
  const volumenPorSemana = new Map<string, number>();
  for (const log of logs) {
    const semana = getISOWeek(new Date(log.fecha));
    let vol = 0;
    for (const ej of log.ejercicios) {
      for (const set of ej.sets) {
        vol += (set.reps ?? 0) * (set.peso ?? 0);
      }
    }
    volumenPorSemana.set(semana, (volumenPorSemana.get(semana) ?? 0) + vol);
  }
  const todasSemanas = [...volumenPorSemana.keys()].sort();
  const ultimas5 = todasSemanas.slice(-5);
  const volumenSemanal = ultimas5.map((s, i) => ({
    semana: `S${i + 1}`,
    semanaLabel: isoWeekLabel(s),
    volumen: convertirPeso(volumenPorSemana.get(s) ?? 0, unidadPeso),
  }));

  // ── Progreso de peso por ejercicio ────────────────────────────────────────
  // Agrupar peso máximo por (ejercicioId, fecha)
  const pesoMap = new Map<string, { nombre: string; color: string; puntos: Map<string, number> }>();

  for (const log of logs) {
    const fecha = formatFechaCorta(new Date(log.fecha));
    for (const ej of log.ejercicios) {
      if (!ej.ejercicioId) continue;
      const id = String(ej.ejercicioId);
      const maxPeso = Math.max(...ej.sets.map((s) => s.peso ?? 0));
      if (maxPeso <= 0) continue;

      if (!pesoMap.has(id)) {
        pesoMap.set(id, {
          nombre: ej.nombre,
          color: log.sesionColor ?? "#f4634a",
          puntos: new Map(),
        });
      }
      const entry = pesoMap.get(id)!;
      entry.puntos.set(fecha, Math.max(entry.puntos.get(fecha) ?? 0, maxPeso));
    }
  }

  // Tomar ejercicios con ≥ 3 registros, top 6 por cantidad de datos
  const ejercicios: EjercicioData[] = [...pesoMap.entries()]
    .filter(([, v]) => v.puntos.size >= 3)
    .sort((a, b) => b[1].puntos.size - a[1].puntos.size)
    .slice(0, 6)
    .map(([id, v]) => ({
      id,
      nombre: v.nombre,
      color: v.color,
      datos: [...v.puntos.entries()].map(([x, y]) => ({ x, y: convertirPeso(y, unidadPeso) })),
    }));

  // ── Intensidad percibida (últimas 20 sesiones con intensidad) ─────────────
  const logsConIntensidad = logs.filter((l) => l.intensidad != null && l.intensidad > 0);
  const intensidad = logsConIntensidad.slice(-20).map((l) => ({
    x: formatFechaCorta(new Date(l.fecha)),
    y: l.intensidad as number,
  }));

  // ── Frecuencia por sesión ────────────────────────────────────────────────
  const frecuenciaMap = new Map<string, { color: string; cantidad: number }>();
  for (const log of logs) {
    const nombre = log.sesionNombre ?? "Sin nombre";
    const entry = frecuenciaMap.get(nombre);
    if (entry) {
      entry.cantidad++;
    } else {
      frecuenciaMap.set(nombre, { color: log.sesionColor ?? "#6b6b72", cantidad: 1 });
    }
  }
  const frecuencia: SesionFrecuencia[] = [...frecuenciaMap.entries()].map(
    ([sesion, { color, cantidad }]) => ({ sesion, color, cantidad }),
  );

  // ── Balance de volumen por sesión ─────────────────────────────────────────
  const balanceMap = new Map<string, { color: string; volumen: number }>();
  for (const log of logs) {
    const nombre = log.sesionNombre ?? "Sin nombre";
    let vol = 0;
    for (const ej of log.ejercicios) {
      for (const set of ej.sets) {
        vol += (set.reps ?? 0) * (set.peso ?? 0);
      }
    }
    const entry = balanceMap.get(nombre);
    if (entry) {
      entry.volumen += vol;
    } else {
      balanceMap.set(nombre, { color: log.sesionColor ?? "#6b6b72", volumen: vol });
    }
  }
  const balanceSesiones: BalanceSesion[] = [...balanceMap.entries()].map(
    ([sesion, { color, volumen }]) => ({ sesion, color, volumen }),
  );

  // ── 1RM estimado por ejercicio (Epley: peso × (1 + reps/30)) ─────────────
  const unRmMap = new Map<string, { nombre: string; color: string; puntos: Map<string, number> }>();
  for (const log of logs) {
    const semana = isoWeekLabel(getISOWeek(new Date(log.fecha)));
    for (const ej of log.ejercicios) {
      if (!ej.ejercicioId) continue;
      const id = String(ej.ejercicioId);
      for (const set of ej.sets) {
        if (!set.peso || !set.reps || set.reps === 0) continue;
        const unRm = set.peso * (1 + set.reps / 30);
        if (!unRmMap.has(id)) {
          unRmMap.set(id, {
            nombre: ej.nombre,
            color: log.sesionColor ?? "#f4634a",
            puntos: new Map(),
          });
        }
        const entry = unRmMap.get(id)!;
        entry.puntos.set(semana, Math.max(entry.puntos.get(semana) ?? 0, unRm));
      }
    }
  }
  const unRmEjercicios: EjercicioData[] = [...unRmMap.entries()]
    .filter(([, v]) => v.puntos.size >= 3)
    .sort((a, b) => b[1].puntos.size - a[1].puntos.size)
    .slice(0, 6)
    .map(([id, v]) => {
      // Últimas 10 entradas (≈ 2 meses), etiquetadas S1…Sn
      const allPuntos = [...v.puntos.entries()].sort((a, b) => a[0].localeCompare(b[0]));
      const ultimos10 = allPuntos.slice(-10);
      return {
        id,
        nombre: v.nombre,
        color: v.color,
        datos: ultimos10.map(([semanaLabel, y], i) => ({
          x: `S${i + 1}`,
          semanaLabel,
          y: convertirPeso(Math.round(y * 10) / 10, unidadPeso),
        })),
      };
    });

  // ── Plateau: ejercicios sin progreso en las últimas 4+ sesiones ───────────
  const plateauEjMap = new Map<string, { nombre: string; registros: { fecha: Date; maxPeso: number }[] }>();
  for (const log of logs) {
    for (const ej of log.ejercicios) {
      if (!ej.ejercicioId) continue;
      const id = String(ej.ejercicioId);
      const maxPeso = Math.max(...ej.sets.map((s) => s.peso ?? 0));
      if (maxPeso <= 0) continue;
      if (!plateauEjMap.has(id)) {
        plateauEjMap.set(id, { nombre: ej.nombre, registros: [] });
      }
      plateauEjMap.get(id)!.registros.push({ fecha: new Date(log.fecha), maxPeso });
    }
  }
  const plateaus: PlateauData[] = [];
  for (const [, { nombre, registros }] of plateauEjMap) {
    if (registros.length < 4) continue;
    const sorted = registros.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
    const ultimos = sorted.slice(-4);
    const primero = ultimos[0];
    const ultimo = ultimos[ultimos.length - 1];
    if (ultimo.maxPeso <= primero.maxPeso) {
      const semanas = Math.round(
        (ultimo.fecha.getTime() - primero.fecha.getTime()) / (7 * 86400000),
      );
      if (semanas >= 2) {
        plateaus.push({ ejercicio: nombre, semanas, ultimoPeso: ultimo.maxPeso });
      }
    }
  }
  plateaus.sort((a, b) => b.semanas - a.semanas);

  // ── Distribución muscular (con cache Gemini) ──────────────────────────────
  let musculoData: MusculoData[] = [];
  try {
    // 1. Recolectar nombres únicos de ejercicios del historial
    const nombresUnicos = [
      ...new Set(logs.flatMap((l) => l.ejercicios.map((e) => e.nombre))),
    ];
    const nombresNorm = nombresUnicos.map(normalizarNombre);

    // 2. Buscar cache en MongoDB
    const cacheados = await EjercicioMusculos.find({
      nombreNorm: { $in: nombresNorm },
    }).lean();
    const cacheMap = new Map(cacheados.map((c) => [c.nombreNorm, c.musculos]));

    // 3. Clasificar faltantes con Gemini
    const faltantes = nombresNorm.filter((n) => !cacheMap.has(n));
    if (faltantes.length > 0) {
      const geminiMap = await clasificarEjercicios(faltantes);
      // Persistir nuevos en cache
      const docs = [...geminiMap.entries()].map(([nombreNorm, musculos]) => ({
        nombreNorm,
        musculos,
        creadoEn: new Date(),
      }));
      if (docs.length > 0) {
        await EjercicioMusculos.insertMany(docs, { ordered: false }).catch(() => {});
      }
      for (const [k, v] of geminiMap) cacheMap.set(k, v);
    }

    // 4. Override con musculos[] de la rutina activa del usuario (fuente primaria)
    const rutinaActiva = await Routine.findOne({ userId, activa: true }).lean();
    if (rutinaActiva) {
      for (const sesion of rutinaActiva.sesiones) {
        for (const ej of sesion.ejercicios) {
          if (ej.musculos && ej.musculos.length > 0) {
            cacheMap.set(normalizarNombre(ej.nombre), ej.musculos);
          }
        }
      }
    }

    // 5. Calcular volumen por músculo
    const volMusculoMap = new Map<string, number>();
    for (const log of logs) {
      for (const ej of log.ejercicios) {
        const norm = normalizarNombre(ej.nombre);
        const musculos = cacheMap.get(norm);
        if (!musculos) continue;
        let volEj = 0;
        for (const set of ej.sets) {
          volEj += (set.reps ?? 0) * (set.peso ?? 0);
        }
        for (const m of musculos) {
          const contrib = volEj * (m.porcentaje / 100);
          volMusculoMap.set(m.nombre, (volMusculoMap.get(m.nombre) ?? 0) + contrib);
        }
      }
    }

    musculoData = [...volMusculoMap.entries()]
      .filter(([, v]) => v > 0)
      .map(([musculo, volumen]) => ({
        musculo,
        volumen: convertirPeso(volumen, unidadPeso),
      }))
      .sort((a, b) => b.volumen - a.volumen);
  } catch (err) {
    console.error("[estadisticas] Error calculando distribución muscular:", err);
    // Falla silenciosa — musculoData queda vacío
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="flex flex-col gap-4 p-4 pb-8">
      <h1
        className="text-[2rem] m-0 tracking-wider"
        style={{ fontFamily: "var(--font-bebas)", color: "var(--text)" }}
      >
        Estadísticas
      </h1>

      <StatsPageClient
        rachaActual={rachaActual}
        rachaMaxima={rachaMaxima}
        totalEntrenamientos={totalEntrenamientos}
        totalSemanas={totalSemanas}
        consistencia={consistencia}
        consistenciaDesde={consistenciaDesde}
        consistenciaHasta={consistenciaHasta}
        volumenSemanal={volumenSemanal}
        ejercicios={ejercicios}
        intensidad={intensidad}
        frecuencia={frecuencia}
        unidadPeso={unidadPeso}
        plan={session!.user.plan ?? "free"}
        balanceSesiones={balanceSesiones}
        unRmEjercicios={unRmEjercicios}
        plateaus={plateaus}
        musculoData={musculoData}
      />
    </main>
  );
}
