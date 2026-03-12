import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import WorkoutLog from "@/models/WorkoutLog";

type Props = { params: Promise<{ id: string }> };

function intensidadColor(n: number) {
  if (n <= 3) return "var(--success)";
  if (n <= 6) return "var(--warning)";
  if (n <= 8) return "var(--session-push)";
  return "var(--danger)";
}

function intensidadLabel(n: number) {
  if (n <= 3) return "Suave";
  if (n <= 5) return "Moderada";
  if (n <= 7) return "Intensa";
  if (n <= 9) return "Muy intensa";
  return "Máxima";
}

export default async function DetalleLogPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  await connectDB();
  const log = await WorkoutLog.findOne({ _id: id, userId: session!.user.id }).lean();
  if (!log) notFound();

  const color = log.sesionColor;
  const fecha = new Date(log.fecha).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const volumenTotal = log.ejercicios.reduce(
    (total, e) =>
      total + e.sets.reduce((s, set) => s + set.reps * set.peso, 0),
    0,
  );

  return (
    <div>
      {/* Back */}
      <div style={{ marginBottom: "20px" }}>
        <Link
          href="/historial"
          style={{
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            textDecoration: "none",
          }}
        >
          ← Historial
        </Link>
      </div>

      {/* Header */}
      <div
        style={{
          background: "var(--surface)",
          border: `1px solid ${color}40`,
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            background: color + "14",
            borderBottom: `1px solid ${color}30`,
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "1.6rem",
                letterSpacing: "0.05em",
                color,
                margin: 0,
              }}
            >
              {log.sesionNombre.toUpperCase()}
            </h1>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                margin: "2px 0 0",
                textTransform: "capitalize",
              }}
            >
              {fecha}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontWeight: "700",
                fontSize: "1.5rem",
                color: intensidadColor(log.intensidad),
                margin: 0,
                lineHeight: 1,
              }}
            >
              {log.intensidad}
              <span style={{ fontSize: "0.8rem", fontWeight: "400" }}>/10</span>
            </p>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.7rem",
                margin: "2px 0 0",
              }}
            >
              {intensidadLabel(log.intensidad)}
            </p>
          </div>
        </div>

        {/* Stats rápidas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderRight: "1px solid var(--border)",
            }}
          >
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.7rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                margin: "0 0 2px",
              }}
            >
              Ejercicios
            </p>
            <p
              style={{
                fontWeight: "700",
                fontSize: "1.1rem",
                color: "var(--text)",
                margin: 0,
              }}
            >
              {log.ejercicios.length}
            </p>
          </div>
          <div style={{ padding: "12px 16px" }}>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.7rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                margin: "0 0 2px",
              }}
            >
              Volumen total
            </p>
            <p
              style={{
                fontWeight: "700",
                fontSize: "1.1rem",
                color: "var(--text)",
                margin: 0,
              }}
            >
              {volumenTotal > 0
                ? `${volumenTotal.toLocaleString("es-AR")} kg`
                : "—"}
            </p>
          </div>
        </div>

        {/* Notas */}
        {log.notas && (
          <div style={{ padding: "12px 16px" }}>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              &ldquo;{log.notas}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Ejercicios */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {log.ejercicios.map((ej, i) => {
          const volEj = ej.sets.reduce((s, set) => s + set.reps * set.peso, 0);
          return (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: `1px solid ${ej.esExtra ? "var(--border)" : color + "25"}`,
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
              }}
            >
              {/* Header ejercicio */}
              <div
                style={{
                  background: ej.esExtra ? "transparent" : color + "0d",
                  borderBottom: `1px solid ${ej.esExtra ? "var(--border)" : color + "20"}`,
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: ej.esExtra ? "var(--border)" : color + "20",
                    color: ej.esExtra ? "var(--text-muted)" : color,
                    fontSize: "0.65rem",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    color: "var(--text)",
                    flex: 1,
                  }}
                >
                  {ej.nombre}
                </span>
                {volEj > 0 && (
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      fontWeight: "500",
                    }}
                  >
                    {volEj.toLocaleString("es-AR")} kg
                  </span>
                )}
                {ej.esExtra && (
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      background: "var(--border)",
                      padding: "2px 6px",
                      borderRadius: "999px",
                    }}
                  >
                    extra
                  </span>
                )}
              </div>

              {/* Sets */}
              <div style={{ padding: "10px 14px" }}>
                {ej.sets.length === 0 ? (
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.8rem",
                      margin: 0,
                    }}
                  >
                    Sin series
                  </p>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    {ej.sets.map((set, setIdx) => (
                      <div
                        key={setIdx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "0.85rem",
                        }}
                      >
                        <span
                          style={{
                            color: "var(--text-muted)",
                            minWidth: "20px",
                            fontSize: "0.72rem",
                          }}
                        >
                          {setIdx + 1}
                        </span>
                        <span style={{ color: "var(--text)", fontWeight: "600" }}>
                          {set.reps}
                        </span>
                        <span style={{ color: "var(--text-muted)" }}>×</span>
                        <span style={{ color: "var(--text)", fontWeight: "600" }}>
                          {set.peso} kg
                        </span>
                        {set.peso > 0 && (
                          <span
                            style={{
                              color: "var(--text-muted)",
                              fontSize: "0.75rem",
                              marginLeft: "auto",
                            }}
                          >
                            {(set.reps * set.peso).toLocaleString("es-AR")} kg vol
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
