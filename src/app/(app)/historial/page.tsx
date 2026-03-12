import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import WorkoutLog from "@/models/WorkoutLog";
import Routine from "@/models/Routine";
import User from "@/models/User";
import HistorialList from "@/components/historial/HistorialList";

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
  const [logs, userDoc] = await Promise.all([
    WorkoutLog.find({ userId }).sort({ fecha: -1 }).limit(50).lean(),
    User.findById(userId).lean(),
  ]);
  const unidadPeso = ((userDoc as { unidadPeso?: string } | null)?.unidadPeso ?? "kg") as "kg" | "lbs";

  const rutinaIds = [...new Set(logs.map((l) => l.rutinaId.toString()))];
  const rutinas = await Routine.find({ _id: { $in: rutinaIds } }, { nombre: 1 }).lean();
  const rutinaNombreMap = new Map(rutinas.map((r) => [r._id.toString(), r.nombre]));

  const logsData = logs.map((log) => ({
    id: log._id.toString(),
    rutinaId: log.rutinaId.toString(),
    sesionNombre: log.sesionNombre,
    sesionColor: log.sesionColor,
    fecha: log.fecha,
    intensidad: log.intensidad,
    ejerciciosCount: log.ejercicios.length,
    volumen: calcVolumen(log.ejercicios),
    rutinaNombre: rutinaNombreMap.get(log.rutinaId.toString()),
  }));

  const rutinasData = rutinas.map((r) => ({
    id: r._id.toString(),
    nombre: r.nombre,
  }));

  return (
    <div>
      <h1
        className="text-[1.8rem] tracking-wider m-0 mb-6"
        style={{ fontFamily: "var(--font-bebas)", color: "var(--text)" }}
      >
        HISTORIAL
      </h1>

      <HistorialList logs={logsData} rutinas={rutinasData} unidadPeso={unidadPeso} />
    </div>
  );
}
