import { getIntensidad, intensidadLabel } from "./intensidad";

export interface LogHeaderData {
  sesionNombre: string;
  sesionColor: string;
  fecha: Date;
  intensidad: number;
  ejerciciosCount: number;
  volumenTotal: number;
  notas?: string | null;
}

export default function LogHeader({ log }: { log: LogHeaderData }) {
  const color = log.sesionColor;
  const { emoji, color: intColor } = getIntensidad(log.intensidad);

  const fechaStr = new Date(log.fecha).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      style={{
        background: "var(--surface)",
        border: `1px solid ${color}40`,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      {/* Título + intensidad */}
      <div
        className="flex items-center justify-between px-4 py-4"
        style={{
          background: color + "10",
          borderBottom: `1px solid ${color}25`,
        }}
      >
        <div className="min-w-0">
          <h1
            className="m-0 tracking-wider truncate"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "1.6rem",
              letterSpacing: "0.05em",
              color,
            }}
          >
            {log.sesionNombre.toUpperCase()}
          </h1>
          <p
            className="m-0 mt-0.5 text-[0.8rem] capitalize"
            style={{ color: "var(--text-muted)" }}
          >
            {fechaStr}
          </p>
        </div>

        {/* Intensidad con emoji */}
        <div className="flex flex-col items-center shrink-0 ml-4" style={{ minWidth: "48px" }}>
          <span className="text-[2rem] leading-none">{emoji}</span>
          <span className="text-[0.75rem] font-bold mt-0.5" style={{ color: intColor }}>
            {log.intensidad}/10
          </span>
          <span className="text-[0.65rem]" style={{ color: "var(--text-muted)" }}>
            {intensidadLabel(log.intensidad)}
          </span>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-2" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="px-4 py-3" style={{ borderRight: "1px solid var(--border)" }}>
          <p
            className="text-[0.7rem] font-semibold uppercase tracking-wider m-0 mb-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            Ejercicios
          </p>
          <p className="text-[1.1rem] font-bold m-0" style={{ color: "var(--text)" }}>
            {log.ejerciciosCount}
          </p>
        </div>
        <div className="px-4 py-3">
          <p
            className="text-[0.7rem] font-semibold uppercase tracking-wider m-0 mb-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            Volumen total
          </p>
          <p className="text-[1.1rem] font-bold m-0" style={{ color: "var(--text)" }}>
            {log.volumenTotal > 0
              ? `${log.volumenTotal.toLocaleString("es-AR")} kg`
              : "—"}
          </p>
        </div>
      </div>

      {/* Notas */}
      {log.notas && (
        <div className="px-4 py-3">
          <p className="text-[0.8rem] m-0 italic" style={{ color: "var(--text-muted)" }}>
            &ldquo;{log.notas}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
