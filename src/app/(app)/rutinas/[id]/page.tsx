import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Routine from "@/models/Routine";
import SesionCard from "@/components/rutinas/SesionCard";

const DIAS_ORDEN = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

type Params = { params: Promise<{ id: string }> };

export default async function VerRutinaPage({ params }: Params) {
  const { id } = await params;
  const session = await auth();

  await connectDB();
  const rutina = await Routine.findOne({ _id: id, userId: session!.user.id }).lean();

  if (!rutina) notFound();

  const sesionesOrdenadas = [...rutina.sesiones].sort(
    (a, b) => DIAS_ORDEN.indexOf(a.dia) - DIAS_ORDEN.indexOf(b.dia)
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
          <Link href="/rutinas" style={{ color: "var(--text-muted)", fontSize: "0.85rem", textDecoration: "none" }}>
            ← Mis rutinas
          </Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "1.8rem",
              letterSpacing: "0.05em",
              color: "var(--text)",
              margin: 0,
            }}>
              {rutina.nombre.toUpperCase()}
            </h1>
            {rutina.activa && (
              <span style={{
                background: "var(--push-bg)",
                color: "var(--push)",
                fontSize: "0.7rem",
                fontWeight: "600",
                padding: "2px 8px",
                borderRadius: "999px",
                textTransform: "uppercase",
              }}>
                Activa
              </span>
            )}
          </div>
          <Link
            href={`/rutinas/${id}/editar`}
            style={{
              padding: "8px 16px",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              color: "var(--text)",
              fontSize: "0.85rem",
              fontWeight: "500",
              textDecoration: "none",
            }}
          >
            Editar
          </Link>
        </div>
      </div>

      {/* Sesiones */}
      {sesionesOrdenadas.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)" }}>
          <p>Esta rutina no tiene sesiones todavía.</p>
          <Link href={`/rutinas/${id}/editar`} style={{ color: "var(--push)" }}>
            Agregar sesiones
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {sesionesOrdenadas.map((sesion) => (
            <SesionCard key={sesion._id.toString()} sesion={sesion} />
          ))}
        </div>
      )}
    </div>
  );
}
