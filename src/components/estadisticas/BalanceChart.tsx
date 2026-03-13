"use client";

import dynamic from "next/dynamic";
import { nivoTheme } from "./nivoTheme";
import type { BalanceSesion } from "./StatsPageClient";
import { convertirPeso } from "@/lib/unidades";

const ResponsiveBar = dynamic(
  () => import("@nivo/bar").then((m) => m.ResponsiveBar),
  { ssr: false }
);

interface Props {
  data: BalanceSesion[];
  unidadPeso?: "kg" | "lbs";
}

export default function BalanceChart({ data, unidadPeso = "kg" }: Props) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
        Sin datos de sesiones para mostrar.
      </p>
    );
  }

  const sorted = [...data].sort((a, b) => b.volumen - a.volumen);

  const barData = sorted.map((s) => ({
    sesion: s.sesion,
    volumen: convertirPeso(s.volumen, unidadPeso),
    color: s.color,
  }));

  return (
    <div style={{ height: Math.max(120, barData.length * 48) }}>
      <ResponsiveBar
        data={barData}
        keys={["volumen"]}
        indexBy="sesion"
        layout="horizontal"
        margin={{ top: 4, right: 16, bottom: 4, left: 110 }}
        padding={0.35}
        colors={({ data }) => (data as { color: string }).color}
        theme={nivoTheme}
        borderRadius={4}
        enableLabel
        label={({ value }) =>
          value != null ? `${Math.round((value as number) / 1000)}k` : ""
        }
        labelSkipWidth={32}
        labelTextColor="#e8e8e8"
        axisLeft={{
          tickSize: 0,
          tickPadding: 8,
        }}
        axisBottom={null}
        tooltip={({ data: d, value }) => (
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
            <strong>{d.sesion}</strong>
            <br />
            {value.toLocaleString("es-AR")} {unidadPeso} de volumen
          </div>
        )}
      />
    </div>
  );
}
