import { convertirPeso } from "@/lib/unidades";

export interface EjercicioCardData {
  nombre: string;
  esExtra: boolean;
  sets: { reps: number; peso: number }[];
}

interface Props {
  ejercicio: EjercicioCardData;
  index: number;
  sesionColor: string;
  unidadPeso?: "kg" | "lbs";
}

export default function EjercicioCard({ ejercicio, index, sesionColor, unidadPeso = "kg" }: Props) {
  // volumen siempre en kg (base) para cálculo interno, convertir solo al mostrar
  const volEjKg = ejercicio.sets.reduce((s, set) => s + set.reps * set.peso, 0);
  const volEj = convertirPeso(volEjKg, unidadPeso);
  const color = ejercicio.esExtra ? undefined : sesionColor;

  return (
    <div
      style={{
        background: "var(--surface)",
        border: `1px solid ${color ? color + "25" : "var(--border)"}`,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-3.5 py-2.5"
        style={{
          background: color ? color + "0d" : "transparent",
          borderBottom: `1px solid ${color ? color + "20" : "var(--border)"}`,
        }}
      >
        {/* Número */}
        <span
          className="w-5 h-5 rounded-full text-[0.65rem] font-bold flex items-center justify-center shrink-0"
          style={{
            background: color ? color + "20" : "var(--border)",
            color: color ?? "var(--text-muted)",
          }}
        >
          {index + 1}
        </span>

        {/* Nombre */}
        <span className="flex-1 font-semibold text-[0.9rem]" style={{ color: "var(--text)" }}>
          {ejercicio.nombre}
        </span>

        {/* Volumen */}
        {volEj > 0 && (
          <span className="text-[0.75rem] font-medium" style={{ color: "var(--text-muted)" }}>
            {volEj.toLocaleString("es-AR")} {unidadPeso}
          </span>
        )}

        {/* Badge extra */}
        {ejercicio.esExtra && (
          <span
            className="text-[0.7rem] px-1.5 py-0.5 rounded-full"
            style={{ background: "var(--border)", color: "var(--text-muted)" }}
          >
            extra
          </span>
        )}
      </div>

      {/* Sets */}
      <div className="px-3.5 py-2.5">
        {ejercicio.sets.length === 0 ? (
          <p className="text-[0.8rem] m-0" style={{ color: "var(--text-muted)" }}>
            Sin series
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {ejercicio.sets.map((set, setIdx) => (
              <div key={setIdx} className="flex items-center gap-2 text-[0.85rem]">
                <span
                  className="text-[0.72rem]"
                  style={{ color: "var(--text-muted)", minWidth: "20px" }}
                >
                  {setIdx + 1}
                </span>
                <span className="font-semibold" style={{ color: "var(--text)" }}>
                  {set.reps}
                </span>
                <span style={{ color: "var(--text-muted)" }}>×</span>
                <span className="font-semibold" style={{ color: "var(--text)" }}>
                  {convertirPeso(set.peso, unidadPeso)} {unidadPeso}
                </span>
                {set.peso > 0 && (
                  <span
                    className="text-[0.75rem] ml-auto"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {convertirPeso(set.reps * set.peso, unidadPeso).toLocaleString("es-AR")} {unidadPeso} vol
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
