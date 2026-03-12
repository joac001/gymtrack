import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import WorkoutLog from "@/models/WorkoutLog";
import LogHeader from "@/components/historial/LogHeader";
import EjercicioCard from "@/components/historial/EjercicioCard";

type Props = { params: Promise<{ id: string }> };

export default async function DetalleLogPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  await connectDB();
  const log = await WorkoutLog.findOne({ _id: id, userId: session!.user.id }).lean();
  if (!log) notFound();

  const volumenTotal = log.ejercicios.reduce(
    (total, e) => total + e.sets.reduce((s, set) => s + set.reps * set.peso, 0),
    0,
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Back */}
      <Link
        href="/historial"
        className="text-[0.85rem] no-underline"
        style={{ color: "var(--text-muted)" }}
      >
        ← Historial
      </Link>

      {/* Header */}
      <LogHeader
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
