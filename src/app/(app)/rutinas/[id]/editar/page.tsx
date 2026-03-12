import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Routine from "@/models/Routine";
import RutinaForm, { PALETTE } from "@/components/rutinas/RutinaForm";

type Params = { params: Promise<{ id: string }> };

export default async function EditarRutinaPage({ params }: Params) {
  const { id } = await params;
  const session = await auth();

  await connectDB();
  const rutina = await Routine.findOne({ _id: id, userId: session!.user.id }).lean();

  if (!rutina) notFound();

  // Transformar al formato que espera el form
  const initialData = {
    nombre: rutina.nombre,
    sesiones: rutina.sesiones.map((s, si) => ({
      id: s._id.toString(),
      nombre: s.nombre,
      color: s.color ?? PALETTE[si % PALETTE.length],
      dia: s.dia,
      ejercicios: s.ejercicios.map((e) => ({
        id: e._id.toString(),
        nombre: e.nombre,
        grupo: e.grupo ?? "",
        tipoMedida: e.tipoMedida ?? "reps",
        series: e.series ?? 3,
        repsDesde: e.reps?.desde ?? 10,
        repsHasta: e.reps?.hasta != null ? String(e.reps.hasta) : "",
        duracion: e.duracion ?? "",
        notas: e.notas ?? "",
      })),
    })),
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Link href={`/rutinas/${id}`} style={{ color: "var(--text-muted)", fontSize: "0.85rem", textDecoration: "none" }}>
          ← Ver rutina
        </Link>
        <h1 style={{
          fontFamily: "var(--font-bebas)",
          fontSize: "1.8rem",
          letterSpacing: "0.05em",
          color: "var(--text)",
          margin: "8px 0 0",
        }}>
          EDITAR RUTINA
        </h1>
      </div>
      <RutinaForm rutinaId={id} initialData={initialData} />
    </div>
  );
}
