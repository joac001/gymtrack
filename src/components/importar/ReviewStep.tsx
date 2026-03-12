"use client";

import { useState } from "react";
import type { RutinaImport, LogImport, AjusteMenor } from "@/lib/gemini-import";

interface Props {
  rutinas: RutinaImport[];
  logs: LogImport[];
  ajustes: AjusteMenor[];
  onConfirmar: (ajustesValores: Record<string, string | number | boolean>) => void;
  loading: boolean;
}

export default function ReviewStep({ rutinas, logs, ajustes, onConfirmar, loading }: Props) {
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});
  const [valoresAjustes, setValoresAjustes] = useState<Record<string, string | number | boolean>>(
    () => {
      const init: Record<string, string | number | boolean> = {};
      for (const a of ajustes) init[a.id] = a.valorDefault;
      return init;
    },
  );

  function toggleRutina(nombre: string) {
    setExpandidos((v) => ({ ...v, [nombre]: !v[nombre] }));
  }

  // Calcular rango de fechas de logs
  const fechas = logs
    .filter((l) => l.fecha)
    .map((l) => new Date(l.fecha!).getTime())
    .sort((a, b) => a - b);

  const fechaMin = fechas.length ? new Date(fechas[0]) : null;
  const fechaMax = fechas.length ? new Date(fechas[fechas.length - 1]) : null;

  const logsConFechaIndice = logs.filter((l) => !l.fecha && l.fechaIndice != null).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p
          className="text-[0.72rem] font-semibold uppercase tracking-wider m-0 mb-1"
          style={{ color: "var(--push)" }}
        >
          Revisión final
        </p>
        <h2
          className="text-[1.4rem] m-0 tracking-wider"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--text)" }}
        >
          Esto es lo que se va a importar
        </h2>
        <p className="text-[0.85rem] mt-1 mb-0" style={{ color: "var(--text-muted)" }}>
          Revisá el resumen antes de confirmar. Esta acción no se puede deshacer.
        </p>
      </div>

      {/* Rutinas */}
      {rutinas.length > 0 && (
        <div className="flex flex-col gap-2">
          <p
            className="text-[0.72rem] font-semibold uppercase tracking-wider m-0"
            style={{ color: "var(--text-muted)" }}
          >
            Rutinas ({rutinas.length})
          </p>
          {rutinas.map((r) => (
            <div
              key={r.nombre}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
              }}
            >
              {/* Cabecera de rutina */}
              <button
                type="button"
                onClick={() => toggleRutina(r.nombre)}
                className="w-full flex items-center justify-between px-4 py-3 cursor-pointer text-left"
                style={{ background: "transparent", border: "none" }}
              >
                <div>
                  <span
                    className="text-[0.95rem] font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {r.nombre}
                  </span>
                  <span
                    className="text-[0.8rem] ml-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {r.sesiones.length} sesión{r.sesiones.length !== 1 ? "es" : ""}
                  </span>
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  {expandidos[r.nombre] ? "▲" : "▼"}
                </span>
              </button>

              {/* Detalle colapsable */}
              {expandidos[r.nombre] && (
                <div
                  style={{ borderTop: "1px solid var(--border)" }}
                  className="px-4 py-3 flex flex-col gap-3"
                >
                  {r.sesiones.map((s) => (
                    <div key={s.nombre} className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: s.color }}
                        />
                        <span
                          className="text-[0.85rem] font-semibold"
                          style={{ color: "var(--text)" }}
                        >
                          {s.nombre}
                        </span>
                        {s.dia && (
                          <span
                            className="text-[0.75rem] capitalize"
                            style={{ color: "var(--text-muted)" }}
                          >
                            · {s.dia}
                          </span>
                        )}
                      </div>
                      <div className="pl-4 flex flex-col gap-0.5">
                        {s.ejercicios.map((e, i) => (
                          <span
                            key={i}
                            className="text-[0.8rem]"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {e.nombre}
                            {e.series && e.reps
                              ? ` — ${e.series}×${e.reps.desde}${e.reps.hasta ? `-${e.reps.hasta}` : ""}`
                              : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Logs */}
      {logs.length > 0 && (
        <div
          className="flex flex-col gap-2 p-4"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <p
            className="text-[0.72rem] font-semibold uppercase tracking-wider m-0 mb-1"
            style={{ color: "var(--text-muted)" }}
          >
            Historial de entrenamientos
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p
                className="text-[1.2rem] font-bold m-0"
                style={{ color: "var(--text)", fontFamily: "var(--font-bebas)" }}
              >
                {logs.length}
              </p>
              <p className="text-[0.75rem] m-0" style={{ color: "var(--text-muted)" }}>
                entrenamientos
              </p>
            </div>
            {fechaMin && fechaMax && (
              <div>
                <p
                  className="text-[0.85rem] font-semibold m-0"
                  style={{ color: "var(--text)" }}
                >
                  {fechaMin.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <p className="text-[0.75rem] m-0" style={{ color: "var(--text-muted)" }}>
                  al {fechaMax.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            )}
            {logsConFechaIndice > 0 && (
              <div className="col-span-2">
                <p className="text-[0.78rem] m-0" style={{ color: "var(--text-muted)" }}>
                  {logsConFechaIndice} registro{logsConFechaIndice !== 1 ? "s" : ""} sin fecha exacta
                  {" "}(se asignarán fechas aproximadas)
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ajustes menores */}
      {ajustes.length > 0 && (
        <div className="flex flex-col gap-3">
          <p
            className="text-[0.72rem] font-semibold uppercase tracking-wider m-0"
            style={{ color: "var(--text-muted)" }}
          >
            Ajustes
          </p>
          {ajustes.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between gap-4 p-4"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <p className="text-[0.85rem] m-0" style={{ color: "var(--text)" }}>
                {a.descripcion}
              </p>
              {a.tipo === "number" ? (
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={Number(valoresAjustes[a.id])}
                  onChange={(e) =>
                    setValoresAjustes((v) => ({ ...v, [a.id]: Number(e.target.value) }))
                  }
                  className="w-16 px-2 py-1.5 text-center text-[0.9rem] outline-none"
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--text)",
                  }}
                />
              ) : a.tipo === "boolean" ? (
                <div className="flex gap-2">
                  {["Sí", "No"].map((op) => (
                    <button
                      key={op}
                      type="button"
                      onClick={() =>
                        setValoresAjustes((v) => ({ ...v, [a.id]: op === "Sí" }))
                      }
                      className="px-3 py-1.5 text-[0.8rem] font-medium cursor-pointer"
                      style={{
                        borderRadius: "var(--radius-md)",
                        border: `1px solid ${
                          (op === "Sí") === valoresAjustes[a.id]
                            ? "var(--push)"
                            : "var(--border)"
                        }`,
                        background:
                          (op === "Sí") === valoresAjustes[a.id]
                            ? "var(--push-bg)"
                            : "transparent",
                        color:
                          (op === "Sí") === valoresAjustes[a.id]
                            ? "var(--push)"
                            : "var(--text)",
                      }}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="date"
                  value={String(valoresAjustes[a.id])}
                  onChange={(e) =>
                    setValoresAjustes((v) => ({ ...v, [a.id]: e.target.value }))
                  }
                  className="px-2 py-1.5 text-[0.85rem] outline-none"
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--text)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sin datos */}
      {rutinas.length === 0 && logs.length === 0 && (
        <div
          className="p-6 text-center"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <p className="text-[0.9rem] m-0" style={{ color: "var(--text-muted)" }}>
            No se detectaron datos para importar.
          </p>
        </div>
      )}

      {/* Confirmar */}
      <button
        type="button"
        onClick={() => onConfirmar(valoresAjustes)}
        disabled={loading || (rutinas.length === 0 && logs.length === 0)}
        className="w-full py-3.5 text-[0.9rem] font-bold uppercase tracking-wider cursor-pointer transition-all disabled:opacity-40"
        style={{
          background: "var(--push)",
          border: "none",
          borderRadius: "var(--radius-lg)",
          color: "#fff",
          fontFamily: "var(--font-bebas)",
          fontSize: "1rem",
        }}
      >
        {loading ? "Importando..." : "Confirmar importación →"}
      </button>
    </div>
  );
}
