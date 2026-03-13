"use client";

import dynamic from "next/dynamic";
import { nivoTheme } from "./nivoTheme";

const ResponsiveBar = dynamic(
  () => import("@nivo/bar").then((m) => m.ResponsiveBar),
  { ssr: false }
);

interface Props {
  data: { semana: string; semanaLabel?: string; volumen: number }[];
  unidadPeso?: "kg" | "lbs";
}

export default function VolumenChart({ data, unidadPeso = "kg" }: Props) {
  return (
    <div style={{ height: 220 }}>
      <ResponsiveBar
        data={data}
        keys={["volumen"]}
        indexBy="semana"
        margin={{ top: 20, right: 10, bottom: 50, left: 52 }}
        padding={0.35}
        colors={["#f4634a"]}
        borderRadius={3}
        theme={nivoTheme}
        axisBottom={{
          tickSize: 0,
          tickPadding: 8,
          tickRotation: -45,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 8,
          format: (v) => (v === 0 ? "" : `${(v / 1000).toFixed(0)}k`),
        }}
        gridYValues={4}
        enableLabel
        label={({ value }) =>
          value != null && value >= 5000
            ? `${Math.round((value as number) / 1000)}k`
            : ""
        }
        labelSkipHeight={24}
        labelTextColor="#e8e8e8"
        tooltip={({ value, indexValue, data }) => (
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
            <strong>{(data as { semanaLabel?: string }).semanaLabel ?? indexValue}</strong>
            <br />
            {value.toLocaleString("es-AR")} {unidadPeso} de volumen
          </div>
        )}
      />
    </div>
  );
}
