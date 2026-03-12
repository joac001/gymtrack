"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface SetInput {
  reps: string;
  peso: string;
}

interface EjercicioInput {
  ejercicioId: string;
  nombre: string;
  tipoMedida: "reps" | "tiempo";
  esExtra: boolean;
  sets: SetInput[];
}

interface SesionData {
  id: string;
  nombre: string;
  color: string;
  rutinaId: string;
  ejercicios: {
    id: string;
    nombre: string;
    tipoMedida: "reps" | "tiempo";
    series: number;
    repsDesde: number;
    repsHasta?: number;
    duracion?: string;
  }[];
}

function formatObjetivo(ej: SesionData["ejercicios"][number]): string {
  const series = ej.series ?? 1;
  if (ej.tipoMedida === "tiempo") {
    const dur = ej.duracion ?? "—";
    return series > 1 ? `${series} × ${dur}` : dur;
  }
  const repsStr =
    ej.repsHasta && ej.repsHasta > ej.repsDesde
      ? `${ej.repsDesde}-${ej.repsHasta}`
      : `${ej.repsDesde}`;
  return `${series} × ${repsStr} reps`;
}

interface UltimoLog {
  ejercicioId: string;
  sets: { reps: number; peso: number }[];
}

interface Props {
  sesion: SesionData;
  ultimosLogs?: UltimoLog[];
}

const INTENSIDADES = [
  { n: 1, emoji: "😴", color: "#22c55e" },
  { n: 2, emoji: "🙂", color: "#22c55e" },
  { n: 3, emoji: "😊", color: "#4ade80" },
  { n: 4, emoji: "😌", color: "#a3e635" },
  { n: 5, emoji: "😤", color: "#f59e0b" },
  { n: 6, emoji: "😓", color: "#f97316" },
  { n: 7, emoji: "😰", color: "#f97316" },
  { n: 8, emoji: "😫", color: "#ef4444" },
  { n: 9, emoji: "🥵", color: "#dc2626" },
  { n: 10, emoji: "💀", color: "#991b1b" },
];

function emptySet(): SetInput {
  return { reps: "", peso: "" };
}

function initEjercicios(sesion: SesionData): EjercicioInput[] {
  return sesion.ejercicios.map((e) => ({
    ejercicioId: e.id,
    nombre: e.nombre,
    tipoMedida: e.tipoMedida,
    esExtra: false,
    sets: Array.from({ length: e.series }, () => emptySet()),
  }));
}

export default function EntrenarForm({ sesion, ultimosLogs = [] }: Props) {
  const router = useRouter();
  const color = sesion.color;

  const [ejercicios, setEjercicios] = useState<EjercicioInput[]>(() =>
    initEjercicios(sesion),
  );
  const [intensidad, setIntensidad] = useState<number>(0);
  const [notasPre, setNotasPre] = useState("");
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nuevoExtra, setNuevoExtra] = useState("");

  function updateSet(
    ejIdx: number,
    setIdx: number,
    field: "reps" | "peso",
    value: string,
  ) {
    setEjercicios((prev) =>
      prev.map((e, i) =>
        i === ejIdx
          ? {
              ...e,
              sets: e.sets.map((s, j) =>
                j === setIdx ? { ...s, [field]: value } : s,
              ),
            }
          : e,
      ),
    );
  }

  function addSet(ejIdx: number) {
    setEjercicios((prev) =>
      prev.map((e, i) =>
        i === ejIdx ? { ...e, sets: [...e.sets, emptySet()] } : e,
      ),
    );
  }

  function removeSet(ejIdx: number, setIdx: number) {
    setEjercicios((prev) =>
      prev.map((e, i) =>
        i === ejIdx ? { ...e, sets: e.sets.filter((_, j) => j !== setIdx) } : e,
      ),
    );
  }

  function addEjercicioExtra() {
    const nombre = nuevoExtra.trim();
    if (!nombre) return;
    setEjercicios((prev) => [
      ...prev,
      {
        ejercicioId: "",
        nombre,
        tipoMedida: "reps",
        esExtra: true,
        sets: [emptySet()],
      },
    ]);
    setNuevoExtra("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (intensidad === 0) {
      setError("Seleccioná la intensidad de la sesión");
      return;
    }

    const ejerciciosPayload = ejercicios
      .map((e) => ({
        ejercicioId: e.ejercicioId || undefined,
        nombre: e.nombre,
        esExtra: e.esExtra,
        sets: e.sets
          .filter((s) => s.reps !== "" || s.peso !== "")
          .map((s) => ({
            reps: Number(s.reps) || 0,
            peso: Number(s.peso) || 0,
          })),
      }))
      .filter((e) => e.sets.length > 0);

    const payload = {
      rutinaId: sesion.rutinaId,
      sesionId: sesion.id,
      sesionNombre: sesion.nombre,
      sesionColor: sesion.color,
      fecha: new Date().toISOString(),
      ejercicios: ejerciciosPayload,
      intensidad,
      notasPre: notasPre.trim() || undefined,
      notas: notas.trim() || undefined,
    };

    setLoading(true);
    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al guardar");
        return;
      }

      const saved = await res.json();
      router.push(`/historial/${saved._id}`);
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      {/* ¿Cómo llegás? */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "14px 16px",
        }}
      >
        <label
          style={{
            display: "block",
            fontWeight: "600",
            fontSize: "0.9rem",
            color: "var(--text)",
            marginBottom: "4px",
          }}
        >
          ¿Cómo llegás?
        </label>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.75rem",
            margin: "0 0 10px",
          }}
        >
          Energía, sueño, estrés, dolores... Lo que sea relevante.
        </p>
        <textarea
          value={notasPre}
          onChange={(e) => setNotasPre(e.target.value)}
          placeholder="Ej: Dormí bien, llegué con energía. Leve dolor en hombro derecho."
          rows={2}
          style={{
            width: "100%",
            background: "var(--background)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            color: "var(--text)",
            fontSize: "0.875rem",
            padding: "10px 12px",
            fontFamily: "inherit",
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />
      </div>

      {ejercicios.map((ej, ejIdx) => {
        const ultimoLog = ultimosLogs.find(
          (l) => l.ejercicioId === ej.ejercicioId,
        );
        const ejOrigen = sesion.ejercicios.find((e) => e.id === ej.ejercicioId);
        const objetivo = ejOrigen ? formatObjetivo(ejOrigen) : null;

        return (
          <div
            key={ejIdx}
            style={{
              background: "var(--surface)",
              border: ej.esExtra
                ? "1px dashed var(--border)"
                : `1px solid ${color}30`,
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
                gap: "8px",
              }}
            >
              <span
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: ej.esExtra ? "var(--border)" : color + "20",
                  color: ej.esExtra ? "var(--text-muted)" : color,
                  fontSize: "0.7rem",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {ejIdx + 1}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    color: "var(--text)",
                    display: "block",
                  }}
                >
                  {ej.nombre}
                </span>
                {objetivo && (
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: color,
                      fontWeight: "600",
                      opacity: 0.85,
                    }}
                  >
                    Objetivo: {objetivo}
                  </span>
                )}
              </div>
              {ej.esExtra && (
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                    background: "var(--border)",
                    padding: "2px 6px",
                    borderRadius: "999px",
                    flexShrink: 0,
                  }}
                >
                  extra
                </span>
              )}
            </div>

            {/* Sets */}
            <div
              style={{
                padding: "10px 14px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {/* Última vez (comparar) */}
              {ultimoLog && ultimoLog.sets.length > 0 && (
                <p
                  style={{
                    fontSize: "0.73rem",
                    color: "var(--text-muted)",
                    margin: 0,
                  }}
                >
                  Última vez:{" "}
                  {ultimoLog.sets
                    .map((s) =>
                      ej.tipoMedida === "tiempo"
                        ? `${s.reps} min`
                        : `${s.reps} × ${s.peso} kg`,
                    )
                    .join(" | ")}
                </p>
              )}

              {/* Cabecera columnas */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px 1fr 1fr 28px",
                  gap: "6px",
                  alignItems: "center",
                }}
              >
                <span />
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  {ej.tipoMedida === "tiempo" ? "MIN" : "REPS"}
                </span>
                {ej.tipoMedida === "reps" && (
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    KG
                  </span>
                )}
              </div>

              {ej.sets.map((set, setIdx) => (
                <div
                  key={setIdx}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      ej.tipoMedida === "reps"
                        ? "28px 1fr 1fr 28px"
                        : "28px 1fr 28px",
                    gap: "6px",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--text-muted)",
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    {setIdx + 1}
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    placeholder={ej.tipoMedida === "tiempo" ? "0" : "0"}
                    value={set.reps}
                    onChange={(e) =>
                      updateSet(ejIdx, setIdx, "reps", e.target.value)
                    }
                    style={inputStyle}
                  />
                  {ej.tipoMedida === "reps" && (
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={0.5}
                      placeholder="0"
                      value={set.peso}
                      onChange={(e) =>
                        updateSet(ejIdx, setIdx, "peso", e.target.value)
                      }
                      style={inputStyle}
                    />
                  )}
                  {ej.sets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSet(ejIdx, setIdx)}
                      style={btnRemoveStyle}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => addSet(ejIdx)}
                style={{
                  width: "100%",
                  padding: "7px",
                  background: "transparent",
                  border: `1px dashed ${color}50`,
                  borderRadius: "var(--radius-sm)",
                  color: color,
                  fontSize: "0.78rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  marginTop: "2px",
                }}
              >
                + Serie
              </button>
            </div>
          </div>
        );
      })}

      {/* Agregar ejercicio extra */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          padding: "12px",
          background: "var(--surface)",
          border: "1px dashed var(--border)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <input
          type="text"
          placeholder="Ejercicio extra..."
          value={nuevoExtra}
          onChange={(e) => setNuevoExtra(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addEjercicioExtra())
          }
          style={{ ...inputStyle, flex: 1 }}
        />
        <button
          type="button"
          onClick={addEjercicioExtra}
          style={{
            padding: "8px 14px",
            background: "var(--border)",
            border: "none",
            borderRadius: "var(--radius-sm)",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            fontWeight: "600",
            cursor: "pointer",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
          }}
        >
          + Agregar
        </button>
      </div>

      {/* Intensidad */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "16px",
        }}
      >
        <p
          style={{
            fontWeight: "600",
            fontSize: "0.9rem",
            margin: "0 0 4px",
            color: "var(--text)",
          }}
        >
          ¿Cómo te sentiste?
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "6px",
            overflowX: "auto",
            paddingBottom: "4px",
            scrollbarWidth: "none",
          }}
        >
          {INTENSIDADES.map(({ n, emoji, color: btnColor }) => {
            const active = intensidad === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setIntensidad(n)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "3px",
                  padding: "8px 6px 6px",
                  minWidth: "44px",
                  borderRadius: "var(--radius-sm)",
                  border: `1px solid ${active ? btnColor : "var(--border)"}`,
                  background: active ? btnColor + "20" : "transparent",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  flexShrink: 0,
                  transition: "all 0.1s",
                  marginTop: "4px",
                }}
              >
                <span
                  style={{
                    fontSize: "1.3rem",
                    lineHeight: 1,
                    display: "block",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  {emoji}
                </span>
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: active ? "700" : "500",
                    color: active ? btnColor : "var(--text-muted)",
                  }}
                >
                  {n}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notas */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            fontWeight: "600",
            marginBottom: "6px",
          }}
        >
          Notas (opcional)
        </label>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Cómo te sentiste, qué ajustar..."
          rows={3}
          style={{
            width: "100%",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            color: "var(--text)",
            fontSize: "0.875rem",
            padding: "10px 12px",
            fontFamily: "inherit",
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />
      </div>

      {error && (
        <p
          style={{
            color: "var(--danger)",
            fontSize: "0.85rem",
            textAlign: "center",
            margin: 0,
          }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "14px",
          background: loading ? "var(--border)" : color,
          border: "none",
          borderRadius: "var(--radius-md)",
          color: "#fff",
          fontWeight: "700",
          fontSize: "1rem",
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "var(--font-bebas)",
          letterSpacing: "0.06em",
        }}
      >
        {loading ? "GUARDANDO..." : "GUARDAR ENTRENAMIENTO"}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  background: "var(--background)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  color: "var(--text)",
  fontSize: "0.9rem",
  padding: "8px",
  fontFamily: "inherit",
  width: "100%",
  textAlign: "center",
  boxSizing: "border-box",
};

const btnRemoveStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "var(--danger)",
  cursor: "pointer",
  padding: "0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "34px",
  width: "28px",
};
