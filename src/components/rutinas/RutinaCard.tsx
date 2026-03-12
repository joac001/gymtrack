import Link from "next/link";
import { ISesion } from "@/models/Routine";
import { Trash2 } from "lucide-react";

export type RutinaData = {
  _id: string;
  nombre: string;
  activa: boolean;
  sesiones: ISesion[];
};

const DIAS_ORDEN = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
const DIAS_LABEL: Record<string, string> = {
  lunes: "Lun", martes: "Mar", miercoles: "Mié",
  jueves: "Jue", viernes: "Vie", sabado: "Sáb", domingo: "Dom",
};

interface Props {
  rutina: RutinaData;
  onActivar: (id: string) => void;
  onEliminar: (id: string) => void;
}

export default function RutinaCard({ rutina, onActivar, onEliminar }: Props) {
  const sesionesOrdenadas = [...rutina.sesiones].sort(
    (a, b) => DIAS_ORDEN.indexOf(a.dia) - DIAS_ORDEN.indexOf(b.dia)
  );

  return (
    <div
      className="flex flex-col gap-3 p-4"
      style={{
        background: "var(--surface)",
        border: `1px solid ${rutina.activa ? "var(--push)" : "var(--border)"}`,
        borderRadius: "var(--radius-lg)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="m-0 text-base font-semibold" style={{ color: "var(--text)" }}>
              {rutina.nombre}
            </h3>
            {rutina.activa && (
              <span
                className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{ background: "var(--push-bg)", color: "var(--push)" }}
              >
                Activa
              </span>
            )}
          </div>
          <p className="mt-1 text-[0.82rem] m-0" style={{ color: "var(--text-muted)" }}>
            {rutina.sesiones.length} sesión{rutina.sesiones.length !== 1 ? "es" : ""}
          </p>
        </div>
      </div>

      {/* Días de la semana */}
      {sesionesOrdenadas.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {sesionesOrdenadas.map((sesion) => (
            <div key={sesion._id.toString()} className="flex flex-col items-center gap-0.5">
              <span className="text-[0.7rem] uppercase" style={{ color: "var(--text-muted)" }}>
                {DIAS_LABEL[sesion.dia]}
              </span>
              <span
                className="w-2 h-2 rounded-full block"
                style={{ background: sesion.color }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-2 mt-1">
        <Link
          href={`/rutinas/${rutina._id}`}
          className="flex-1 text-center p-2 text-sm font-medium no-underline"
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            color: "var(--text)",
          }}
        >
          Ver
        </Link>
        <Link
          href={`/rutinas/${rutina._id}/editar`}
          className="flex-1 text-center p-2 text-sm font-medium no-underline"
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            color: "var(--text)",
          }}
        >
          Editar
        </Link>
        {!rutina.activa && (
          <button
            onClick={() => onActivar(rutina._id)}
            className="flex-1 p-2 text-sm font-medium cursor-pointer"
            style={{
              background: "var(--push-bg)",
              border: "1px solid var(--push)",
              borderRadius: "var(--radius-md)",
              color: "var(--push)",
            }}
          >
            Activar
          </button>
        )}
        <button
          onClick={() => onEliminar(rutina._id)}
          className="flex items-center justify-center px-3 py-2 cursor-pointer"
          style={{
            background: "transparent",
            border: "1px solid var(--danger-border)",
            borderRadius: "var(--radius-md)",
            color: "var(--danger)",
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
