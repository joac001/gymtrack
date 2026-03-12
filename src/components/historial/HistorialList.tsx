"use client";

import { useState } from "react";
import Link from "next/link";
import LogCard, { LogCardData } from "./LogCard";

interface RutinaFiltro {
  id: string;
  nombre: string;
}

interface Props {
  logs: (LogCardData & { rutinaId: string })[];
  rutinas: RutinaFiltro[];
  unidadPeso?: "kg" | "lbs";
}

export default function HistorialList({ logs, rutinas, unidadPeso = "kg" }: Props) {
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState<string | null>(null);

  const logsFiltrados =
    rutinaSeleccionada == null
      ? logs
      : logs.filter((l) => l.rutinaId === rutinaSeleccionada);

  if (logs.length === 0) {
    return (
      <div
        className="p-8 text-center"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <p className="text-[0.9rem] mb-4" style={{ color: "var(--text-muted)" }}>
          Todavía no registraste entrenamientos.
        </p>
        <Link
          href="/dashboard"
          className="text-[0.9rem] font-semibold no-underline"
          style={{ color: "var(--push)" }}
        >
          Ir al inicio →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filtro por rutina */}
      {rutinas.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setRutinaSeleccionada(null)}
            className="text-[0.78rem] px-3 py-1 cursor-pointer"
            style={{
              borderRadius: "999px",
              border: `1px solid ${rutinaSeleccionada == null ? "var(--push)" : "var(--border)"}`,
              background: rutinaSeleccionada == null ? "rgba(244,99,74,0.12)" : "transparent",
              color: rutinaSeleccionada == null ? "var(--push)" : "var(--text-muted)",
              fontWeight: rutinaSeleccionada == null ? "600" : "400",
            }}
          >
            Todas
          </button>
          {rutinas.map((r) => (
            <button
              key={r.id}
              onClick={() =>
                setRutinaSeleccionada(rutinaSeleccionada === r.id ? null : r.id)
              }
              className="text-[0.78rem] px-3 py-1 cursor-pointer"
              style={{
                borderRadius: "999px",
                border: `1px solid ${rutinaSeleccionada === r.id ? "var(--push)" : "var(--border)"}`,
                background:
                  rutinaSeleccionada === r.id ? "rgba(244,99,74,0.12)" : "transparent",
                color:
                  rutinaSeleccionada === r.id ? "var(--push)" : "var(--text-muted)",
                fontWeight: rutinaSeleccionada === r.id ? "600" : "400",
              }}
            >
              {r.nombre}
            </button>
          ))}
        </div>
      )}

      {/* Lista de logs */}
      {logsFiltrados.length === 0 ? (
        <p className="text-[0.85rem]" style={{ color: "var(--text-muted)" }}>
          No hay entrenamientos para esta rutina.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {logsFiltrados.map((log) => (
            <LogCard key={log.id} unidadPeso={unidadPeso} log={log} />
          ))}
        </div>
      )}
    </div>
  );
}
