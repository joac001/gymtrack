import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Routine from "@/models/Routine";
import WorkoutLog from "@/models/WorkoutLog";
import EntrenarForm from "@/components/entrenar/EntrenarForm";

type Props = {
  params: Promise<{ sesionId: string }>;
  searchParams: Promise<{ rutinaId?: string }>;
};

export default async function EntrenarPage({ params, searchParams }: Props) {
  const { sesionId } = await params;
  const { rutinaId } = await searchParams;

  if (!rutinaId) notFound();

  const session = await auth();
  const userId = session!.user.id;

  await connectDB();

  const rutina = await Routine.findOne({ _id: rutinaId, userId }).lean();
  if (!rutina) notFound();

  const sesion = rutina.sesiones.find((s) => s._id.toString() === sesionId);
  if (!sesion) notFound();

  // Último log de esta misma sesión (para comparar)
  const ultimoLog = await WorkoutLog.findOne({
    userId,
    sesionId,
  })
    .sort({ fecha: -1 })
    .lean();

  const ejerciciosOrdenados = [...sesion.ejercicios].sort(
    (a, b) => a.orden - b.orden,
  );

  const sesionData = {
    id: sesion._id.toString(),
    nombre: sesion.nombre,
    color: sesion.color,
    rutinaId,
    ejercicios: ejerciciosOrdenados.map((e) => ({
      id: e._id.toString(),
      nombre: e.nombre,
      tipoMedida: e.tipoMedida ?? "reps" as const,
      series: e.series ?? 3,
      repsDesde: e.reps?.desde ?? 10,
      repsHasta: e.reps?.hasta,
      duracion: e.duracion,
    })),
  };

  const ultimosLogs = ultimoLog
    ? ultimoLog.ejercicios
        .filter((e) => e.ejercicioId)
        .map((e) => ({
          ejercicioId: e.ejercicioId!.toString(),
          sets: e.sets,
        }))
    : [];

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Link
          href="/dashboard"
          style={{
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            textDecoration: "none",
          }}
        >
          ← Volver
        </Link>
        <h1
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "1.8rem",
            letterSpacing: "0.05em",
            color: sesion.color,
            margin: "8px 0 0",
          }}
        >
          {sesion.nombre.toUpperCase()}
        </h1>
        {ultimoLog && (
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "2px" }}>
            Última vez:{" "}
            {new Date(ultimoLog.fecha).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "short",
            })}
          </p>
        )}
      </div>

      <EntrenarForm sesion={sesionData} ultimosLogs={ultimosLogs} />
    </div>
  );
}
