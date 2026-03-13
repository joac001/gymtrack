"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { nivoTheme } from "./nivoTheme";
import type { EjercicioData } from "./PesoChart";

const ResponsiveLine = dynamic(
  () => import("@nivo/line").then((m) => m.ResponsiveLine),
  { ssr: false }
);

interface Props {
  ejercicios: EjercicioData[];
  unidadPeso?: "kg" | "lbs";
}

export default function UnRMChart({ ejercicios, unidadPeso = "kg" }: Props) {
  const [selectedId, setSelectedId] = useState(ejercicios[0]?.id ?? "");

  if (ejercicios.length === 0) {
    return (
      <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
        Necesitás al menos 3 sesiones del mismo ejercicio para estimar el 1RM.
      </p>
    );
  }

  const ejercicio = ejercicios.find((e) => e.id === selectedId) ?? ejercicios[0];

  const lineData = [
    {
      id: ejercicio.nombre,
      color: ejercicio.color,
      data: ejercicio.datos,
    },
  ];

  // Mostrar ~5 ticks en eje X para evitar solapamiento en mobile
  const step = Math.max(1, Math.ceil(ejercicio.datos.length / 5));
  const tickValues = ejercicio.datos.filter((_, i) => i % step === 0).map((d) => d.x);

  // Ticks del eje Y cada 2 unidades
  const yVals = ejercicio.datos.map((d) => d.y);
  const minY = Math.min(...yVals);
  const maxY = Math.max(...yVals);
  const yStep = 2;
  const yTickStart = Math.floor(minY / yStep) * yStep;
  const yTickEnd   = Math.ceil(maxY / yStep) * yStep;
  const yTickValues: number[] = [];
  for (let v = yTickStart; v <= yTickEnd; v += yStep) yTickValues.push(v);

  const lastDato = ejercicio.datos[ejercicio.datos.length - 1];

  return (
    <div className="flex flex-col gap-3">
      {/* Selector de ejercicio */}
      <div className="flex gap-2 flex-wrap">
        {ejercicios.map((ej) => (
          <button
            key={ej.id}
            onClick={() => setSelectedId(ej.id)}
            className="text-[0.78rem] px-3 py-1 cursor-pointer"
            style={{
              borderRadius: "999px",
              border: `1px solid ${ej.id === selectedId ? ej.color : "var(--border)"}`,
              background: ej.id === selectedId ? ej.color + "18" : "transparent",
              color: ej.id === selectedId ? ej.color : "var(--text-muted)",
              fontWeight: ej.id === selectedId ? "600" : "400",
            }}
          >
            {ej.nombre}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ height: 200 }}>
        <ResponsiveLine
          data={lineData}
          margin={{ top: 10, right: 20, bottom: 40, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: "auto", max: "auto", nice: true }}
          curve="monotoneX"
          colors={[ejercicio.color]}
          lineWidth={2}
          pointSize={6}
          pointColor={ejercicio.color}
          pointBorderWidth={2}
          pointBorderColor="#0e0e0f"
          enableArea
          areaOpacity={0.08}
          theme={nivoTheme}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            tickRotation: -35,
            tickValues,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            tickValues: yTickValues,
            format: (v) => `${v} ${unidadPeso}`,
          }}
          gridYValues={yTickValues}
          useMesh
          tooltip={({ point }) => (
            <div
              style={{
                background: "#161617",
                border: "1px solid #252527",
                borderRadius: "8px",
                padding: "6px 10px",
                fontSize: "12px",
                color: "#e8e8e8",
              }}
            >
              <strong>{(point.data as { semanaLabel?: string }).semanaLabel ?? String(point.data.x)}</strong>
              <br />
              1RM est. {String(point.data.y)} {unidadPeso}
            </div>
          )}
        />
      </div>

      {/* Último valor — siempre visible en mobile */}
      <p className="text-[0.72rem] text-right" style={{ color: "var(--text-muted)" }}>
        Último 1RM est.: <strong style={{ color: "var(--text)" }}>{lastDato.y} {unidadPeso}</strong> — {lastDato.semanaLabel ?? lastDato.x}
      </p>

      <p className="text-[0.72rem] text-center" style={{ color: "var(--text-muted)" }}>
        Estimado con fórmula Epley: peso × (1 + reps / 30)
      </p>
    </div>
  );
}
