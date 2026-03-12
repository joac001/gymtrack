"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { nivoTheme } from "./nivoTheme";

const ResponsiveLine = dynamic(
  () => import("@nivo/line").then((m) => m.ResponsiveLine),
  { ssr: false }
);

interface DataPoint {
  x: string;
  y: number;
}

export interface EjercicioData {
  id: string;
  nombre: string;
  color: string;
  datos: DataPoint[];
}

interface Props {
  ejercicios: EjercicioData[];
  unidadPeso?: "kg" | "lbs";
}

export default function PesoChart({ ejercicios, unidadPeso = "kg" }: Props) {
  const [selectedId, setSelectedId] = useState(ejercicios[0]?.id ?? "");

  if (ejercicios.length === 0) {
    return (
      <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
        Necesitás al menos 2 sesiones del mismo ejercicio para ver el progreso.
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
          margin={{ top: 10, right: 20, bottom: 40, left: 50 }}
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
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            format: (v) => `${v} ${unidadPeso}`,
          }}
          gridYValues={4}
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
              <strong>{String(point.data.x)}</strong>
              <br />
              {String(point.data.y)} {unidadPeso}
            </div>
          )}
        />
      </div>
    </div>
  );
}
