import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import WorkoutLog from "@/models/WorkoutLog";
import Routine from "@/models/Routine";
import Link from "next/link";

function formatFecha(date: Date) {
  return new Date(date).toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function calcVolumen(ejercicios: { sets: { reps: number; peso: number }[] }[]) {
  return ejercicios.reduce(
    (total, e) =>
      total + e.sets.reduce((s, set) => s + set.reps * set.peso, 0),
    0,
  );
}

function intensidadColor(n: number) {
  if (n <= 3) return "var(--success)";
  if (n <= 6) return "var(--warning)";
  if (n <= 8) return "var(--session-push)";
  return "var(--danger)";
}

export default async function HistorialPage() {
  const session = await auth();
  const userId = session!.user.id;

  await connectDB();
  const logs = await WorkoutLog.find({ userId }).sort({ fecha: -1 }).limit(50).lean();

  const rutinaIds = [...new Set(logs.map((l) => l.rutinaId.toString()))];
  const rutinas = await Routine.find({ _id: { $in: rutinaIds } }, { nombre: 1 }).lean();
  const rutinaNombreMap = new Map(rutinas.map((r) => [r._id.toString(), r.nombre]));

  return (
    <div>
      <h1
        className="text-[1.8rem] tracking-wider m-0 mb-6"
        style={{ fontFamily: "var(--font-bebas)", color: "var(--text)" }}
      >
        HISTORIAL
      </h1>

      {logs.length === 0 ? (
        <div
          className="p-8 text-center"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <p className="text-[0.9rem] mb-4" style={{ color: "var(--text-muted)" }}>
            Todavía no registraste entrenamientos.
          </p>
          <Link
            href="/dashboard"
            className="text-[0.9rem] font-semibold no-underline"
            style={{ color: "var(--push)" }}
          >
            Ir al inicio →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {logs.map((log) => {
            const color = log.sesionColor;
            const volumen = calcVolumen(log.ejercicios);
            const rutinaNombre = rutinaNombreMap.get(log.rutinaId.toString());
            return (
              <Link
                key={log._id.toString()}
                href={`/historial/${log._id.toString()}`}
                className="no-underline"
              >
                <div
                  className="flex items-center gap-3 px-4 py-3.5 cursor-pointer"
                  style={{
                    background: "var(--surface)",
                    border: `1px solid ${color}30`,
                    borderRadius: "var(--radius-lg)",
                  }}
                >
                  {/* Color dot */}
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: color }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-[0.9rem] m-0 whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ color: "var(--text)" }}
                    >
                      {log.sesionNombre}
                    </p>
                    <p className="text-[0.78rem] m-0 mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {rutinaNombre && (
                        <span className="font-medium" style={{ color: "var(--push)" }}>
                          {rutinaNombre} ·{" "}
                        </span>
                      )}
                      {formatFecha(log.fecha)} · {log.ejercicios.length} ejercicios
                      {volumen > 0 && ` · ${volumen.toLocaleString("es-AR")} kg vol`}
                    </p>
                  </div>

                  {/* Intensidad */}
                  <span
                    className="text-[0.85rem] font-bold shrink-0"
                    style={{ color: intensidadColor(log.intensidad) }}
                  >
                    {log.intensidad}/10
                  </span>

                  <span className="text-[0.8rem]" style={{ color: "var(--text-muted)" }}>
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
