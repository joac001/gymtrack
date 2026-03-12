import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import WorkoutLog from "@/models/WorkoutLog";
import User from "@/models/User";
import LogHeader from "@/components/historial/LogHeader";
import EjercicioCard from "@/components/historial/EjercicioCard";
import DeleteLogButton from "@/components/historial/DeleteLogButton";

type Props = { params: Promise<{ id: string }> };

export default async function DetalleLogPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user.id;

  await connectDB();
  const [log, userDoc] = await Promise.all([
    WorkoutLog.findOne({ _id: id, userId }).lean(),
    User.findById(userId).lean(),
  ]);
  if (!log) notFound();

  const unidadPeso = ((userDoc as { unidadPeso?: string } | null)?.unidadPeso ?? "kg") as "kg" | "lbs";

  const volumenTotal = log.ejercicios.reduce(
    (total, e) => total + e.sets.reduce((s, set) => s + set.reps * set.peso, 0),
    0,
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Back + delete */}
      <div className="flex items-center justify-between">
        <Link
          href="/historial"
          className="text-[0.85rem] no-underline"
          style={{ color: "var(--text-muted)" }}
        >
          ← Historial
        </Link>
        <DeleteLogButton logId={id} />
      </div>

      {/* Header */}
      <LogHeader
        unidadPeso={unidadPeso}
        log={{
          sesionNombre: log.sesionNombre,
          sesionColor: log.sesionColor,
          fecha: log.fecha,
          intensidad: log.intensidad,
          ejerciciosCount: log.ejercicios.length,
          volumenTotal,
          notas: log.notas,
        }}
      />

      {/* Ejercicios */}
      <div className="flex flex-col gap-2.5">
        {log.ejercicios.map((ej, i) => (
          <EjercicioCard
            key={i}
            index={i}
            sesionColor={log.sesionColor}
            unidadPeso={unidadPeso}
            ejercicio={{
              nombre: ej.nombre,
              esExtra: ej.esExtra,
              sets: ej.sets,
            }}
          />
        ))}
      </div>
    </div>
  );
}
