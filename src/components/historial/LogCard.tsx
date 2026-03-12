import Link from "next/link";
import { getIntensidad } from "./intensidad";

export interface LogCardData {
  id: string;
  sesionNombre: string;
  sesionColor: string;
  fecha: Date;
  intensidad: number;
  ejerciciosCount: number;
  volumen: number;
  rutinaNombre?: string;
}

function formatFecha(date: Date) {
  return new Date(date).toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function LogCard({ log }: { log: LogCardData }) {
  const { emoji, color: intColor } = getIntensidad(log.intensidad);

  return (
    <Link href={`/historial/${log.id}`} className="no-underline">
      <div
        className="flex items-center gap-3 px-4 py-3.5 cursor-pointer"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        {/* Indicador de color de sesión */}
        <span
          className="w-1 self-stretch rounded-full shrink-0"
          style={{ background: log.sesionColor }}
        />

        {/* Info principal */}
        <div className="flex-1 min-w-0">
          <p
            className="font-semibold text-[0.9rem] m-0 truncate"
            style={{ color: "var(--text)" }}
          >
            {log.sesionNombre}
          </p>
          <p className="text-[0.78rem] m-0 mt-0.5" style={{ color: "var(--text-muted)" }}>
            {log.rutinaNombre && (
              <span className="font-medium" style={{ color: "var(--push)" }}>
                {log.rutinaNombre} ·{" "}
              </span>
            )}
            {formatFecha(log.fecha)} · {log.ejerciciosCount} ejercicios
            {log.volumen > 0 && ` · ${log.volumen.toLocaleString("es-AR")} kg`}
          </p>
        </div>

        {/* Intensidad */}
        <div className="flex flex-col items-center shrink-0" style={{ minWidth: "32px" }}>
          <span className="text-[1.2rem] leading-none">{emoji}</span>
          <span className="text-[0.65rem] mt-0.5" style={{ color: intColor }}>
            {log.intensidad}/10
          </span>
        </div>

        <span className="text-[0.8rem] shrink-0" style={{ color: "var(--text-muted)" }}>
          →
        </span>
      </div>
    </Link>
  );
}
