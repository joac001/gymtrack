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

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function agruparPorMesYSemana(logs: (LogCardData & { rutinaId: string })[]) {
  // Ordenar más reciente primero
  const sorted = [...logs].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  type SemanaGroup = { semana: number; logs: (LogCardData & { rutinaId: string })[] };
  type MesGroup = {
    key: string;
    label: string;
    semanas: SemanaGroup[];
  };

  const meses: MesGroup[] = [];
  const mesMap = new Map<string, MesGroup>();

  for (const log of sorted) {
    const fecha = new Date(log.fecha);
    const year = fecha.getFullYear();
    const month = fecha.getMonth();
    const semana = getISOWeek(fecha);
    const mesKey = `${year}-${month}`;

    if (!mesMap.has(mesKey)) {
      const label = fecha.toLocaleDateString("es-AR", {
        month: "long",
        year: "numeric",
      });
      const grupo: MesGroup = { key: mesKey, label, semanas: [] };
      meses.push(grupo);
      mesMap.set(mesKey, grupo);
    }

    const mes = mesMap.get(mesKey)!;
    let semanaGroup = mes.semanas.find((s) => s.semana === semana);
    if (!semanaGroup) {
      semanaGroup = { semana, logs: [] };
      mes.semanas.push(semanaGroup);
    }
    semanaGroup.logs.push(log);
  }

  // Ordenar semanas dentro de cada mes (más reciente primero)
  for (const mes of meses) {
    mes.semanas.sort((a, b) => b.semana - a.semana);
  }

  return meses;
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

  const grupos = agruparPorMesYSemana(logsFiltrados);

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

      {/* Lista agrupada */}
      {logsFiltrados.length === 0 ? (
        <p className="text-[0.85rem]" style={{ color: "var(--text-muted)" }}>
          No hay entrenamientos para esta rutina.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {grupos.map((mes) => (
            <div key={mes.key} className="flex flex-col gap-3">
              {/* Header de mes */}
              <h2
                className="m-0 text-sm font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                {mes.label}
              </h2>

              <div className="flex flex-col gap-4">
                {mes.semanas.map((semana) => (
                  <div key={semana.semana} className="flex flex-col gap-2">
                    {/* Header de semana */}
                    <div
                      className="flex items-center gap-2"
                    >
                      <span
                        className="text-xs font-semibold px-2 py-0.5"
                        style={{
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius-sm)",
                          color: "var(--text-muted)",
                        }}
                      >
                        Semana {semana.semana}
                      </span>
                      <span
                        className="flex-1 h-px"
                        style={{ background: "var(--border)" }}
                      />
                    </div>

                    {/* Cards de la semana */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {semana.logs.map((log) => (
                        <LogCard key={log.id} unidadPeso={unidadPeso} log={log} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
