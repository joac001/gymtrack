import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import WorkoutLog from "@/models/WorkoutLog";
import Routine from "@/models/Routine";
import Link from "next/link";
import LogCard from "@/components/historial/LogCard";

function calcVolumen(ejercicios: { sets: { reps: number; peso: number }[] }[]) {
  return ejercicios.reduce(
    (total, e) => total + e.sets.reduce((s, set) => s + set.reps * set.peso, 0),
    0,
  );
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
          {logs.map((log) => (
            <LogCard
              key={log._id.toString()}
              log={{
                id: log._id.toString(),
                sesionNombre: log.sesionNombre,
                sesionColor: log.sesionColor,
                fecha: log.fecha,
                intensidad: log.intensidad,
                ejerciciosCount: log.ejercicios.length,
                volumen: calcVolumen(log.ejercicios),
                rutinaNombre: rutinaNombreMap.get(log.rutinaId.toString()),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
