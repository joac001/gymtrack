import { ISesion } from "@/models/Routine";

const DIAS_LABEL: Record<string, string> = {
  lunes: "Lunes", martes: "Martes", miercoles: "Miércoles",
  jueves: "Jueves", viernes: "Viernes", sabado: "Sábado", domingo: "Domingo",
};

interface Props {
  sesion: ISesion;
}

function formatVolumen(ej: { tipoMedida?: string; series?: number; reps?: { desde: number; hasta?: number }; duracion?: string }) {
  if (ej.tipoMedida === "tiempo") {
    const series = ej.series && ej.series > 1 ? `${ej.series} × ` : "";
    return `${series}${ej.duracion ?? ""}`;
  }
  if (!ej.reps) return "";
  const repsStr = ej.reps.hasta && ej.reps.hasta !== ej.reps.desde
    ? `${ej.reps.desde}-${ej.reps.hasta}`
    : `${ej.reps.desde}`;
  return `${ej.series ?? ""} × ${repsStr}`;
}

export default function SesionCard({ sesion }: Props) {
  const color = sesion.color;
  const colorBg = color + "14";
  const ejerciciosOrdenados = [...sesion.ejercicios].sort((a, b) => a.orden - b.orden);

  return (
    <div style={{
      background: "var(--surface)",
      border: `1px solid ${color}30`,
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
    }}>
      {/* Header de sesión */}
      <div style={{
        background: colorBg,
        borderBottom: `1px solid ${color}30`,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <h2 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "1.3rem",
            letterSpacing: "0.05em",
            color: color,
            margin: 0,
          }}>
            {sesion.nombre.toUpperCase()}
          </h2>
          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
            {DIAS_LABEL[sesion.dia]}
          </span>
        </div>
        <span style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: color,
          display: "block",
          flexShrink: 0,
        }} />
      </div>

      {/* Lista de ejercicios */}
      <div style={{ padding: "8px 0" }}>
        {ejerciciosOrdenados.length === 0 ? (
          <p style={{ padding: "16px", color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>
            Sin ejercicios
          </p>
        ) : (
          ejerciciosOrdenados.map((ej, i) => {
            const prevGrupo = i > 0 ? ejerciciosOrdenados[i - 1].grupo : undefined;
            const showGrupoHeader = ej.grupo && ej.grupo.toLowerCase() !== prevGrupo?.toLowerCase();
            return (
              <div key={ej._id.toString()}>
                {showGrupoHeader && (
                  <div style={{
                    padding: "8px 16px 4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}>
                    <span style={{
                      fontSize: "0.7rem",
                      fontWeight: "700",
                      color: color,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}>
                      {ej.grupo}
                    </span>
                    <div style={{ flex: 1, height: "1px", background: color + "30" }} />
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 16px",
                    borderBottom: i < ejerciciosOrdenados.length - 1 ? "1px solid var(--border)" : "none",
                    gap: "12px",
                  }}
                >
                  <span style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: colorBg,
                    color: color,
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <a
                      href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(ej.nombre)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--text)",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        textDecoration: "none",
                        display: "block",
                      }}
                    >
                      {ej.nombre}
                    </a>
                    {ej.notas && (
                      <p style={{
                        color: "var(--text-muted)",
                        fontSize: "0.75rem",
                        margin: "2px 0 0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>
                        {ej.notas}
                      </p>
                    )}
                  </div>

                  <span style={{
                    color: color,
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                  }}>
                    {formatVolumen(ej)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
